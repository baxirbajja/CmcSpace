import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo}>
        <Link to="/">
          <img src="/images/logo.png" alt="CMC Logo" />
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/">ACCUEIL</Link>
        <Link to="/spaces">ESPACES</Link>
        <Link to="/cmc">CMC</Link>
        <Link to="/contact">CONTACT</Link>
        <div className={styles.contact}>
          <span>+212 5 85 76 48 52</span>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
