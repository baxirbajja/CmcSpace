import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SpaceForm.module.css';

const SpaceForm = ({ space, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    capacity: '',
    image: '',
    status: 'active'
  });
  
  // État pour gérer les erreurs de validation
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (space) {
      // Assurez-vous que tous les champs nécessaires sont présents
      setFormData({
        ...space,
        // Convertir capacity en string pour l'input
        capacity: space.capacity?.toString() || ''
      });
    } else {
      // Réinitialiser le formulaire pour un nouvel espace
      setFormData({
        title: '',
        description: '',
        capacity: '',
        image: '',
        status: 'active'
      });
    }
  }, [space]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Vérifier si l'image est une chaîne base64 trop longue
      let imageToSubmit = formData.image;
      
      // Si c'est une chaîne base64 très longue, on peut la compresser ou utiliser l'image par défaut
      if (imageToSubmit && imageToSubmit.startsWith('data:image') && imageToSubmit.length > 1000000) {
        console.warn('Image trop volumineuse, utilisation de l\'image par défaut');
        imageToSubmit = '/images/espace1.png';
      }
      
      // Si c'est un nouvel espace sans image, utiliser l'image par défaut
      if (!imageToSubmit) {
        imageToSubmit = '/images/espace1.png';
      }
      
      const dataToSubmit = {
        ...formData,
        image: imageToSubmit,
        // Assurez-vous que capacity est un nombre
        capacity: Number(formData.capacity)
      };
      
      onSubmit(dataToSubmit);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      alert('Erreur lors de la soumission du formulaire. Veuillez réessayer.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop volumineuse. Veuillez choisir une image de moins de 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.onerror = () => {
        alert('Erreur lors de la lecture du fichier. Veuillez réessayer.');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.modalHeader}>
              <h2>{space ? 'Modifier l\'espace' : 'Ajouter un espace'}</h2>
              <button className={styles.closeBtn} onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Titre de l'espace</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Bibliothèque Moderne"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description détaillée de l'espace..."
                  required
                  rows={4}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="capacity">Capacité</label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Nombre de personnes"
                    required
                    min="1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="status">Statut</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="active">Actif</option>
                    <option value="maintenance">En maintenance</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Image</label>
                <div className={styles.imageUpload}>
                  {formData.image && (
                    <div className={styles.imagePreview}>
                      <img src={formData.image} alt="Preview" />
                    </div>
                  )}
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    className={styles.fileInput}
                  />
                  <label htmlFor="image" className={styles.uploadBtn}>
                    <i className="fas fa-cloud-upload-alt"></i>
                    {formData.image ? 'Changer l\'image' : 'Télécharger une image'}
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={onClose}>
                  Annuler
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {space ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SpaceForm;
