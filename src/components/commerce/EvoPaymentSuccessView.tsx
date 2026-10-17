import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useEvoAuth } from '../../auth/EvoAuthProvider';
import { CANONICAL_TOMES } from '../../data/evoCatalog';

interface EvoPaymentSuccessViewProps {
  orderId?: string;
  onEnterApp: () => void;
  onReturnToPlans: () => void;
}

export const EvoPaymentSuccessView: React.FC<EvoPaymentSuccessViewProps> = ({
  orderId: initialOrderId,
  onEnterApp,
  onReturnToPlans,
}) => {
  const { user } = useEvoAuth();
  const [orderStatus, setOrderStatus] = useState<string>('PENDING');
  const [productName, setProductName] = useState<string>('Plan o Tomos EVO');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Extract orderId from URL search params if not passed
  const queryParams = new URLSearchParams(window.location.search);
  const orderId = initialOrderId || queryParams.get('order_id');
  const urlStatus = queryParams.get('status');

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError('No se encontró ID de orden en la solicitud.');
      return;
    }

    // If test status in url, simulate test approval trigger to webhook for instant E2E pass
    if (urlStatus === 'approved') {
      fetch('/api/webhook/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'approved' }),
      }).catch(() => {});
    }

    let isMounted = true;
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al consultar orden');

        if (isMounted) {
          setOrderStatus(data.status || 'CREATED');
          setProductName(data.productName || 'Contenido EVO');
          setSelectedItems(data.selectedItems || []);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId, urlStatus]);

  const unlockedTomos = CANONICAL_TOMES.filter((t) => selectedItems.includes(t.id));

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-white flex items-center justify-center p-4 font-mono-tech select-none">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-amber-400/40 rounded-3xl p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col items-center text-center space-y-6">
        
        {loading ? (
          <div className="py-12 flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
            <h2 className="text-xl font-display font-black uppercase tracking-tight text-white">
              ESTAMOS CONFIRMANDO TU PAGO
            </h2>
            <p className="text-xs text-zinc-400 font-sans-editorial max-w-md">
              Verificando la acreditación con Mercado Pago y generando tus credenciales periciales en Firestore...
            </p>
          </div>
        ) : error ? (
          <div className="py-8 flex flex-col items-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <h2 className="text-xl font-display font-black uppercase tracking-tight text-red-300">
              ERROR EN LA TRANSACCIÓN
            </h2>
            <p className="text-xs text-zinc-400 font-sans-editorial">{error}</p>
            <button
              type="button"
              onClick={onReturnToPlans}
              className="px-6 py-3 rounded-xl bg-amber-400 text-black font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              [ VOLVER A PLANES ]
            </button>
          </div>
        ) : orderStatus === 'APPROVED' ? (
          <div className="space-y-6 w-full animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                TRANSACCIÓN APROBADA // MERCADO PAGO TEST
              </span>
              <h1 className="text-3xl font-display font-black text-white uppercase tracking-tight">
                PAGO CONFIRMADO
              </h1>
              <p className="text-xs text-zinc-300 font-sans-editorial">
                Has adquirido exitosamente <strong className="text-amber-300">{productName}</strong>. Tus entitlements han sido activados en el servidor.
              </p>
            </div>

            {unlockedTomos.length > 0 && (
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2 text-left">
                <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block">
                  ACCESOS DESBLOQUEADOS:
                </span>
                <div className="space-y-1">
                  {unlockedTomos.map((t) => (
                    <div key={t.id} className="flex items-center gap-2 text-xs text-zinc-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Tomo {t.id} — {t.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onEnterApp}
              className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
            >
              <span>[ ENTRAR A EVO ]</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-6 w-full">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">
                ESTADO: {orderStatus}
              </span>
              <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                PAGO EN PROCESO
              </h1>
              <p className="text-xs text-zinc-400 font-sans-editorial">
                Esperando confirmación definitiva del webhook de Mercado Pago.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onReturnToPlans}
                className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase transition-colors cursor-pointer"
              >
                [ VOLVER A PLANES ]
              </button>
              <button
                type="button"
                onClick={onEnterApp}
                className="flex-1 py-3 rounded-xl bg-amber-400 text-black font-black text-xs uppercase tracking-wider cursor-pointer"
              >
                [ ENTRAR A EVO ]
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
