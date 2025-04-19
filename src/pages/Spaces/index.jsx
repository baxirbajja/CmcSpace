import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Spaces.module.css";

const spaces = [
  {
    id: 1,
    _id: 1,
    title: "Bibliothèque Moderne",
    description:
      "Un espace calme et inspirant pour la lecture et l'étude, équipé de ressources multimédias modernes.",
    image: "/images/espace1.png",
    capacity: 30,
    status: "active"
  },
  {
    id: 2,
    _id: 2,
    title: "Salle de Conférence",
    description:
      "Salle polyvalente équipée de matériel audiovisuel pour vos présentations et événements.",
    image: "/images/espace2.png",
    capacity: 50,
    status: "active"
  },
  {
    id: 3,
    _id: 3,
    title: "Espace Créatif",
    description:
      "Un environnement stimulant pour les activités créatives et collaboratives.",
    image: "/images/espace3.png",
    capacity: 25,
    status: "active"
  },
  {
    id: 4,
    _id: 4,
    title: "Espace Créatif",
    description:
      "Un environnement stimulant pour les activités créatives et collaboratives.",
    image: "/images/espace4.png",
    capacity: 20,
    status: "maintenance"
  },
  {
    id: 5,
    _id: 5,
    title: "Espace Créatif",
    description:
      "Un environnement stimulant pour les activités créatives et collaboratives.",
    image: "/images/espace5.png",
    capacity: 15,
    status: "active"
  },
];

const Spaces = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
            <span>+62 485 76 48 52</span>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className={styles.nos}>NOS</span>
          <span className={styles.espaces}>ESPACES</span>
        </motion.h1>

        <div className={styles.spacesGrid}>
          {loading ? (
            <p>Chargement des espaces...</p>
          ) : error ? (
            <p>{error}</p>
          ) : spaces.length === 0 ? (
            <p>Aucun espace disponible pour le moment.</p>
          ) : (
            spaces.map((space, index) => (
              <motion.div
                key={space.id}
                className={styles.spaceCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className={styles.imageContainer}>
                  <img src={space.image} alt={space.title} />
                  {space.status === 'maintenance' && (
                    <span className={styles.maintenanceTag}>En maintenance</span>
                  )}
                </div>
                <div className={styles.content}>
                  <h2>{space.title}</h2>
                  <p>{space.description}</p>
                  <div className={styles.spaceDetails}>
                    <span><i className="fas fa-users"></i> Capacité: {space.capacity}</span>
                  </div>
                  {space.status === 'active' && (
                    <Link
                      to={`/reserver/${space._id}`}
                      className={styles.reserveBtn}
                    >
                      Reserver
                    </Link>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Spaces;
