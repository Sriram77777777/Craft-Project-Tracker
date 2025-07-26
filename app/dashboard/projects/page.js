'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardLayout from '../../components/DashboardLayout';
import styles from './projects.module.css';

export default function Projects() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    important: false,
    search: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (session) {
      fetchProjects();
    }
  }, [session, filters]);

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.important) params.append('important', 'true');
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/projects?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProjects(projects.filter(p => p._id !== projectId));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: '#6b7280',
      ongoing: '#2563eb',
      completed: '#059669',
      paused: '#d97706'
    };
    return colors[status] || colors.planning;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className={styles.loading}>Loading projects...</div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Projects</h1>
            <Link href="/dashboard/projects/new" className={styles.addButton}>
              + New Project
            </Link>
          </div>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Status:</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className={styles.filterSelect}
              >
                <option value="all">All Projects</option>
                <option value="planning">Planning</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.important}
                  onChange={(e) => setFilters({ ...filters, important: e.target.checked })}
                  className={styles.checkbox}
                />
                Important only
              </label>
            </div>

            <div className={styles.filterGroup}>
              <input
                type="text"
                placeholder="Search projects..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className={styles.searchInput}
              />
            </div>
          </div>

          {projects.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎨</div>
              <h3 className={styles.emptyTitle}>No projects found</h3>
              <p className={styles.emptyDescription}>
                {filters.status !== 'all' || filters.important || filters.search
                  ? 'Try adjusting your filters or create a new project.'
                  : 'Create your first craft project to get started!'}
              </p>
              <Link href="/dashboard/projects/new" className={styles.createButton}>
                Create Project
              </Link>
            </div>
          ) : (
            <div className={styles.projectsGrid}>
              {projects.map((project) => (
                <div key={project._id} className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <div className={styles.projectTitleSection}>
                      <h3 className={styles.projectName}>{project.name}</h3>
                      {project.isImportant && (
                        <span className={styles.importantBadge}>⭐ Important</span>
                      )}
                    </div>
                    <span 
                      className={styles.projectStatus}
                      style={{ color: getStatusColor(project.status) }}
                    >
                      {project.status}
                    </span>
                  </div>

                  {project.description && (
                    <p className={styles.projectDescription}>{project.description}</p>
                  )}

                  <div className={styles.projectMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Started:</span>
                      <span className={styles.metaValue}>{formatDate(project.startDate)}</span>
                    </div>
                    {project.dueDate && (
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Due:</span>
                        <span className={styles.metaValue}>{formatDate(project.dueDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.projectProgress}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className={styles.progressText}>{project.progress}%</span>
                  </div>

                  {project.supplies && project.supplies.length > 0 && (
                    <div className={styles.suppliesSection}>
                      <span className={styles.suppliesLabel}>Supplies:</span>
                      <div className={styles.suppliesList}>
                        {project.supplies.slice(0, 3).map((supply, index) => (
                          <span key={index} className={styles.supplyTag}>{supply}</span>
                        ))}
                        {project.supplies.length > 3 && (
                          <span className={styles.moreSupplies}>+{project.supplies.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={styles.projectActions}>
                    <Link 
                      href={`/dashboard/projects/${project._id}/edit`}
                      className={styles.editButton}
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => setDeleteConfirm(project._id)}
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
                <h3 className={styles.modalTitle}>Delete Project</h3>
                <p className={styles.modalText}>
                  Are you sure you want to delete this project? This action cannot be undone.
                </p>
                <div className={styles.modalActions}>
                  <button 
                    onClick={() => setDeleteConfirm(null)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(deleteConfirm)}
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
