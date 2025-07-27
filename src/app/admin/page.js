'use client'

import { PermissionGuard } from '@/components/PermissionGuard'
import { PERMISSIONS } from '@/lib/permissions'
import { usePermissions } from '@/context/PermissionContext'
import Link from 'next/link'
import { Button } from '@/components/Button'
import styles from './page.module.css'

export default function AdminPage() {
  const { userRole, hasPermission } = usePermissions()

  const adminSections = [
    {
      title: '🔍 Investigation Panel',
      description: 'Review and assess reported scammer accounts',
      href: '/admin/investigation',
      permission: PERMISSIONS.VIEW_INVESTIGATION_PANEL,
      icon: '⚖️'
    },
    {
      title: '🌐 Node Tracker',
      description: 'Monitor node blocking status and network activity',
      href: '/admin/nodes',
      permission: PERMISSIONS.VIEW_NODE_TRACKER,
      icon: '🛡️'
    },
    {
      title: '👥 User Management',
      description: 'Manage user roles and permissions',
      href: '/admin/users',
      permission: PERMISSIONS.MANAGE_USERS,
      icon: '🔑'
    },
    {
      title: '⚙️ System Settings',
      description: 'Configure application settings and preferences',
      href: '/admin/settings',
      permission: PERMISSIONS.CONFIGURE_SETTINGS,
      icon: '🔧'
    },
    {
      title: '📊 Audit Logs',
      description: 'View system activity and security logs',
      href: '/admin/audit',
      permission: PERMISSIONS.VIEW_AUDIT_LOGS,
      icon: '📋'
    }
  ]

  return (
    <PermissionGuard permission={PERMISSIONS.VIEW_ADMIN_PANEL}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>🛡️ Security Administration</h1>
          <p className={styles.subtitle}>
            Manage DeSo Scam Report security operations and configuration
          </p>
          <div className={styles.roleInfo}>
            <span className={styles.roleLabel}>Current Role:</span>
            <span className={styles.role}>{userRole}</span>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🚨</div>
            <div className={styles.statValue}>24</div>
            <div className={styles.statLabel}>Active Threats</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔍</div>
            <div className={styles.statValue}>8</div>
            <div className={styles.statLabel}>Under Investigation</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🌐</div>
            <div className={styles.statValue}>12</div>
            <div className={styles.statLabel}>Active Nodes</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statValue}>156</div>
            <div className={styles.statLabel}>Community Reports</div>
          </div>
        </div>

        <div className={styles.sectionsGrid}>
          {adminSections.map((section) => (
            hasPermission(section.permission) && (
              <Link key={section.href} href={section.href} className={styles.sectionCard}>
                <div className={styles.sectionIcon}>{section.icon}</div>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
                <p className={styles.sectionDescription}>{section.description}</p>
                <div className={styles.sectionAction}>
                  <Button variant="secondary" size="small">
                    Access Panel →
                  </Button>
                </div>
              </Link>
            )
          ))}
        </div>

        <div className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            {hasPermission(PERMISSIONS.SUBMIT_REPORTS) && (
              <Link href="/reports/submit">
                <Button variant="primary">
                  🚨 Submit New Report
                </Button>
              </Link>
            )}
            {hasPermission(PERMISSIONS.UPDATE_REPORT_STATUS) && (
              <Link href="/admin/investigation">
                <Button variant="secondary">
                  ⚖️ Review Pending Cases
                </Button>
              </Link>
            )}
            {hasPermission(PERMISSIONS.VIEW_AUDIT_LOGS) && (
              <Link href="/admin/audit">
                <Button variant="secondary">
                  📊 View Recent Activity
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}
