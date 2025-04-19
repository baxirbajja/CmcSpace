import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
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

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.heroText}>
            <h1>
              <span className={styles.espaces}>ESPACES CMC</span>
              <span className={styles.reservation}>RESERVATION</span>
            </h1>
            <div className={styles.buttons}>
              <Link to="/explorer" className={styles.exploreBtn}>
                Explorer nos Espaces
              </Link>
              <Link to="/reserver" className={styles.reserveBtn}>
                Reserver Espace
              </Link>
            </div>
          </div>

          <div className={styles.gallery}>
            <div className={styles.galleryItem}>
              <img src="/images/espace6.png" alt="Espace collaboratif" />
            </div>
            <div className={styles.galleryItem}>
              <img src="/images/espace3.png" alt="Salle de conférence" />
            </div>
            <div className={styles.galleryItem}>
              <img src="/images/espace1.png" alt="Espace créatif" />
            </div>
          </div>
        </div>
        <hr />
      </main>
    </div>
  );
};

export default Home;
