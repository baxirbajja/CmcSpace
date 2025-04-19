import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../../../utils/axiosConfig';
import styles from './Login.module.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', formData);
      
      // Stocker le token dans le localStorage
      localStorage.setItem('token', response.data.token);
      
      // Mettre à jour l'état d'authentification
      onLogin(true);
      
      // Rediriger vers la page d'administration
      navigate('/admin/spaces');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion. Veuillez réessayer.');
      console.error('Erreur de connexion:', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginWrapper}>
        <div className={styles.logoSection}>
          <Link to="/">
            <img src="/images/logo.png" alt="CMC Logo" />
          </Link>
        </div>

        <motion.div 
          className={styles.formSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>
            <span className={styles.admin}>ADMIN</span>
            <span className={styles.panel}>PANEL</span>
          </h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrapper}>
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Votre email"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Mot de passe</label>
              <div className={styles.inputWrapper}>
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Votre mot de passe"
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.loginBtn}>
              Se connecter
            </button>

            <Link to="/" className={styles.backLink}>
              <i className="fas fa-arrow-left"></i>
              Retour au site
            </Link>
          </form>
        </motion.div>
      </div>

      <div className={styles.illustration}>
        <div className={styles.overlay}></div>
      </div>
    </div>
  );
};

export default Login;
