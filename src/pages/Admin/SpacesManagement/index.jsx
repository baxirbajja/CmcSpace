import { useState, useEffect } from 'react';
import axios from '../../../utils/axiosConfig';
import AdminLayout from '../../../components/AdminLayout';
import SpaceForm from '../../../components/SpaceForm';
import styles from './SpacesManagement.module.css';

const SpacesManagement = ({ onLogout }) => {
  const [spaces, setSpaces] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les espaces depuis l'API
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/spaces');
        setSpaces(response.data.data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des espaces. Veuillez réessayer.');
        console.error('Erreur de chargement des espaces:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      await axios.put(`/api/spaces/${id}`, { status: newStatus });
      setSpaces(spaces.map(space => 
        space._id === id ? { ...space, status: newStatus } : space
      ));
    } catch (err) {
      setError('Erreur lors de la modification du statut. Veuillez réessayer.');
      console.error('Erreur de modification du statut:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpace = async (spaceData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/spaces', spaceData);
      setSpaces([...spaces, response.data.data]);
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'espace. Veuillez réessayer.');
      console.error('Erreur d\'ajout d\'espace:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSpace = async (spaceData) => {
    try {
      setLoading(true);
      await axios.put(`/api/spaces/${spaceData._id}`, spaceData);
      setSpaces(spaces.map(space => 
        space._id === spaceData._id ? { ...spaceData } : space
      ));
      setError(null);
    } catch (err) {
      setError('Erreur lors de la modification de l\'espace. Veuillez réessayer.');
      console.error('Erreur de modification d\'espace:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSpace = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet espace ?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/spaces/${id}`);
        setSpaces(spaces.filter(space => space._id !== id));
        setError(null);
      } catch (err) {
        setError('Erreur lors de la suppression de l\'espace. Veuillez réessayer.');
        console.error('Erreur de suppression d\'espace:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const openAddForm = () => {
    setSelectedSpace(null);
    setIsFormOpen(true);
  };

  const openEditForm = (space) => {
    setSelectedSpace(space);
    setIsFormOpen(true);
  };

  return (
    <AdminLayout onLogout={onLogout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.addButton} onClick={openAddForm}>
            <i className="fas fa-plus"></i>
            Ajouter un Espace
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        
        {loading ? (
          <div className={styles.loading}>Chargement des espaces...</div>
        ) : spaces.length === 0 ? (
          <div className={styles.noSpaces}>Aucun espace disponible. Ajoutez-en un !</div>
        ) : (
          <div className={styles.spacesGrid}>
            {spaces.map(space => (
              <div key={space._id} className={styles.spaceCard}>
                <div className={styles.imageContainer}>
                  <img src={space.image} alt={space.title} />
                  <span className={`${styles.status} ${styles[space.status]}`}>
                    {space.status === 'active' ? 'Actif' : 'En maintenance'}
                  </span>
                </div>
                <div className={styles.content}>
                  <h2>{space.title}</h2>
                  <p className={styles.description}>{space.description}</p>
                  <div className={styles.details}>
                    <span>
                      <i className="fas fa-users"></i>
                      Capacité: {space.capacity}
                    </span>
                  </div>
                  <div className={styles.actions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => openEditForm(space)}
                    >
                      <i className="fas fa-edit"></i>
                      Modifier
                    </button>
                    <button 
                      className={styles.statusButton}
                      onClick={() => handleStatusChange(space._id, 
                        space.status === 'active' ? 'maintenance' : 'active'
                      )}
                    >
                      <i className={`fas fa-${space.status === 'active' ? 'tools' : 'check'}`}></i>
                      {space.status === 'active' ? 'Maintenance' : 'Activer'}
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteSpace(space._id)}
                    >
                      <i className="fas fa-trash"></i>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <SpaceForm
          space={selectedSpace}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={selectedSpace ? handleEditSpace : handleAddSpace}
        />
      </div>
    </AdminLayout>
  );
};

export default SpacesManagement;
