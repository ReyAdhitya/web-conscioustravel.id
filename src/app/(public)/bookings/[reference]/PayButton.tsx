"use client";

import { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

type Props = {
  bookingId: string;
  snapUrl: string;
  clientKey: string;
  initiatePayment: (bookingId: string) => Promise<{ token: string }>;
  onSuccess: () => Promise<void>;
};

export function PayButton({ bookingId, snapUrl, clientKey, initiatePayment, onSuccess }: Props) {
  const [snapReady, setSnapReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!snapReady || !window.snap) {
      setError("Payment widget is still loading. Please try again.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { token } = await initiatePayment(bookingId);
      window.snap.pay(token, {
        onSuccess: () => {
          onSuccess();
        },
        onPending: () => {
          onSuccess();
        },
        onError: () => {
          setError("Payment failed. Please try again.");
          setLoading(false);
        },
        onClose: () => {
          setLoading(false);
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src={snapUrl}
        data-client-key={clientKey}
        strategy="afterInteractive"
        onReady={() => setSnapReady(true)}
      />
      <div className="mt-8 rounded-xl border border-accent/40 bg-accent/5 p-8">
        <p className="text-xs tracking-[0.2em] uppercase text-accent mb-3">Complete payment</p>
        <h2 className="font-serif text-xl tracking-tight text-foreground">
          Pay now with Midtrans
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Bank transfer, GoPay, OVO, QRIS, or credit card. Choose at the next step.
        </p>
        {error && (
          <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}
        <button
          onClick={handlePay}
          disabled={loading || !snapReady}
          className="mt-6 inline-flex h-12 items-center rounded-full bg-accent px-8 text-sm tracking-wide text-accent-foreground transition hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Opening payment…" : !snapReady ? "Loading…" : "Pay now"}
        </button>
      </div>
    </>
  );
}
