import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="relative min-h-[78vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(26,40,33,0.78), rgba(42,63,53,0.45)), url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 pb-14 pt-24 text-white">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-accent-400">
            Manufactura CNC
          </p>
          <h1 className="font-display max-w-3xl text-4xl leading-tight sm:text-5xl md:text-6xl">
            ARGA
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            Soluciones de manufactura CNC para residencial e industrial/comercial.
            Celosías y piezas a medida.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/celosias" className="btn bg-accent-500 text-brand-900 hover:bg-accent-400">
              Ver celosías
            </Link>
            <Link href="/contacto" className="btn border border-white/40 bg-white/10 text-white hover:bg-white/20">
              Solicitar información
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-brand-900 sm:text-3xl">Residencial</h2>
          <p className="mt-3 text-brand-900/75">
            Celosías, fachadas y elementos decorativos para casas y departamentos.
            Acabados precisos con corte CNC.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-brand-900 sm:text-3xl">
            Industrial / Comercial
          </h2>
          <p className="mt-3 text-brand-900/75">
            Piezas y componentes para proyectos comerciales e industriales.
            Manufactura confiable y repetible.
          </p>
        </div>
      </section>
    </div>
  );
}
