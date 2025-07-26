'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import DashboardLayout from '../../../../components/DashboardLayout';
import styles from '../../new/project-form.module.css';

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    dueDate: '',
    supplies: [],
    progress: 0,
    status: 'planning',
    isImportant: false,
    tasks: []
  });
  const [currentSupply, setCurrentSupply] = useState('');
  const [currentTask, setCurrentTask] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        const project = data.project;
        setFormData({
          name: project.name || '',
          description: project.description || '',
          startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
          dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '',
          supplies: project.supplies || [],
          progress: project.progress || 0,
          status: project.status || 'planning',
          isImportant: project.isImportant || false,
          tasks: project.tasks || []
        });
      } else {
        setErrors({ fetch: data.message || 'Failed to load project' });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setErrors({ fetch: 'An error occurred while loading the project' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addSupply = () => {
    if (currentSupply.trim() && !formData.supplies.includes(currentSupply.trim())) {
      setFormData(prev => ({
        ...prev,
        supplies: [...prev.supplies, currentSupply.trim()]
      }));
      setCurrentSupply('');
    }
  };

  const removeSupply = (supply) => {
    setFormData(prev => ({
      ...prev,
      supplies: prev.supplies.filter(s => s !== supply)
    }));
  };

  const addTask = () => {
    if (currentTask.trim()) {
      setFormData(prev => ({
        ...prev,
        tasks: [...prev.tasks, { title: currentTask.trim(), completed: false }]
      }));
      setCurrentTask('');
    }
  };

  const removeTask = (index) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const toggleTaskCompleted = (index) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === index ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (formData.dueDate && formData.dueDate < formData.startDate) {
      newErrors.dueDate = 'Due date cannot be before start date';
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard/projects');
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Failed to update project' });
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    }

    setIsLoading(false);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className={styles.container}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading project...
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (errors.fetch) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className={styles.container}>
            <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626' }}>
              {errors.fetch}
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Edit Project</h1>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Basic Information</h2>
              
              <div className={styles.fieldGroup}>
                <label htmlFor="name" className={styles.label}>
                  Project Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="Enter project name"
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="description" className={styles.label}>Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Describe your project..."
                  rows={3}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="startDate" className={styles.label}>Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="dueDate" className={styles.label}>Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.dueDate ? styles.inputError : ''}`}
                  />
                  {errors.dueDate && <span className={styles.error}>{errors.dueDate}</span>}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Project Details</h2>
              
              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="status" className={styles.label}>Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="planning">Planning</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="progress" className={styles.label}>
                    Progress ({formData.progress}%)
                  </label>
                  <input
                    type="range"
                    id="progress"
                    name="progress"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={handleChange}
                    className={styles.slider}
                  />
                  {errors.progress && <span className={styles.error}>{errors.progress}</span>}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isImportant"
                    checked={formData.isImportant}
                    onChange={handleChange}
                    className={styles.checkbox}
                  />
                  Mark as important
                </label>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Supplies</h2>
              
              <div className={styles.addItemSection}>
                <div className={styles.addItemRow}>
                  <input
                    type="text"
                    value={currentSupply}
                    onChange={(e) => setCurrentSupply(e.target.value)}
                    placeholder="Add a supply item..."
                    className={styles.input}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSupply())}
                  />
                  <button 
                    type="button" 
                    onClick={addSupply}
                    className={styles.addButton}
                    disabled={!currentSupply.trim()}
                  >
                    Add
                  </button>
                </div>
                
                {formData.supplies.length > 0 && (
                  <div className={styles.itemsList}>
                    {formData.supplies.map((supply, index) => (
                      <div key={index} className={styles.item}>
                        <span className={styles.itemText}>{supply}</span>
                        <button 
                          type="button"
                          onClick={() => removeSupply(supply)}
                          className={styles.removeButton}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Tasks</h2>
              
              <div className={styles.addItemSection}>
                <div className={styles.addItemRow}>
                  <input
                    type="text"
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    placeholder="Add a task..."
                    className={styles.input}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTask())}
                  />
                  <button 
                    type="button" 
                    onClick={addTask}
                    className={styles.addButton}
                    disabled={!currentTask.trim()}
                  >
                    Add
                  </button>
                </div>
                
                {formData.tasks.length > 0 && (
                  <div className={styles.itemsList}>
                    {formData.tasks.map((task, index) => (
                      <div key={index} className={styles.item}>
                        <label className={styles.checkboxLabel} style={{ flex: 1, justifyContent: 'flex-start' }}>
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompleted(index)}
                            className={styles.checkbox}
                          />
                          <span className={`${styles.itemText} ${task.completed ? styles.completedTask : ''}`}>
                            {task.title}
                          </span>
                        </label>
                        <button 
                          type="button"
                          onClick={() => removeTask(index)}
                          className={styles.removeButton}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {errors.submit && (
              <div className={styles.submitError}>{errors.submit}</div>
            )}

            <div className={styles.actions}>
              <button 
                type="button"
                onClick={() => router.back()}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className={styles.submitButton}
              >
                {isLoading ? 'Updating...' : 'Update Project'}
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
