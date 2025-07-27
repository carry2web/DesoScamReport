'use client'

import { usePermissions } from '@/context/PermissionContext'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/Button'
import Link from 'next/link'
import styles from './PermissionGuard.module.css'

export function PermissionGuard({ 
  permission, 
  permissions = [], 
  requireAll = false,
  fallback = null,
  children 
}) {
  const { hasPermission, userRole, isLoading } = usePermissions()
  const { userPublicKey } = useAuth()

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}>🔒</div>
        <p>Verifying permissions...</p>
      </div>
    )
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return fallback || <PermissionDenied userRole={userRole} userPublicKey={userPublicKey} />
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasAccess = requireAll 
      ? permissions.every(p => hasPermission(p))
      : permissions.some(p => hasPermission(p))
    
    if (!hasAccess) {
      return fallback || <PermissionDenied userRole={userRole} userPublicKey={userPublicKey} />
    }
  }

  return children
}

function PermissionDenied({ userRole, userPublicKey }) {
  return (
    <div className={styles.denied}>
      <div className={styles.icon}>🛡️</div>
      <h2>Access Restricted</h2>
      {!userPublicKey ? (
        <>
          <p>You need to be logged in with your DeSo identity to access this area.</p>
          <div className={styles.actions}>
            <Button variant="primary">
              Connect DeSo Identity
            </Button>
          </div>
        </>
      ) : (
        <>
          <p>Your current role ({userRole}) doesn't have permission to access this area.</p>
          <div className={styles.roleInfo}>
            <h3>Available Roles:</h3>
            <ul>
              <li><strong>Investigation Team:</strong> Assess and verify reported incidents</li>
              <li><strong>Node Operators:</strong> Access node tracking and blocking status</li>
              <li><strong>Administrators:</strong> Full system access and configuration</li>
            </ul>
          </div>
          <div className={styles.actions}>
            <Link href="/contact">
              <Button variant="secondary">
                Request Role Assignment
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="primary">
                View Public Reports
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
