import React, { useState, useEffect, useRef } from 'react';
import axios from '../../../utils/axiosConfig';
import styles from './HistoryManagement.module.css';
import { useReactToPrint } from 'react-to-print';
import AdminLayout from '../../../components/AdminLayout';
import jsPDF from 'jspdf';

const HistoryManagement = ({ onLogout }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [reservations, setReservations] = useState([]);
  const tableRef = useRef(null);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' }
  ];

  const handleExportPDF = () => {
    if (reservations.length === 0) {
      alert("Il n'y a rien à exporter. Veuillez d'abord afficher l'historique.");
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    doc.setProperties({
      title: 'Historique des Réservations',
      subject: 'Rapport de réservations',
      keywords: 'réservations, historique',
      creator: 'CMC System'
    });
    
    // Titre du document
    doc.setFontSize(16);
    doc.text('Historique des Réservations', pageWidth / 2, 20, { align: 'center' });
    
    // Sous-titre avec la période
    doc.setFontSize(12);
    doc.text(`${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`, pageWidth / 2, 30, { align: 'center' });
    
    // En-têtes du tableau
    const headers = ['Espace', 'Événement', 'Nom', 'Email', 'Date', 'Heure', 'Statut'];
    let yPos = 40;
    const rowHeight = 10;
    const colWidth = (pageWidth - 10) / headers.length;
    
    // Style pour les en-têtes
    doc.setFillColor(240, 240, 240);
    doc.rect(10, yPos, pageWidth - 20, rowHeight, 'F');
    doc.setFont('helvetica', 'bold');
    headers.forEach((header, i) => {
      doc.text(header, 10 + (colWidth * i), yPos + 7);
    });
    
    // Contenu du tableau
    doc.setFont('helvetica', 'normal');
    yPos += rowHeight;
    
    reservations.forEach((reservation) => {
      // Vérifier si on a besoin d'une nouvelle page
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
      
      const row = [
        reservation.space.title,
        reservation.event,
        reservation.name,
        reservation.email,
        new Date(reservation.date).toLocaleDateString('fr-FR'),
        reservation.timeSlots ? reservation.timeSlots.join(', ') : 'Non défini',
        getStatusText(reservation.reservationStatus)
      ];
      
      // Ajouter les données du tableau
      row.forEach((text, i) => {
        doc.setFontSize(10);
        doc.text(String(text).slice(0, 20), 10 + (colWidth * i), yPos + 7);
      });
      
      yPos += rowHeight;
    });
    
    // Sauvegarder le PDF
    doc.save(`Historique_Reservations_${selectedYear}_${months.find(m => m.value === selectedMonth)?.label}.pdf`);
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    onBeforeGetContent: () => {
      if (!tableRef.current || reservations.length === 0) {
        alert("Il n'y a rien à imprimer. Veuillez d'abord afficher l'historique.");
        return Promise.resolve(false);
      }
      return Promise.resolve();
    },
    documentTitle: `Historique_Reservations_${selectedYear}_${months.find(m => m.value === selectedMonth)?.label || selectedMonth}`,
    onAfterPrint: () => console.log('Impression terminée'),
    removeAfterPrint: false
  });

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approuvée';
      case 'declined':
        return 'Refusée';
      default:
        return 'En attente';
    };
  };


  const fetchReservations = async () => {
    try {
      const response = await axios.get(`/api/reservations/history/${selectedYear}/${selectedMonth}`);
      setReservations(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
    }
  };

  const handleShowHistory = () => {
    fetchReservations();
  };

  // Charger les réservations au chargement initial du composant
  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <AdminLayout onLogout={onLogout}>
      <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Historique des Réservations</h1>
          <div className={styles.actionButtons}>
            <button onClick={handlePrint} className={styles.printButton}>
              <i className="fas fa-print"></i> Imprimer
            </button>
            <button onClick={handleExportPDF} className={styles.exportButton}>
              <i className="fas fa-file-pdf"></i> Exporter PDF
            </button>
          </div>
        </div>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="year">Année</label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="month">Mois</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
          <button className={styles.showButton} onClick={handleShowHistory}>
            Afficher
          </button>
        </div>
      </div>

      <div className={styles.tableContainer} ref={tableRef}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Espace</th>
                <th>Événement</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{ reservation.space.title}</td>
                  <td>{reservation.event}</td>
                  <td>{reservation.name}</td>
                  <td>{reservation.email}</td>
                  <td>{new Date(reservation.date).toLocaleDateString('fr-FR')}</td>
                  <td>{reservation.timeSlots ? reservation.timeSlots.join(', ') : 'Non défini'}</td>
                  <td>{getStatusText(reservation.reservationStatus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HistoryManagement;