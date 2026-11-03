"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/celosias", label: "Celosías" },
  { href: "/contacto", label: "Contacto" },
  { href: "/crm", label: "CRM" },
  { href: "/admin", label: "Admin" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-900/10 bg-[#f7f5f0]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-xl tracking-tight text-brand-900">
          ARGA <span className="text-accent-500">Manufactura CNC</span>
        </Link>
        <button
          type="button"
          className="btn-ghost px-3 py-2 md:hidden"
          aria-label="Menú"
          onClick={() => setOpen((v) => !v)}
        >
          Menú
        </button>
        <nav className="hidden gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-2 text-sm ${
                pathname === l.href
                  ? "bg-brand-700 text-white"
                  : "text-brand-900/80 hover:bg-brand-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-brand-900/10 px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-3 py-2 text-sm ${
                pathname === l.href
                  ? "bg-brand-700 text-white"
                  : "text-brand-900/80 hover:bg-brand-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
