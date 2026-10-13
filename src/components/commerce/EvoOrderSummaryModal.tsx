import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, XCircle, ArrowRight, Lock, Sparkles, CreditCard, Loader2 } from 'lucide-react';
import { EvoPriceItem } from '../../data/evoPricing';
import { CANONICAL_TOMES } from '../../data/evoCatalog';
import { useEvoAuth } from '../../auth/EvoAuthProvider';

interface EvoOrderSummaryModalProps {
  product: EvoPriceItem;
  selectedTomeIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onChangeSelection: () => void;
  onRequireAuthToCheckout: (productId: string, selectedTomeIds: string[]) => void;
}

export const EvoOrderSummaryModal: React.FC<EvoOrderSummaryModalProps> = ({
  product,
  selectedTomeIds,
  isOpen,
  onClose,
  onChangeSelection,
  onRequireAuthToCheckout,
}) => {
  const { user } = useEvoAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedTomos = CANONICAL_TOMES.filter((t) => selectedTomeIds.includes(t.id));

  const handleProceedToPayment = async () => {
    if (!user) {
      // Require auth with preserved state context
      onRequireAuthToCheckout(product.id, selectedTomeIds);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const token = await user.getIdToken();
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          selectedItems: selectedTomeIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al crear la orden de pago');
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error('No se recibió la URL de pago de Mercado Pago');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Error de conexión con la pasarela de pagos');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono-tech select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(245,158,11,0.15)] flex flex-col space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs tracking-widest uppercase font-black">
              <CreditCard className="w-4 h-4" />
              <span>RESUMEN DE COMPRA // MERCADO PAGO CHECKOUT PRO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight mt-1">
              CONFIRMACIÓN DE ORDEN
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product & Price */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
              {product.name}
            </span>
            <span className="text-xs font-bold text-zinc-400 uppercase">
              {product.duration}
            </span>
          </div>
          <p className="text-xs text-zinc-300 font-sans-editorial">
            {product.description}
          </p>
          <div className="pt-3 border-t border-zinc-800 flex items-baseline justify-between">
            <span className="text-xs text-zinc-400 uppercase font-bold">Total a Pagar:</span>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-amber-400 font-bold ml-1.5 uppercase">
                {product.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Selected Items (if pack) */}
        {selectedTomos.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
                Selección ({selectedTomos.length} Tomos):
              </span>
              <button
                type="button"
                onClick={onChangeSelection}
                className="text-xs text-amber-400 hover:underline uppercase font-bold cursor-pointer"
              >
                [ CAMBIAR SELECCIÓN ]
              </button>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {selectedTomos.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs">
                  <span className="text-amber-300 font-bold">TOMO {t.id}</span>
                  <span className="text-zinc-200 truncate ml-2 font-sans-editorial">{t.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Included / Excluded Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <span className="font-bold uppercase text-emerald-400 tracking-wider block">QUÉ INCLUYE</span>
            <div className="space-y-1.5">
              {product.includedFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-zinc-300 font-sans-editorial">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-red-950/20 border border-red-500/30">
            <span className="font-bold uppercase text-red-400 tracking-wider block">QUÉ NO INCLUYE</span>
            <div className="space-y-1.5">
              {product.excludedFeatures.length > 0 ? (
                product.excludedFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-zinc-400 font-sans-editorial">
                    <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))
              ) : (
                <span className="text-zinc-500 italic">Acceso total sin exclusiones</span>
              )}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Footer CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={onChangeSelection}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            [ CAMBIAR SELECCIÓN ]
          </button>
          
          <button
            type="button"
            disabled={loading}
            onClick={handleProceedToPayment}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>GENERANDO ORDEN...</span>
              </>
            ) : (
              <>
                <span>[ CONTINUAR AL PAGO ]</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
