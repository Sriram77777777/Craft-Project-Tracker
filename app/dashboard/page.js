'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/DashboardLayout';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalProjects: 0,
    ongoingProjects: 0,
    completedProjects: 0,
    totalSupplies: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, suppliesRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/supplies')
      ]);

      const projectsData = await projectsRes.json();
      const suppliesData = await suppliesRes.json();

      if (projectsRes.ok && projectsData.projects) {
        const projects = projectsData.projects;
        setStats({
          totalProjects: projects.length,
          ongoingProjects: projects.filter(p => p.status === 'ongoing').length,
          completedProjects: projects.filter(p => p.status === 'completed').length,
          totalSupplies: suppliesRes.ok ? suppliesData.supplies?.length || 0 : 0
        });
        setRecentProjects(projects.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className={styles.loading}>Loading dashboard...</div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className={styles.dashboard}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeTitle}>
              Welcome back, {session?.user?.name}!
            </h1>
            <p className={styles.welcomeSubtitle}>
              Here's what's happening with your craft projects
            </p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📋</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{stats.totalProjects}</h3>
                <p className={styles.statLabel}>Total Projects</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🚀</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{stats.ongoingProjects}</h3>
                <p className={styles.statLabel}>Ongoing</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{stats.completedProjects}</h3>
                <p className={styles.statLabel}>Completed</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🧵</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{stats.totalSupplies}</h3>
                <p className={styles.statLabel}>Supplies</p>
              </div>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionGrid}>
              <Link href="/dashboard/projects/new" className={styles.actionCard}>
                <div className={styles.actionIcon}>➕</div>
                <h3 className={styles.actionTitle}>New Project</h3>
                <p className={styles.actionDescription}>Start tracking a new craft project</p>
              </Link>

              <Link href="/dashboard/supplies" className={styles.actionCard}>
                <div className={styles.actionIcon}>📦</div>
                <h3 className={styles.actionTitle}>Manage Supplies</h3>
                <p className={styles.actionDescription}>Add or update your supply inventory</p>
              </Link>

              <Link href="/dashboard/projects" className={styles.actionCard}>
                <div className={styles.actionIcon}>👀</div>
                <h3 className={styles.actionTitle}>View All Projects</h3>
                <p className={styles.actionDescription}>Browse and manage your projects</p>
              </Link>
            </div>
          </div>

          <div className={styles.recentProjects}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Projects</h2>
              <Link href="/dashboard/projects" className={styles.viewAllLink}>
                View All
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🎨</div>
                <h3 className={styles.emptyTitle}>No projects yet</h3>
                <p className={styles.emptyDescription}>
                  Create your first craft project to get started!
                </p>
                <Link href="/dashboard/projects/new" className={styles.createButton}>
                  Create Project
                </Link>
              </div>
            ) : (
              <div className={styles.projectsList}>
                {recentProjects.map((project) => (
                  <div key={project._id} className={styles.projectCard}>
                    <div className={styles.projectHeader}>
                      <h3 className={styles.projectName}>{project.name}</h3>
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
                    <div className={styles.projectProgress}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className={styles.progressText}>{project.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
