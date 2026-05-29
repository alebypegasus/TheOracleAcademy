import React, { useEffect } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

// @ts-ignore
const mpPublicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || "TEST-YOUR-PUBLIC-KEY-HERE";
initMercadoPago(mpPublicKey, { locale: 'pt-BR' });

interface CheckoutBrickProps {
  preferenceId: string;
  onSuccess?: (paymentId?: string) => void;
  onError?: (error: any) => void;
  onReady?: () => void;
}

export function CheckoutBrick({ preferenceId, onSuccess, onError, onReady }: CheckoutBrickProps) {
  useEffect(() => {
    if (!mpPublicKey || mpPublicKey === "TEST-YOUR-PUBLIC-KEY-HERE") {
      console.warn("Mercado Pago Public Key não está configurada no .env");
    }
  }, []);

  const initialization: any = {
    preferenceId: preferenceId,
  };

  const customization: any = {
    paymentMethods: {
      creditCard: "all",
      debitCard: "all",
      ticket: "all",
      bankTransfer: "all",
      mercadoPago: "all",
    },
    visual: {
      style: {
        theme: "dark" as const,
      }
    }
  };

  const onSubmit = async ({ selectedPaymentMethod, formData }: any) => {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  };

  return (
    <div className="w-full relative">
      <Payment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={(error) => {
          console.error("Payment Brick Error:", error);
          if (onError) onError(error);
        }}
      />
    </div>
  );
}
