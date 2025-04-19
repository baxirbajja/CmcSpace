import React from "react";
import styles from "./CMC.module.css";
import { Link } from "react-router-dom";

const CMC = () => {
  const stats = [
    { number: "2000+", label: "Étudiants", icon: "fas fa-user-graduate" },
    { number: "50+", label: "Formateurs", icon: "fas fa-chalkboard-teacher" },
    { number: "20+", label: "Salles", icon: "fas fa-door-open" },
    { number: "95%", label: "Taux de réussite", icon: "fas fa-chart-line" },
  ];

  const facilities = [
    {
      title: "Bibliothèque Moderne",
      description:
        "Un espace de lecture et d'étude équipé des dernières technologies et ressources pédagogiques.",
      icon: "fas fa-book-reader",
    },
    {
      title: "Laboratoires Informatiques",
      description:
        "Des salles équipées d'ordinateurs performants et des logiciels professionnels.",
      icon: "fas fa-laptop-code",
    },
    {
      title: "Espaces de Collaboration",
      description:
        "Des zones dédiées aux travaux de groupe et aux projets collaboratifs.",
      icon: "fas fa-users",
    },
    {
      title: "Salles Multimédia",
      description:
        "Des espaces équipés pour la production audiovisuelle et le montage.",
      icon: "fas fa-film",
    },
  ];

  const programs = [
    {
      title: "Développement Digital",
      description: "Formation en développement web, mobile et logiciel",
      duration: "2 ans",
      icon: "fas fa-code",
    },
    {
      title: "Infrastructure Digitale",
      description: "Formation en réseaux et systèmes informatiques",
      duration: "2 ans",
      icon: "fas fa-network-wired",
    },
    {
      title: "Design Digital",
      description: "Formation en design graphique et UX/UI",
      duration: "2 ans",
      icon: "fas fa-palette",
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/images/logo.png" alt="CMC Logo" />
        </div>
        <nav className={styles.nav}>
          <Link to="/">ACCUEIL</Link>
          <Link to="/explorer">ESPACES</Link>
          <Link to="/contact">CONTACT</Link>
          <Link to="/cmc">CMC</Link>
          <div className={styles.contact}>
            <span>+212 5 85 76 48 52</span>
          </div>
        </nav>
      </header>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>CMC RABAT</h1>
          <p>Centre des Métiers et des Compétences de Rabat</p>
          <p className={styles.subtitle}>Excellence, Innovation, et Réussite</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <i className={stat.icon}></i>
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className={styles.aboutContent}>
          <h2>À Propos du CMC Rabat</h2>
          <p>
            Le Centre des Métiers et des Compétences de Rabat est un
            établissement d'excellence dédié à la formation professionnelle dans
            les domaines du numérique. Notre mission est de former les talents
            de demain en leur offrant un environnement d'apprentissage moderne
            et innovant.
          </p>
          <p>
            Situé au cœur de Rabat, notre centre dispose d'infrastructures
            modernes et d'équipements de pointe pour assurer une formation de
            qualité, alignée avec les besoins du marché du travail.
          </p>
        </div>
      </section>

      {/* Facilities Section */}
      <section className={styles.facilities}>
        <h2>Nos Installations</h2>
        <div className={styles.facilitiesGrid}>
          {facilities.map((facility, index) => (
            <div key={index} className={styles.facilityCard}>
              <i className={facility.icon}></i>
              <h3>{facility.title}</h3>
              <p>{facility.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs Section */}
      <section className={styles.programs}>
        <h2>Nos Formations</h2>
        <div className={styles.programsGrid}>
          {programs.map((program, index) => (
            <div key={index} className={styles.programCard}>
              <div className={styles.programHeader}>
                <i className={program.icon}></i>
                <h3>{program.title}</h3>
              </div>
              <p>{program.description}</p>
              <div className={styles.programDuration}>
                <i className="fas fa-clock"></i>
                <span>{program.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contact}>
        <h2>Nous Contacter</h2>
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <h3>Adresse</h3>
              <p>Avenue Hassan II, Rabat, Maroc</p>
            </div>
          </div>
          <div className={styles.contactItem}>
            <i className="fas fa-phone"></i>
            <div>
              <h3>Téléphone</h3>
              <p>+212 5XX-XXXXXX</p>
            </div>
          </div>
          <div className={styles.contactItem}>
            <i className="fas fa-envelope"></i>
            <div>
              <h3>Email</h3>
              <p>contact@cmc-rabat.ma</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CMC;
