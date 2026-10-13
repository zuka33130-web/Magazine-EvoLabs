import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  ActionCodeSettings,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { auth } from '../services/firebase';

export interface EvoAuthContextValue {
  user: User | null;
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  loading: boolean;
  role: 'user' | 'owner';
  isOwner: boolean;
  register: (email: string, password: string, displayName?: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerification: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
  refreshTokenClaims: (forceRefresh?: boolean) => Promise<boolean>;
}

const EvoAuthContext = createContext<EvoAuthContextValue | undefined>(undefined);

export const EvoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [role, setRole] = useState<'user' | 'owner'>('user');
  const isRefreshingRef = useRef<boolean>(false);

  // Generates safe ActionCodeSettings returning to the current origin
  const getActionCodeSettings = (): ActionCodeSettings => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return {
      url: `${origin}/?verified=1`,
      handleCodeInApp: false,
    };
  };

  // Process redirect result if arriving back from redirect flow
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          setUser(result.user);
          setEmailVerified(Boolean(result.user.emailVerified));
          try {
            const tokenResult = await result.user.getIdTokenResult();
            const isOwnerRole = tokenResult.claims?.role === 'owner';
            setIsOwner(isOwnerRole);
            setRole(isOwnerRole ? 'owner' : 'user');
          } catch {
            setIsOwner(false);
            setRole('user');
          }
        }
      })
      .catch((error) => {
        console.warn('[EvoAuthProvider] Error handling redirect auth result:', error);
      });
  }, []);

  const refreshTokenClaims = useCallback(async (forceRefresh: boolean = true): Promise<boolean> => {
    if (!auth.currentUser) {
      setIsOwner(false);
      setRole('user');
      return false;
    }
    try {
      if (forceRefresh) {
        await auth.currentUser.getIdToken(true);
      }
      const tokenResult = await auth.currentUser.getIdTokenResult(forceRefresh);
      const isOwnerRole = tokenResult.claims?.role === 'owner';
      setIsOwner(isOwnerRole);
      setRole(isOwnerRole ? 'owner' : 'user');
      return isOwnerRole;
    } catch (err) {
      console.warn('[EvoAuthProvider] Error refreshing token claims:', err);
      return false;
    }
  }, []);

  const refreshUser = useCallback(async (): Promise<boolean> => {
    if (!auth.currentUser) {
      setEmailVerified(false);
      setIsOwner(false);
      setRole('user');
      return false;
    }
    if (isRefreshingRef.current) {
      return auth.currentUser.emailVerified;
    }
    isRefreshingRef.current = true;
    try {
      await auth.currentUser.reload();
      const verified = Boolean(auth.currentUser.emailVerified);
      setEmailVerified(verified);
      // Also refresh claims without forcing network unless needed
      try {
        const tokenResult = await auth.currentUser.getIdTokenResult();
        const isOwnerRole = tokenResult.claims?.role === 'owner';
        setIsOwner(isOwnerRole);
        setRole(isOwnerRole ? 'owner' : 'user');
      } catch {}
      // Trigger a state update with a cloned user reference to ensure consumers re-render
      setUser({ ...auth.currentUser } as User);
      return verified;
    } catch (err) {
      console.warn('[EvoAuthProvider] Error refreshing user status via reload():', err);
      return Boolean(auth.currentUser?.emailVerified);
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        async (currentUser) => {
          setUser(currentUser);
          setEmailVerified(currentUser ? Boolean(currentUser.emailVerified) : false);
          if (currentUser) {
            try {
              const tokenResult = await currentUser.getIdTokenResult();
              const isOwnerRole = tokenResult.claims?.role === 'owner';
              setIsOwner(isOwnerRole);
              setRole(isOwnerRole ? 'owner' : 'user');
            } catch (claimErr) {
              console.warn('[EvoAuthProvider] Error fetching token claims on auth change:', claimErr);
              setIsOwner(false);
              setRole('user');
            }
          } else {
            setIsOwner(false);
            setRole('user');
          }
          setLoading(false);
        },
        (error) => {
          console.error('[EvoAuthProvider] Error observing auth state:', error);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('[EvoAuthProvider] Auth listener error:', err);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Auto-refresh when user returns focus to tab or page becomes visible
  useEffect(() => {
    const handleFocusOrVisible = () => {
      if (auth.currentUser && !emailVerified) {
        refreshUser();
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleFocusOrVisible();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [emailVerified, refreshUser]);

  // Polling every 5s while user exists and email is not verified
  useEffect(() => {
    if (!user || emailVerified) return;

    const intervalId = window.setInterval(() => {
      refreshUser();
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [user, emailVerified, refreshUser]);

  const register = useCallback(
    async (email: string, password: string, displayName?: string): Promise<User> => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName && displayName.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      }
      try {
        await sendEmailVerification(cred.user, getActionCodeSettings());
      } catch (err) {
        console.warn('[EvoAuthProvider] Error sending verification email on register:', err);
      }
      setUser({ ...cred.user } as User);
      setEmailVerified(false);
      return cred.user;
    },
    []
  );

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    setUser(cred.user);
    setEmailVerified(Boolean(cred.user.emailVerified));
    return cred.user;
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setEmailVerified(Boolean(result.user.emailVerified));
      return result.user;
    } catch (popupError: any) {
      if (
        popupError?.code === 'auth/popup-blocked' ||
        popupError?.code === 'auth/operation-not-supported-in-this-environment'
      ) {
        console.info('[EvoAuthProvider] Popup blocked or unsupported, falling back to redirect');
        await signInWithRedirect(auth, provider);
        throw popupError;
      }
      throw popupError;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
    setEmailVerified(false);
    setIsOwner(false);
    setRole('user');
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email, getActionCodeSettings());
  }, []);

  const sendVerification = useCallback(async (): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error('No hay ningún usuario autenticado para enviar la verificación.');
    }
    await sendEmailVerification(auth.currentUser, getActionCodeSettings());
  }, []);

  const value: EvoAuthContextValue = {
    user,
    uid: user ? user.uid : null,
    email: user ? user.email : null,
    displayName: user ? user.displayName : null,
    photoURL: user ? user.photoURL : null,
    emailVerified,
    loading,
    role,
    isOwner,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    sendVerification,
    refreshUser,
    refreshTokenClaims,
  };

  return <EvoAuthContext.Provider value={value}>{children}</EvoAuthContext.Provider>;
};

export const useEvoAuth = () => {
  const context = useContext(EvoAuthContext);
  if (!context) {
    throw new Error('useEvoAuth must be used within an EvoAuthProvider');
  }
  return context;
};

