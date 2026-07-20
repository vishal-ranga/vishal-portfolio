import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-bg">
      <p className="font-mono text-xs text-emerald mb-3">404</p>
      <h1 className="font-display text-2xl font-semibold text-ink mb-3">Page not found</h1>
      <p className="text-ink-soft text-sm mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-ink text-white text-sm font-medium rounded-full px-5 py-2.5 hover:bg-emerald-deep transition-colors"
      >
        Back to home
      </Link>
    </main>
  );
}
