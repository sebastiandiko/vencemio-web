import React from "react";
import "./AboutUs.css"; // Archivo CSS para estilos

function AboutUs() {
  return (
    <section id="sobre-nosotros" className="about-section">
      {/* Título Principal */}
      <h2 className="about-title">Sobre Nosotros</h2>
      <p className="about-subtitle">Transformando el desperdicio en oportunidad.</p>

      {/* Introducción */}
      <div className="about-intro">
        <p>
          En Vencemio, creemos que cada producto merece una segunda oportunidad. Nuestra misión es
          reducir el desperdicio de alimentos mientras ofrecemos a los consumidores y supermercados
          una solución sostenible, económica y responsable. ¡Juntos, podemos marcar la diferencia!
        </p>
      </div>

      {/* Misión y Visión */}
      <div className="mission-vision">
        <div className="mission">
          <h3>Nuestra Misión</h3>
          <p>
            Reducir el desperdicio de alimentos conectando supermercados y consumidores a través de
            tecnología innovadora, promoviendo prácticas de consumo responsable y sostenible.
          </p>
        </div>
        <div className="vision">
          <h3>Nuestra Visión</h3>
          <p>
            Ser la plataforma líder en Argentina para la gestión de productos cercanos a vencer,
            contribuyendo a un planeta más sostenible y a una economía circular que beneficie a
            todos.
          </p>
        </div>
      </div>

      {/* Valores */}
      <div className="values">
        <h3>Nuestros Valores</h3>
        <ul>
          <li>
            <strong>Innovación:</strong> Utilizamos tecnología para crear soluciones prácticas y
            eficientes.
          </li>
          <li>
            <strong>Sostenibilidad:</strong> Promovemos un modelo de consumo más consciente.
          </li>
          <li>
            <strong>Responsabilidad Social:</strong> Ayudamos a mejorar la calidad de vida de las
            personas y a reducir el impacto ambiental.
          </li>
          <li>
            <strong>Compromiso:</strong> Trabajamos con pasión para ofrecer beneficios tangibles a
            consumidores y supermercados.
          </li>
        </ul>
      </div>

      {/* El Equipo Detrás */}
      <div className="team">
        <h3>Conoce a Nuestro Equipo</h3>
        <div className="team-members">
          <div className="team-member">
            <img src="/path/to/matias-photo.jpg" alt="Matías Zalazar" />
            <h4>Matías Zalazar</h4>
            <p>Co-Fundador</p>
            <p>"Creemos en un futuro donde desperdiciar ya no sea una opción."</p>
          </div>
          <div className="team-member">
            <img src="/path/to/sebastian-photo.jpg" alt="Sebastián Dikowiec" />
            <h4>Sebastián Dikowiec</h4>
            <p>Co-Fundador</p>
            <p>"Un producto desechado hoy puede ser una oportunidad mañana."</p>
          </div>
        </div>
        <p>Únete a nuestro movimiento y sé parte del cambio.</p>
        <button className="cta-button">Súmate a la Comunidad</button>
      </div>
    </section>
  );
}

export default AboutUs;
