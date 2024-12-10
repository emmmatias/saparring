import React from 'react';
import Link from 'next/link';


const FooterElement = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-column">
            <div className="footer-brand">
              <svg
                style={{ width: 24, height: 24 }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                />
              </svg>
              <h3>Sparring Labs</h3>
            </div>
            <p className="footer-description">
              Plataforma especializada en entrevistas técnicas
            </p>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li>
                <Link href="/legal/lopd">Protección de Datos</Link>
              </li>
              <li>
                <Link href="/legal/condiciones">Condiciones de Uso</Link>
              </li>
              <li>
                <Link href="/legal/plataforma">Uso de la Plataforma</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Empresa</h4>
            <ul className="footer-links">
              <li>
                <Link href="/empresas">Para Empresas</Link>
              </li>
              <li>
                <Link href="/casos-uso">Casos de uso</Link>
              </li>
              <li>
                <Link href="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="copyright">
            &copy; 2024 Sparring Labs - Entrevistas Técnicas -{' '}
            <Link href="https://www.sparring.dev" target="_blank">
              www.sparring.dev
            </Link>{' '}
            - Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterElement;