import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Contact.module.css";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

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
          <span className={styles.contactez}>CONTACTEZ</span>
          <span className={styles.nous}>NOUS</span>
        </motion.h1>

        <div className={styles.content}>
          <motion.div
            className={styles.contactInfo}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Informations de Contact</h2>
            <div className={styles.infoItem}>
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Adresse</h3>
                <p>123 Avenue Mohammed V, Casablanca, Maroc</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <i className="fas fa-phone"></i>
              <div>
                <h3>Téléphone</h3>
                <p>+62 485 76 48 52</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <i className="fas fa-envelope"></i>
              <div>
                <h3>Email</h3>
                <p>contact@cmc-spaces.ma</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div>
                <h3>Heures d'ouverture</h3>
                <p>Lundi - Vendredi: 8:30 - 17:30</p>
                <p>Samedi: 9:00 - 13:00</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.contactForm}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2>Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <input type="text" placeholder="Votre nom" required />
              </div>
              <div className={styles.formGroup}>
                <input type="email" placeholder="Votre email" required />
              </div>
              <div className={styles.formGroup}>
                <input type="text" placeholder="Sujet" required />
              </div>
              <div className={styles.formGroup}>
                <textarea placeholder="Votre message" rows="6" required />
              </div>
              <button type="submit" className={styles.submitBtn}>
                Envoyer le message
              </button>
            </form>
          </motion.div>
        </div>

        <motion.div
          className={styles.map}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.846447471236!2d-7.6192178!3d33.5731104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM0JzIzLjIiTiA3wrAzNycwOS4yIlc!5e0!3m2!1sen!2sma!4v1234567890"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default Contact;
