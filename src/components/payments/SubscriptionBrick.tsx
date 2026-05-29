import React, { useEffect } from 'react';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';

// @ts-ignore
const mpPublicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || "TEST-YOUR-PUBLIC-KEY-HERE";
initMercadoPago(mpPublicKey, { locale: 'pt-BR' });

interface SubscriptionBrickProps {
  amount: number;
  payerEmail?: string;
  onSuccess?: (token: string, payerEmail: string) => void;
  onError?: (error: any) => void;
  onReady?: () => void;
}

export function SubscriptionBrick({ amount, payerEmail, onSuccess, onError, onReady }: SubscriptionBrickProps) {
  useEffect(() => {
    if (!mpPublicKey || mpPublicKey === "TEST-YOUR-PUBLIC-KEY-HERE") {
      console.warn("Mercado Pago Public Key não está configurada no .env (VITE_MERCADO_PAGO_PUBLIC_KEY).");
    }
  }, []);

  const initialization = {
    amount: amount,
    payer: payerEmail ? { email: payerEmail } : undefined
  };

  const customization = {
    visual: {
      style: {
        theme: "dark" as const,
      }
    }
  };

  const onSubmit = async (formData: any) => {
    return new Promise<void>((resolve, reject) => {
      try {
        if (onSuccess && formData.token) {
          const finalEmail = formData.payer?.email || payerEmail;
          onSuccess(formData.token, finalEmail);
        }
        resolve();
      } catch (err) {
        if (onError) onError(err);
        reject(err);
      }
    });
  };

  return (
    <div className="w-full relative">
      <CardPayment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={(error) => {
          console.error("Card Payment Brick Error:", error);
          if (onError) onError(error);
        }}
      />
    </div>
  );
}
