import { useState, useEffect } from 'react';
import axios from '../../../utils/axiosConfig';
import AdminLayout from '../../../components/AdminLayout';
import styles from './ReportsManagement.module.css';

const ReportsManagement = ({ onLogout }) => {
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [detailedReservations, setDetailedReservations] = useState([]);
  const [spaceStats, setSpaceStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    status: ''
  });

  // Charger les statistiques mensuelles
  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/reports/monthly?year=${year}`);
        setMonthlyStats(response.data.data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques mensuelles. Veuillez réessayer.');
        console.error('Erreur de chargement des statistiques:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyStats();
  }, [year]);

  // Charger les statistiques par espace
  useEffect(() => {
    const fetchSpaceStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/reports/spaces');
        setSpaceStats(response.data.data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques par espace. Veuillez réessayer.');
        console.error('Erreur de chargement des statistiques par espace:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceStats();
  }, []);

  // Charger les réservations détaillées
  useEffect(() => {
    const fetchDetailedReservations = async () => {
      try {
        setLoading(true);
        let url = '/api/reports/detailed';
        const params = new URLSearchParams();
        
        if (dateFilter.startDate) params.append('startDate', dateFilter.startDate);
        if (dateFilter.endDate) params.append('endDate', dateFilter.endDate);
        if (dateFilter.status) params.append('status', dateFilter.status);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await axios.get(url);
        setDetailedReservations(response.data.data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des réservations détaillées. Veuillez réessayer.');
        console.error('Erreur de chargement des réservations détaillées:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedReservations();
  }, [dateFilter]);

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Le useEffect se déclenchera automatiquement grâce à la dépendance [dateFilter]
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
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

  // Calculer le total des réservations pour l'année
  const totalReservations = monthlyStats.reduce((sum, month) => sum + month.count, 0);
  const totalApproved = monthlyStats.reduce((sum, month) => sum + month.approved, 0);
  const totalPending = monthlyStats.reduce((sum, month) => sum + month.pending, 0);
  const totalDeclined = monthlyStats.reduce((sum, month) => sum + month.declined, 0);

  return (
    <AdminLayout onLogout={onLogout}>
      <div className={styles.container}>
        <div className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-chart-bar"></i> Statistiques des Réservations
          </h2>
          
          <div className={styles.yearSelector}>
            <label htmlFor="yearSelect">Année: </label>
            <select 
              id="yearSelect" 
              value={year} 
              onChange={handleYearChange}
              className={styles.select}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className={styles.summaryInfo}>
                <h3>{totalReservations}</h3>
                <p>Réservations Totales</p>
              </div>
            </div>
            
            <div className={`${styles.summaryCard} ${styles.approvedCard}`}>
              <div className={styles.summaryIcon}>
                <i className="fas fa-check-circle"></i>
              </div>
              <div className={styles.summaryInfo}>
                <h3>{totalApproved}</h3>
                <p>Approuvées</p>
              </div>
            </div>
            
            <div className={`${styles.summaryCard} ${styles.pendingCard}`}>
              <div className={styles.summaryIcon}>
                <i className="fas fa-clock"></i>
              </div>
              <div className={styles.summaryInfo}>
                <h3>{totalPending}</h3>
                <p>En Attente</p>
              </div>
            </div>
            
            <div className={`${styles.summaryCard} ${styles.declinedCard}`}>
              <div className={styles.summaryIcon}>
                <i className="fas fa-times-circle"></i>
              </div>
              <div className={styles.summaryInfo}>
                <h3>{totalDeclined}</h3>
                <p>Refusées</p>
              </div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Réservations Mensuelles {year}</h3>
            <div className={styles.barChart}>
              {monthlyStats.map(month => (
                <div key={month.month} className={styles.barGroup}>
                  <div 
                    className={styles.bar} 
                    style={{ height: `${month.count ? (month.count / Math.max(...monthlyStats.map(m => m.count)) * 100) : 0}%` }}
                  >
                    <span className={styles.barValue}>{month.count}</span>
                  </div>
                  <div className={styles.barLabel}>{month.monthName.substring(0, 3)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.spaceStatsContainer}>
            <h3 className={styles.chartTitle}>Utilisation des Espaces</h3>
            <div className={styles.spaceStatsList}>
              {spaceStats.map(space => (
                <div key={space._id} className={styles.spaceStatItem}>
                  <div className={styles.spaceStatHeader}>
                    <h4>{space.spaceName}</h4>
                    <span className={styles.spaceStatTotal}>{space.totalReservations} réservations</span>
                  </div>
                  <div className={styles.spaceStatBar}>
                    <div 
                      className={styles.spaceStatApproved} 
                      style={{ width: `${(space.approved / space.totalReservations) * 100}%` }}
                      title={`${space.approved} approuvées`}
                    ></div>
                    <div 
                      className={styles.spaceStatPending} 
                      style={{ width: `${(space.pending / space.totalReservations) * 100}%` }}
                      title={`${space.pending} en attente`}
                    ></div>
                    <div 
                      className={styles.spaceStatDeclined} 
                      style={{ width: `${(space.declined / space.totalReservations) * 100}%` }}
                      title={`${space.declined} refusées`}
                    ></div>
                  </div>
                  <div className={styles.spaceStatLegend}>
                    <span><span className={styles.legendApproved}></span> {space.approved} approuvées</span>
                    <span><span className={styles.legendPending}></span> {space.pending} en attente</span>
                    <span><span className={styles.legendDeclined}></span> {space.declined} refusées</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.detailedSection}>
          <h2 className={styles.sectionTitle}>
            <i className="fas fa-list"></i> Liste Détaillée des Réservations
          </h2>
          
          <form className={styles.filterForm} onSubmit={handleFilterSubmit}>
            <div className={styles.filterGroup}>
              <label htmlFor="startDate">Date de début:</label>
              <input 
                type="date" 
                id="startDate" 
                name="startDate" 
                value={dateFilter.startDate} 
                onChange={handleFilterChange}
                className={styles.dateInput}
              />
            </div>
            
            <div className={styles.filterGroup}>
              <label htmlFor="endDate">Date de fin:</label>
              <input 
                type="date" 
                id="endDate" 
                name="endDate" 
                value={dateFilter.endDate} 
                onChange={handleFilterChange}
                className={styles.dateInput}
              />
            </div>
            
            <div className={styles.filterGroup}>
              <label htmlFor="status">Statut:</label>
              <select 
                id="status" 
                name="status" 
                value={dateFilter.status} 
                onChange={handleFilterChange}
                className={styles.select}
              >
                <option value="">Tous</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvée</option>
                <option value="declined">Refusée</option>
              </select>
            </div>
            
            <button type="submit" className={styles.filterButton}>
              <i className="fas fa-filter"></i> Filtrer
            </button>
          </form>

          {loading ? (
            <div className={styles.loading}>Chargement des données...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : detailedReservations.length === 0 ? (
            <div className={styles.noData}>Aucune réservation trouvée pour les critères sélectionnés.</div>
          ) : (
            <div className={styles.detailedList}>
              {detailedReservations.map(group => (
                <div key={group.date} className={styles.dateGroup}>
                  <div className={styles.dateTitle}>
                    <i className="fas fa-calendar-day"></i>
                    {formatDate(group.date)}
                    <span className={styles.reservationCount}>
                      {group.count} réservation{group.count > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className={styles.reservationsGrid}>
                    {group.reservations.map(reservation => (
                      <div key={reservation._id} className={styles.reservationCard}>
                        <div className={styles.reservationHeader}>
                          <h3 className={styles.reservationTitle}>{reservation.event}</h3>
                          <span className={`${styles.reservationStatus} ${getStatusColor(reservation.reservationStatus)}`}>
                            {getStatusText(reservation.reservationStatus)}
                          </span>
                        </div>
                        
                        <div className={styles.reservationDetails}>
                          <div className={styles.reservationDetail}>
                            <i className="fas fa-user"></i>
                            <span>{reservation.name}</span>
                          </div>
                          
                          <div className={styles.reservationDetail}>
                            <i className="fas fa-envelope"></i>
                            <span>{reservation.email}</span>
                          </div>
                          
                          <div className={styles.reservationDetail}>
                            <i className="fas fa-phone"></i>
                            <span>{reservation.phone}</span>
                          </div>
                          
                          <div className={styles.reservationDetail}>
                            <i className="fas fa-user-tag"></i>
                            <span>{reservation.status}</span>
                          </div>
                          
                          <div className={styles.reservationDetail}>
                            <i className="fas fa-building"></i>
                            <span>{reservation.space?.title || 'Espace non spécifié'}</span>
                          </div>
                          
                          <div className={styles.reservationDetail}>
                            <i className="fas fa-clock"></i>
                            <span>{reservation.timeSlot}</span>
                          </div>
                        </div>
                        
                        <div className={styles.reservationDescription}>
                          <h4>Description:</h4>
                          <p>{reservation.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsManagement;