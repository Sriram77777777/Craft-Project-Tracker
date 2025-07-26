'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardLayout from '../../components/DashboardLayout';
import styles from './supplies.module.css';

export default function Supplies() {
  const { data: session } = useSession();
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSupply, setEditingSupply] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    search: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    quantity: 1,
    unit: 'pieces',
    color: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'yarn', label: 'Yarn' },
    { value: 'fabric', label: 'Fabric' },
    { value: 'thread', label: 'Thread' },
    { value: 'needles', label: 'Needles' },
    { value: 'tools', label: 'Tools' },
    { value: 'patterns', label: 'Patterns' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (session) {
      fetchSupplies();
    }
  }, [session, filters]);

  const fetchSupplies = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/supplies?${params}`);
      const data = await response.json();

      if (response.ok) {
        setSupplies(data.supplies);
      }
    } catch (error) {
      console.error('Error fetching supplies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Supply name is required';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'other',
      quantity: 1,
      unit: 'pieces',
      color: '',
      notes: ''
    });
    setErrors({});
    setEditingSupply(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const url = editingSupply ? `/api/supplies/${editingSupply._id}` : '/api/supplies';
      const method = editingSupply ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSupplies();
        resetForm();
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Failed to save supply' });
      }
    } catch (error) {
      console.error('Error saving supply:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    }

    setIsSubmitting(false);
  };

  const handleEdit = (supply) => {
    setFormData({
      name: supply.name,
      category: supply.category,
      quantity: supply.quantity,
      unit: supply.unit,
      color: supply.color || '',
      notes: supply.notes || ''
    });
    setEditingSupply(supply);
    setShowAddForm(true);
  };

  const handleDelete = async (supplyId) => {
    try {
      const response = await fetch(`/api/supplies/${supplyId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSupplies(supplies.filter(s => s._id !== supplyId));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting supply:', error);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      yarn: '🧶',
      fabric: '🧵',
      thread: '🪡',
      needles: '📍',
      tools: '🔧',
      patterns: '📋',
      other: '📦'
    };
    return icons[category] || icons.other;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className={styles.loading}>Loading supplies...</div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Supplies Inventory</h1>
            <button 
              onClick={() => setShowAddForm(true)}
              className={styles.addButton}
            >
              + Add Supply
            </button>
          </div>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Category:</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className={styles.filterSelect}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <input
                type="text"
                placeholder="Search supplies..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className={styles.searchInput}
              />
            </div>
          </div>

          {showAddForm && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h2 className={styles.modalTitle}>
                    {editingSupply ? 'Edit Supply' : 'Add New Supply'}
                  </h2>
                  <button 
                    onClick={resetForm}
                    className={styles.modalClose}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>
                        Supply Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                        placeholder="Enter supply name"
                      />
                      {errors.name && <span className={styles.error}>{errors.name}</span>}
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        className={styles.select}
                      >
                        {categories.slice(1).map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleFormChange}
                        className={`${styles.input} ${errors.quantity ? styles.inputError : ''}`}
                        min="0"
                        step="0.1"
                      />
                      {errors.quantity && <span className={styles.error}>{errors.quantity}</span>}
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Unit</label>
                      <input
                        type="text"
                        name="unit"
                        value={formData.unit}
                        onChange={handleFormChange}
                        className={styles.input}
                        placeholder="e.g., yards, meters, skeins"
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Color</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleFormChange}
                      className={styles.input}
                      placeholder="e.g., red, navy blue, #FF5733"
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleFormChange}
                      className={styles.textarea}
                      placeholder="Additional notes about this supply..."
                      rows={3}
                    />
                  </div>

                  {errors.submit && (
                    <div className={styles.submitError}>{errors.submit}</div>
                  )}

                  <div className={styles.formActions}>
                    <button 
                      type="button"
                      onClick={resetForm}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={styles.submitButton}
                    >
                      {isSubmitting 
                        ? (editingSupply ? 'Updating...' : 'Adding...')
                        : (editingSupply ? 'Update Supply' : 'Add Supply')
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {supplies.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <h3 className={styles.emptyTitle}>No supplies found</h3>
              <p className={styles.emptyDescription}>
                {filters.category !== 'all' || filters.search
                  ? 'Try adjusting your filters or add a new supply.'
                  : 'Start building your supply inventory!'}
              </p>
              <button 
                onClick={() => setShowAddForm(true)}
                className={styles.createButton}
              >
                Add First Supply
              </button>
            </div>
          ) : (
            <div className={styles.suppliesGrid}>
              {supplies.map((supply) => (
                <div key={supply._id} className={styles.supplyCard}>
                  <div className={styles.supplyHeader}>
                    <div className={styles.supplyTitleSection}>
                      <span className={styles.categoryIcon}>
                        {getCategoryIcon(supply.category)}
                      </span>
                      <h3 className={styles.supplyName}>{supply.name}</h3>
                    </div>
                    <span className={styles.supplyCategory}>
                      {categories.find(c => c.value === supply.category)?.label || supply.category}
                    </span>
                  </div>

                  <div className={styles.supplyDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Quantity:</span>
                      <span className={styles.detailValue}>
                        {supply.quantity} {supply.unit}
                      </span>
                    </div>

                    {supply.color && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Color:</span>
                        <span className={styles.detailValue}>{supply.color}</span>
                      </div>
                    )}

                    {supply.notes && (
                      <div className={styles.notesSection}>
                        <span className={styles.detailLabel}>Notes:</span>
                        <p className={styles.notes}>{supply.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className={styles.supplyActions}>
                    <button 
                      onClick={() => handleEdit(supply)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(supply._id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {deleteConfirm && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>Delete Supply</h3>
                <p className={styles.modalText}>
                  Are you sure you want to delete this supply? This action cannot be undone.
                </p>
                <div className={styles.modalActions}>
                  <button 
                    onClick={() => setDeleteConfirm(null)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleDelete(deleteConfirm)}
                    className={styles.confirmButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
