import { useState, useEffect } from "react";
import axios from '../../../utils/axiosConfig';
import AdminLayout from "../../../components/AdminLayout";
import styles from "./ReservationsManagement.module.css";

const ReservationsManagement = ({ onLogout }) => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Charger les réservations depuis l'API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/reservations');
        setReservations(response.data.data);
        setFilteredReservations(response.data.data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des réservations. Veuillez réessayer.');
        console.error('Erreur de chargement des réservations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);
  
  // Filtrer les réservations en fonction du statut sélectionné
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredReservations(reservations);
    } else {
      const filtered = reservations.filter(reservation => 
        reservation.reservationStatus === activeFilter
      );
      setFilteredReservations(filtered);
    }
  }, [activeFilter, reservations]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      await axios.put(`/api/reservations/${id}/status`, { status: newStatus });
      const updatedReservations = reservations.map(reservation => 
        reservation._id === id ? { ...reservation, reservationStatus: newStatus } : reservation
      );
      setReservations(updatedReservations);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la modification du statut. Veuillez réessayer.');
      console.error('Erreur de modification du statut:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleDeleteReservation = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/reservations/${id}`);
        setReservations(reservations.filter(reservation => reservation._id !== id));
        setError(null);
      } catch (err) {
        setError('Erreur lors de la suppression de la réservation. Veuillez réessayer.');
        console.error('Erreur de suppression de réservation:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return styles.approved;
      case "declined":
        return styles.declined;
      default:
        return styles.pending;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Approuvée";
      case "declined":
        return "Refusée";
      default:
        return "En attente";
    }
  };

  // Group reservations by date
  const groupedReservations = filteredReservations.reduce((groups, reservation) => {
    // Format date to YYYY-MM-DD for grouping
    const date = reservation.date ? new Date(reservation.date).toISOString().split('T')[0] : 'Non défini';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(reservation);
    return groups;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedReservations).sort();

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  return (
    <AdminLayout onLogout={onLogout}>
      <div className={styles.container}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <div className={styles.filters}>
          <div className={styles.searchBar}>
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Rechercher une réservation..." />
          </div>
          <div className={styles.statusFilters}>
            <button 
              className={`${styles.filterBtn} ${activeFilter === 'all' ? styles.active : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              Toutes
            </button>
            <button 
              className={`${styles.filterBtn} ${activeFilter === 'pending' ? styles.active : ''}`}
              onClick={() => handleFilterChange('pending')}
            >
              En attente
            </button>
            <button 
              className={`${styles.filterBtn} ${activeFilter === 'approved' ? styles.active : ''}`}
              onClick={() => handleFilterChange('approved')}
            >
              Approuvées
            </button>
            <button 
              className={`${styles.filterBtn} ${activeFilter === 'declined' ? styles.active : ''}`}
              onClick={() => handleFilterChange('declined')}
            >
              Refusées
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className={styles.loading}>Chargement des réservations...</div>
        ) : filteredReservations.length === 0 ? (
          <div className={styles.noReservations}>Aucune réservation disponible.</div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className={styles.dateGroup}>
              <h2 className={styles.dateTitle}>
                <i className="fas fa-calendar-day"></i>
                {formatDate(date)}
                <span className={styles.reservationCount}>
                  {groupedReservations[date].length} réservation(s)
                </span>
              </h2>

              <div className={styles.reservationsGrid}>
                {groupedReservations[date].map((reservation) => (
                <div key={reservation._id} className={styles.reservationCard}>
                  <div className={styles.cardHeader}>
                    <h3>{reservation.event}</h3>
                    <span
                      className={`${styles.status} ${getStatusColor(
                        reservation.reservationStatus
                      )}`}
                    >
                      {getStatusText(reservation.reservationStatus)}
                    </span>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.info}>
                      <span>
                        <i className="fas fa-user"></i>
                        <label>Nom:</label> {reservation.name}
                      </span>
                      <span>
                        <i className="fas fa-envelope"></i>
                        <label>Email:</label> {reservation.email}
                      </span>
                      <span>
                        <i className="fas fa-envelope"></i>
                        <label>Telephone:</label> {reservation.phone}
                      </span>
                      <span>
                        <i className="fas fa-building"></i>
                        <label>Espace:</label> {reservation.space?.title || 'Espace non défini'}
                      </span>
                      <span>
                        <i className="fas fa-clock"></i>
                        <label>Créneaux horaires:</label> {reservation.timeSlots ? reservation.timeSlots.join(', ') : 'Non défini'}
                      </span>
                      <span className={styles.description}>
                        <i className="fas fa-info-circle"></i>
                        <label>Description:</label> {reservation.description || 'Aucune description fournie'}
                      </span>
                    </div>
                    <div className={styles.actions}>
                      {reservation.reservationStatus === "pending" && (
                        <>
                          <button
                            className={styles.approveBtn}
                            onClick={() =>
                              handleStatusChange(reservation._id, "approved")
                            }
                          >
                            <i className="fas fa-check"></i>
                            Approuver
                          </button>
                          <button
                            className={styles.declineBtn}
                            onClick={() =>
                              handleStatusChange(reservation._id, "declined")
                            }
                          >
                            <i className="fas fa-times"></i>
                            Refuser
                          </button>
                        </>
                      )}
                      {reservation.reservationStatus !== "pending" && (
                        <button
                          className={styles.resetBtn}
                          onClick={() =>
                            handleStatusChange(reservation._id, "pending")
                          }
                        >
                          <i className="fas fa-undo"></i>
                          Réinitialiser
                        </button>
                      )}
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteReservation(reservation._id)}
                      >
                        <i className="fas fa-trash"></i>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default ReservationsManagement;
