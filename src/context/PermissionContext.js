'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { verifyUserRole, hasPermission, USER_ROLES } from '@/lib/permissions'

const PermissionContext = createContext({
  userRole: USER_ROLES.ANONYMOUS,
  hasPermission: () => false,
  isLoading: true
})

export function PermissionProvider({ children }) {
  const { userPublicKey } = useAuth()
  const [userRole, setUserRole] = useState(USER_ROLES.ANONYMOUS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function determineUserRole() {
      setIsLoading(true)
      try {
        const role = await verifyUserRole(userPublicKey)
        setUserRole(role)
      } catch (error) {
        console.error('Error determining user role:', error)
        setUserRole(USER_ROLES.ANONYMOUS)
      } finally {
        setIsLoading(false)
      }
    }

    determineUserRole()
  }, [userPublicKey])

  const checkPermission = (permission) => {
    return hasPermission(userRole, permission)
  }

  const value = {
    userRole,
    hasPermission: checkPermission,
    isLoading
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionContext)
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider')
  }
  return context
}
