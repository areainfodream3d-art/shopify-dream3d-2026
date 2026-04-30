import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useTranslation } from 'react-i18next';

interface PayPalPaymentProps {
  amount: string;
  currency?: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

export const PayPalPayment: React.FC<PayPalPaymentProps> = ({ 
  amount, 
  currency = "EUR",
  onSuccess,
  onError
}) => {
  const { t } = useTranslation();
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  if (!clientId) {
    console.error("PayPal Client ID is missing");
    return <div className="text-red-500">Errore configurazione PayPal</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <PayPalScriptProvider options={{ "clientId": clientId, currency: currency }}>
        <PayPalButtons 
          style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                    currency_code: currency
                  },
                  description: "Commissione Dream3D"
                },
              ],
              intent: "CAPTURE"
            });
          }}
          onApprove={(data, actions) => {
             if (actions.order) {
                return actions.order.capture().then((details) => {
                    onSuccess(details);
                });
             }
             return Promise.resolve();
          }}
          onError={(err) => {
            console.error("PayPal Error:", err);
            onError(err);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};
