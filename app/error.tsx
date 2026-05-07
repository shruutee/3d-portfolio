"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-headline">Something went wrong</h1>
      <p className="max-w-md text-body text-muted-foreground">
        We hit an unexpected error. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-105"
      >
        Try again
      </button>
    </main>
  );
}