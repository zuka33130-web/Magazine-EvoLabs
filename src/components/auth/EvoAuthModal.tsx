import React, { useState, useEffect, useMemo } from 'react';
import { useEvoAuth } from '../../auth/EvoAuthProvider';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  Send,
  LogOut,
  Sparkles,
} from 'lucide-react';

export interface EvoAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLabel?: string | null;
  onVerifiedSuccess?: () => void;
}

type AuthTab = 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD';

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

function getFriendlyAuthErrorMessage(err: any): string {
  const code = err?.code || '';
  const msg = err instanceof Error ? err.message : String(err || '');

  if (code === 'auth/popup-closed-by-user' || msg.includes('auth/popup-closed-by-user')) {
    return 'Se cerró la ventana de Google antes de completar la autenticación.';
  }
  if (code === 'auth/cancelled-popup-request' || msg.includes('auth/cancelled-popup-request')) {
    return 'La solicitud de inicio de sesión con Google fue cancelada.';
  }
  if (code === 'auth/popup-blocked' || msg.includes('auth/popup-blocked')) {
    return 'El navegador bloqueó la ventana emergente de Google. Habilitá los popups para continuar.';
  }
  if (code === 'auth/account-exists-with-different-credential' || msg.includes('auth/account-exists-with-different-credential')) {
    return 'Ya existe una cuenta con este correo utilizando otro método de acceso.';
  }
  if (code === 'auth/user-disabled' || msg.includes('auth/user-disabled')) {
    return 'Esta cuenta ha sido inhabilitada por el administrador.';
  }
  if (code === 'auth/email-already-in-use' || msg.includes('auth/email-already-in-use')) {
    return 'Ya existe una cuenta registrada con este correo.';
  }
  if (code === 'auth/invalid-email' || msg.includes('auth/invalid-email')) {
    return 'El formato del correo electrónico no es válido.';
  }
  if (code === 'auth/weak-password' || msg.includes('auth/weak-password')) {
    return 'La contraseña es muy débil. Debe tener al menos 8 caracteres.';
  }
  if (code === 'auth/invalid-credential' || msg.includes('auth/invalid-credential')) {
    return 'Credenciales inválidas. Verificá tu email y contraseña.';
  }
  if (code === 'auth/user-not-found' || msg.includes('auth/user-not-found')) {
    return 'No encontramos una cuenta con ese correo.';
  }
  if (code === 'auth/wrong-password' || msg.includes('auth/wrong-password')) {
    return 'Contraseña incorrecta. Verificá tus datos.';
  }
  if (code === 'auth/too-many-requests' || msg.includes('auth/too-many-requests')) {
    return 'Demasiados intentos fallidos. Esperá unos minutos antes de intentar de nuevo.';
  }
  if (code === 'auth/network-request-failed' || msg.includes('auth/network-request-failed')) {
    return 'Error de conexión. Verificá tu acceso a internet.';
  }
  if (code === 'auth/operation-not-allowed' || msg.includes('auth/operation-not-allowed')) {
    return 'El registro con email está desactivado: avisá al administrador.';
  }
  if (code === 'auth/unauthorized-domain' || msg.includes('auth/unauthorized-domain')) {
    return 'Este dominio no está autorizado en Firebase: avisá al administrador.';
  }

  console.error('[EvoAuthModal] Error técnico de autenticación:', err);
  return 'Ocurrió un error. Intentá de nuevo.';
}

export const EvoAuthModal: React.FC<EvoAuthModalProps> = ({
  isOpen,
  onClose,
  targetLabel,
  onVerifiedSuccess,
}) => {
  const {
    user,
    emailVerified,
    login,
    loginWithGoogle,
    register,
    resetPassword,
    sendVerification,
    refreshUser,
    logout,
    loading: authLoading,
  } = useEvoAuth();

  const [activeTab, setActiveTab] = useState<AuthTab>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cooldown timer for resending verification email (60 seconds)
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // When email becomes verified while the modal is open, trigger success
  useEffect(() => {
    if (isOpen && user && emailVerified) {
      setSuccessMessage('¡Email verificado con éxito! Ingresando a EVO LABS...');
      const timeout = setTimeout(() => {
        if (onVerifiedSuccess) {
          onVerifiedSuccess();
        } else {
          onClose();
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, user, emailVerified, onVerifiedSuccess, onClose]);

  // Password strength calculation
  const passwordStrength = useMemo<{
    label: string;
    score: number;
    color: string;
  }>(() => {
    if (!password) return { label: '', score: 0, color: 'bg-zinc-800' };
    if (password.length < 8) return { label: 'Muy débil (mín. 8 caracteres)', score: 1, color: 'bg-rose-500' };
    
    let score = 1;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password) || /[^a-zA-Z0-9]/.test(password)) score++;
    if (password.length >= 10 && score >= 2) score++;

    if (score <= 2) return { label: 'Media', score: 2, color: 'bg-amber-400' };
    return { label: 'Fuerte', score: 3, color: 'bg-emerald-400' };
  }, [password]);

  if (!isOpen) return null;

  const isPendingVerification = Boolean(user && !emailVerified);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      setLoading(true);
      if (activeTab === 'LOGIN') {
        if (!email.trim() || !password) {
          throw new Error('auth/invalid-credential');
        }
        await login(email.trim(), password);
        // If logged-in user is already verified, close or continue
        // Note: if user is not verified, emailVerified will be false and
        // the modal will automatically display the pending verification screen
      } else if (activeTab === 'REGISTER') {
        if (!displayName.trim()) {
          setError('Por favor ingresá tu nombre o alias.');
          setLoading(false);
          return;
        }
        if (!email.trim() || !password) {
          setError('Por favor completá email y contraseña.');
          setLoading(false);
          return;
        }
        if (password.length < 8) {
          setError('La contraseña debe tener al menos 8 caracteres.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden.');
          setLoading(false);
          return;
        }
        await register(email.trim(), password, displayName.trim());
        setResendCooldown(60);
      } else if (activeTab === 'RESET_PASSWORD') {
        if (!email.trim()) {
          setError('Por favor ingresá tu correo electrónico.');
          setLoading(false);
          return;
        }
        await resetPassword(email.trim());
        setSuccessMessage('Si la dirección es válida, recibirás instrucciones para restablecer tu contraseña.');
      }
    } catch (err: any) {
      setError(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckVerification = async () => {
    setError(null);
    setCheckingVerification(true);
    try {
      const isNowVerified = await refreshUser();
      if (isNowVerified) {
        setSuccessMessage('¡Verificación confirmada!');
        setTimeout(() => {
          if (onVerifiedSuccess) onVerifiedSuccess();
          else onClose();
        }, 800);
      } else {
        setError('El correo todavía figura como no verificado. Hacé clic en el enlace que te enviamos y volvé a intentar.');
      }
    } catch (err: any) {
      setError(getFriendlyAuthErrorMessage(err));
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setSuccessMessage(null);
    try {
      setLoading(true);
      await sendVerification();
      setResendCooldown(60);
      setSuccessMessage('Correo de verificación reenviado con éxito.');
    } catch (err: any) {
      setError(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      await logout();
      setActiveTab('REGISTER');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(getFriendlyAuthErrorMessage(err));
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMessage(null);
    setGoogleLoading(true);
    try {
      const loggedUser = await loginWithGoogle();
      if (loggedUser.emailVerified) {
        setSuccessMessage('¡Sesión iniciada con Google! Ingresando a EVO LABS...');
        setTimeout(() => {
          if (onVerifiedSuccess) {
            onVerifiedSuccess();
          } else {
            onClose();
          }
        }, 800);
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Inicio de sesión con Google cancelado.');
      } else {
        setError(getFriendlyAuthErrorMessage(err));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-mono-tech select-none">
      <div className="max-w-md w-full bg-[#0a0d14] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative space-y-6">
        
        {/* Close Button: only enabled if NOT strictly locked in pending verification */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Cerrar ventana"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Badge */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>EVO LABS // AUTENTICACIÓN SEGURA</span>
          </div>
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
            {isPendingVerification
              ? 'REVISÁ TU CORREO'
              : activeTab === 'LOGIN'
              ? 'ACCESO TÉCNICO'
              : activeTab === 'REGISTER'
              ? 'CREAR CUENTA'
              : 'RECUPERAR CLAVE'}
          </h2>
          {targetLabel && (
            <p className="text-xs font-sans-editorial text-amber-300/90 pt-0.5">
              Estás por abrir: <strong className="text-white font-mono-tech">{targetLabel}</strong>
            </p>
          )}
        </div>

        {/* Error / Success Feedback Banners */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-sans-editorial">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-sans-editorial">{successMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* ESTADO PENDIENTE DE VERIFICACIÓN (PANTALLA FIJA)        */}
        {/* ======================================================== */}
        {isPendingVerification ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-amber-500/30 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[10px]">
                <Mail className="w-4 h-4" />
                <span>CONFIRMACIÓN DE CASILLA PENDIENTE</span>
              </div>
              <p className="text-zinc-200 font-sans-editorial text-xs leading-relaxed">
                Te enviamos un enlace de activación a{' '}
                <strong className="text-amber-300 font-mono-tech">{user?.email}</strong>.
                Abrilo para activar tu acceso y volvé a esta pestaña.
              </p>
              <div className="p-2.5 rounded-xl bg-black/50 border border-zinc-800 text-[11px] text-zinc-400 font-sans-editorial">
                💡 <span className="font-semibold text-zinc-300">Aviso:</span> Si no lo ves en tu bandeja de entrada, revisá tu carpeta de spam o promociones.
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {/* [Ya verifiqué] */}
              <button
                type="button"
                onClick={handleManualCheckVerification}
                disabled={checkingVerification || loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black uppercase text-xs tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.25)]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checkingVerification ? 'animate-spin' : ''}`} />
                <span>{checkingVerification ? 'COMPROBANDO...' : 'YA VERIFIQUÉ'}</span>
              </button>

              {/* [Reenviar correo] con cooldown visible */}
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendCooldown > 0 || loading || checkingVerification}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold uppercase text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {resendCooldown > 0
                    ? `REENVIAR CORREO EN ${resendCooldown}S`
                    : loading
                    ? 'ENVIANDO...'
                    : 'REENVIAR CORREO'}
                </span>
              </button>

              {/* [Usar otro correo] */}
              <button
                type="button"
                onClick={handleSwitchAccount}
                disabled={loading || checkingVerification}
                className="w-full py-2 text-zinc-500 hover:text-zinc-300 text-[11px] font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3 h-3" />
                <span>USAR OTRO CORREO / CERRAR SESIÓN</span>
              </button>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* FORMULARIO NORMAL (LOGIN | REGISTER | RESET)             */
          /* ======================================================== */
          <div className="space-y-4">
            
            {/* Pestañas con mismo peso visual (Iniciar sesión | Crear cuenta) */}
            {activeTab !== 'RESET_PASSWORD' && (
              <>
                <div className="grid grid-cols-2 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('LOGIN');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                      activeTab === 'LOGIN'
                        ? 'bg-amber-400 text-black shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    INICIAR SESIÓN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('REGISTER');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                      activeTab === 'REGISTER'
                        ? 'bg-amber-400 text-black shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    CREAR CUENTA
                  </button>
                </div>

                {/* Botón Continuar con Google */}
                <div className="space-y-3 pt-1">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading || loading || authLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2.5 shadow-sm hover:shadow"
                  >
                    {googleLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        <span>CONECTANDO CON GOOGLE...</span>
                      </>
                    ) : (
                      <>
                        <GoogleIcon />
                        <span>Continuar con Google</span>
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-zinc-800"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                      o con correo
                    </span>
                    <div className="flex-grow border-t border-zinc-800"></div>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {activeTab === 'REGISTER' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 block">Nombre / Alias</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Tu nombre o nick de perito"
                      required
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400 block">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@dominio.com"
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {activeTab !== 'RESET_PASSWORD' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 block">Contraseña</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      required
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Indicador de fortaleza en registro */}
                  {activeTab === 'REGISTER' && password && (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center gap-1.5 h-1.5 w-full">
                        <div className={`flex-1 h-full rounded-full transition-colors ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-zinc-800'}`} />
                        <div className={`flex-1 h-full rounded-full transition-colors ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-zinc-800'}`} />
                        <div className={`flex-1 h-full rounded-full transition-colors ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-zinc-800'}`} />
                      </div>
                      <span className="text-[10px] text-zinc-400 block text-right font-sans-editorial">
                        Seguridad: <strong className="font-mono-tech">{passwordStrength.label}</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'REGISTER' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 block">Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repetí tu contraseña"
                      required
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || authLoading || googleLoading}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer disabled:opacity-50 mt-3"
              >
                {loading
                  ? 'PROCESANDO...'
                  : activeTab === 'LOGIN'
                  ? 'ENTRAR A EVO LABS'
                  : activeTab === 'REGISTER'
                  ? 'CREAR MI CUENTA'
                  : 'ENVIAR ENLACE'}
              </button>

              {/* Botones de navegación secundaria */}
              <div className="pt-2 text-xs flex items-center justify-between text-zinc-400">
                {activeTab === 'LOGIN' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('RESET_PASSWORD');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-[11px]"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}

                {activeTab === 'RESET_PASSWORD' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('LOGIN');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-amber-400 font-bold hover:underline cursor-pointer text-xs"
                  >
                    ← Volver a iniciar sesión
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
