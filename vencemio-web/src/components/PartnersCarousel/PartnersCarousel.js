import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PartnersCarousel.css"; // Archivo CSS para estilos

const partners = [
  { id: 1, name: "Yoplait", logo: "/logos/yoplait.png" },
  { id: 2, name: "Chobani", logo: "/logos/chobani.png" },
  { id: 3, name: "OXXO", logo: "/logos/oxxo.png" },
  { id: 4, name: "Heineken", logo: "/logos/heineken.png" },
  { id: 5, name: "FUD", logo: "/logos/fud.png" },
];

function PartnersCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768, // Ajuste para pantallas pequeñas
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480, // Ajuste para pantallas muy pequeñas
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section id= "partners" className="partners-carousel">
      <h2 className="carousel-title">Nuestros Socios</h2>
      <Slider {...settings}>
        {partners.map((partner) => (
          <div key={partner.id} className="partner-slide">
            <img src={partner.logo} alt={partner.name} className="partner-logo" />
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default PartnersCarousel;
