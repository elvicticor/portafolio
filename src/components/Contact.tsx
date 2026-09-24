import { useRef, useState } from "react";
import type { PortfolioConfig } from "../types/portfolio";

export function Contact({ portfolio }: { portfolio: PortfolioConfig }) {
  const [toast, setToast] = useState("");
  const timeoutRef = useRef<number | undefined>(undefined);
  const github = `https://github.com/${portfolio.githubUser}`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolio.email);
      setToast("Correo copiado ✓");
    } catch {
      setToast(portfolio.email);
    }
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setToast(""), 2200);
  };

  return (
    <>
      <section id="contacto" className="contact container">
        <p className="section__index mono">05</p>
        <h2 className="contact__title" data-reveal>¿Construimos algo <em>juntos</em>?</h2>
        <a className="contact__email" href={`mailto:${portfolio.email}`} data-reveal data-magnetic>{portfolio.email}</a>
        {portfolio.phone && <a className="contact__phone mono" href={`tel:${portfolio.phone.replace(/\s/g, "")}`} data-reveal>{portfolio.phone}</a>}
        <div className="contact__actions" data-reveal>
          <button className="btn btn--ghost" type="button" onClick={copyEmail} data-magnetic>Copiar correo</button>
          {portfolio.phone && <a className="btn btn--ghost" href={`tel:${portfolio.phone.replace(/\s/g, "")}`} data-magnetic>Llamar</a>}
          <a className="btn btn--ghost" href={portfolio.cv} download data-magnetic>Descargar CV</a>
          <a className="btn btn--ghost" href={github} target="_blank" rel="noopener noreferrer" data-magnetic>GitHub</a>
        </div>
      </section>
      <div className={`toast${toast ? " is-on" : ""}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
