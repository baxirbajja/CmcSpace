import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import styles from './Reservation.module.css';
import emailjs from '@emailjs/browser';

const timeSlots = [
  { id: 1, time: '8:30 - 11:00', value: '8:30-11:00' },
  { id: 2, time: '11:00 - 13:30', value: '11:00-13:30' },
  { id: 3, time: '13:30 - 16:00', value: '13:30-16:00' },
  { id: 4, time: '16:00 - 18:30', value: '16:00-18:30' },
];

const Reservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: '',
    space: '',
    event: '',
    description: '',
    date: new Date(),
    timeSlots: []
  });
  
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date
    }));
  };

  // Charger les espaces disponibles
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/spaces');
        setSpaces(response.data.data.filter(space => space.status === 'active'));
        setLoading(false);
        
        // Si un ID d'espace est fourni dans l'URL, présélectionner cet espace
        if (id) {
          setFormData(prev => ({
            ...prev,
            space: id
          }));
        }
      } catch (err) {
        setError('Erreur lors du chargement des espaces. Veuillez réessayer.');
        setLoading(false);
      }
    };
    
    fetchSpaces();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    try {
      console.log('Sending reservation data:', formData);
      const response = await axios.post('/api/reservations', formData);
      console.log('Reservation response:', response.data);
  
      // Préparer les paramètres pour l'e-mail
      const templateParams = {
        to_name: 'Administrateur CMC',
        from_name: formData.name,
        from_status: formData.status,
        email: formData.email,
        from_phone: formData.phone,
        event_name: formData.event,
        space_name: spaces.find(space => space._id === formData.space)?.title || 'Espace non spécifié',
        date: new Date(formData.date).toLocaleDateString('fr-FR'),
        time_slots: formData.timeSlots.join(', '),
        description: formData.description,
        action_required: 'Nouvelle réservation nécessite votre approbation',
      };
  
      // Envoyer l'e-mail
      try {
        await emailjs.send(
          'service_xktjxt8',
          'template_5z5hoxs',
          templateParams,
          'RM1sz94ruQRFcUUgP'
        );
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      }

      setSuccess(true);
      setSubmitting(false);
    } catch (err) {
      console.error('Reservation error:', err);
      setSubmitting(false);
      if (err.response && err.response.data) {
        console.error('Server error response:', err.response.data);
        if (Array.isArray(err.response.data.error)) {
          setError(err.response.data.error.join(', '));
        } else {
          setError(err.response.data.error || 'Une erreur est survenue. Veuillez réessayer.');
        }
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Erreur de connexion au serveur. Veuillez vérifier votre connexion et réessayer.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    }
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
        <h1 className={styles.title}>
          <span className={styles.reserver}>RESERVER</span>
          <span className={styles.espace}>ESPACE</span>
        </h1>

        {success && (
        <div className={styles.successMessage}>
          Votre réservation a été enregistrée avec succès! 
        </div>
      )}
      <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formLeft}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nom</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Votre email"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Votre numéro de téléphone"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">--choisir un status--</option>
                  <option value="stagiaire">Stagiaire</option>
                  <option value="formateur">Formateur</option>
                  <option value="externe">Externe</option>
                  <option value="responsable">Responsable</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="space">Espaces</label>
                <select
                  id="space"
                  name="space"
                  value={formData.space}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  <option value="">--choisir une espace--</option>
                  {spaces.map(space => (
                    <option key={space._id} value={space._id}>
                      {space.title}
                    </option>
                  ))}
                </select>
                {loading && <div className={styles.loadingText}>Chargement des espaces...</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="event">Événement</label>
                <input
                  type="text"
                  id="event"
                  name="event"
                  value={formData.event}
                  onChange={handleInputChange}
                  placeholder="Nom de l'événement"
                  required
                />
              </div>

           

             

              <div className={styles.formGroup}>
                <label htmlFor="description">Description de l'Événement</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description de l'événement..."
                  required
                />
              </div>
            </div>

            <div className={styles.formRight}>
              <div className={styles.datePickerContainer}>
                <label>Sélectionner une date</label>
                <DatePicker
                  selected={formData.date}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  className={styles.datePicker}
                />
              </div>

              <div className={styles.timeSlots}>
                <label>Sélectionner des créneaux horaires (maximum 2)</label>
                <div className={styles.timeSlotsGrid}>
                  {timeSlots.map(slot => (
                    <button
                      key={slot.id}
                      type="button"
                      className={`${styles.timeSlot} ${formData.timeSlots.includes(slot.value) ? styles.selected : ''}`}
                      onClick={() => {
                        setFormData(prev => {
                          const newTimeSlots = prev.timeSlots.includes(slot.value)
                            ? prev.timeSlots.filter(ts => ts !== slot.value)
                            : prev.timeSlots.length < 2
                              ? [...prev.timeSlots, slot.value]
                              : prev.timeSlots;
                          return { ...prev, timeSlots: newTimeSlots };
                        });
                      }}
                      disabled={!formData.timeSlots.includes(slot.value) && formData.timeSlots.length >= 2}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}
              
              {success ? (
                <div className={styles.successMessage}>
                  Votre réservation a été soumise avec succès! Votre demande sera traitée et nous vous répondrons très prochainement.
                </div>
              ) : (
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={submitting || loading}
                >
                  {submitting ? 'Envoi en cours...' : 'Reserver'}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Reservation;
