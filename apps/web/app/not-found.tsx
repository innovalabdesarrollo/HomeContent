import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-3xl text-brand-900">Página no encontrada</h1>
      <p className="mt-2 text-brand-900/70">El recurso no existe o fue movido.</p>
      <Link href="/" className="btn-primary mt-6 inline-flex">
        Volver al inicio
      </Link>
    </div>
  );
}
