import React, { useState } from 'react';
import { X, ShieldCheck, User as UserIcon, RefreshCw, Copy, Check, Sparkles, Lock } from 'lucide-react';
import { useEvoAuth } from '../../auth/EvoAuthProvider';
import { useEvoAccess } from '../../auth/EvoAccessContext';

interface EvoMyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePlans?: () => void;
}

export const EvoMyAccountModal: React.FC<EvoMyAccountModalProps> = ({
  isOpen,
  onClose,
  onNavigatePlans,
}) => {
  const { user, uid, email, displayName, photoURL, emailVerified, isOwner, refreshTokenClaims } = useEvoAuth();
  const { entitlements } = useEvoAccess();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  const [copiedUid, setCopiedUid] = useState(false);

  if (!isOpen || !user) return null;

  const handleRefreshClaims = async () => {
    setIsRefreshing(true);
    setRefreshMessage(null);
    try {
      const isNowOwner = await refreshTokenClaims(true);
      if (isNowOwner) {
        setRefreshMessage('Token actualizado con éxito: rol OWNER detectado en Custom Claims.');
      } else {
        setRefreshMessage('Token actualizado con éxito: rol USER (sin claim de owner).');
      }
    } catch (err: any) {
      setRefreshMessage(`Error al refrescar token: ${err?.message || 'Error desconocido'}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyUid = () => {
    if (!uid) return;
    navigator.clipboard.writeText(uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const initials = (displayName || email || 'EVO')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 font-mono-tech select-none">
      <div className="relative w-full max-w-lg bg-[#0b0e17] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wider uppercase">
                MI CUENTA // IDENTIDAD EVO LABS
              </h2>
              <span className="text-[10px] text-zinc-400 font-sans-editorial">
                Estado de sesión, credenciales y privilegios periciales
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* User Card */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            {photoURL ? (
              <img
                src={photoURL}
                alt={displayName || 'Avatar'}
                className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400/40 shadow-md shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/30 border-2 border-amber-400/40 flex items-center justify-center text-amber-200 font-black text-lg tracking-wider shrink-0">
                {initials}
              </div>
            )}

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-base truncate font-sans-editorial">
                  {displayName || 'Usuario EVO'}
                </span>
                {isOwner ? (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                    OWNER
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                    PLAN GRATIS
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 truncate">{email || 'Sin correo asociado'}</p>
              <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                {emailVerified ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Email Verificado
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold">Email pendiente de verificación</span>
                )}
              </div>
            </div>
          </div>

          {/* Technical Details Grid */}
          <div className="space-y-3">
            {/* UID Info */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  FIREBASE UID (IDENTIFICADOR ÚNICO)
                </span>
                <button
                  type="button"
                  onClick={handleCopyUid}
                  className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  title="Copiar UID para administración de claims"
                >
                  {copiedUid ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">COPIADO</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>COPIAR UID</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-200 font-mono select-all break-all bg-zinc-950 p-2 rounded border border-zinc-900">
                {uid || '—'}
              </p>
              <p className="text-[10px] text-zinc-500 font-sans-editorial">
                Este UID es requerido por el script administrativo local para asignar roles mediante Firebase Admin SDK.
              </p>
            </div>

            {/* Role & Entitlements Info */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  ESTADO DE PRIVILEGIOS & ACCESO
                </span>
                <span className={`text-[10px] font-bold uppercase ${isOwner ? 'text-amber-400' : 'text-zinc-400'}`}>
                  {isOwner ? 'ACCESO TOTAL // OWNER' : 'ACCESO BÁSICO // FREE'}
                </span>
              </div>
              <div className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                {isOwner ? (
                  <div className="space-y-1">
                    <p className="text-amber-300">
                      Privilegio OWNER activo verificado por <strong>Firebase Custom Claims</strong> (<code className="text-amber-400">role: "owner"</code>).
                    </p>
                    <p className="text-zinc-400 text-[11px]">
                      Habilitado para todos los Tomos 01-12, bancos de simulación, laboratorio forense y herramientas periciales.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-zinc-300">
                      Usuario en <strong>PLAN GRATIS</strong> (Modo Demostración). Acceso libre a Capítulos 01 y 02 del Tomo 01 y herramientas básicas.
                    </p>
                    <p className="text-zinc-400 text-[11px]">
                      Para habilitar contenido completo se requiere suscripción o asignación de claim en backend.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Feedback message */}
          {refreshMessage && (
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>{refreshMessage}</span>
            </div>
          )}

          {/* Refresh Token Claims Button */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={handleRefreshClaims}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              title="Fuerza la recarga del token de autenticación (getIdToken(true)) para detectar nuevos Custom Claims"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isRefreshing ? 'ACTUALIZANDO...' : 'ACTUALIZAR TOKEN // REFRESH CLAIM'}</span>
            </button>

            {onNavigatePlans && !isOwner && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigatePlans();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>VER PLANES</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-950/80 border-t border-zinc-800/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
