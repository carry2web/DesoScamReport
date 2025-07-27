// Permission system for DeSo Scam Report

export const USER_ROLES = {
  ANONYMOUS: 'anonymous',
  USER: 'user',                    // Logged in users - can submit reports
  INVESTIGATOR: 'investigator',    // Investigation team - can assess reports
  NODE_OPERATOR: 'node_operator',  // Node operators - can access node tracker
  ADMIN: 'admin'                   // Admins - full access + configuration
}

export const PERMISSIONS = {
  // Report permissions
  VIEW_REPORTS: 'view_reports',
  SUBMIT_REPORTS: 'submit_reports',
  
  // Investigation permissions
  VIEW_INVESTIGATION_PANEL: 'view_investigation_panel',
  UPDATE_REPORT_STATUS: 'update_report_status',
  ADD_INVESTIGATION_NOTES: 'add_investigation_notes',
  VERIFY_SCAMMER: 'verify_scammer',
  
  // Node tracking permissions
  VIEW_NODE_TRACKER: 'view_node_tracker',
  UPDATE_NODE_STATUS: 'update_node_status',
  MANAGE_NODE_LIST: 'manage_node_list',
  
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  VIEW_ADMIN_PANEL: 'view_admin_panel',
  CONFIGURE_SETTINGS: 'configure_settings',
  VIEW_AUDIT_LOGS: 'view_audit_logs'
}

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ANONYMOUS]: [
    PERMISSIONS.VIEW_REPORTS
  ],
  [USER_ROLES.USER]: [
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.SUBMIT_REPORTS
  ],
  [USER_ROLES.INVESTIGATOR]: [
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.SUBMIT_REPORTS,
    PERMISSIONS.VIEW_INVESTIGATION_PANEL,
    PERMISSIONS.UPDATE_REPORT_STATUS,
    PERMISSIONS.ADD_INVESTIGATION_NOTES,
    PERMISSIONS.VERIFY_SCAMMER
  ],
  [USER_ROLES.NODE_OPERATOR]: [
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.SUBMIT_REPORTS,
    PERMISSIONS.VIEW_NODE_TRACKER,
    PERMISSIONS.UPDATE_NODE_STATUS
  ],
  [USER_ROLES.ADMIN]: [
    // Admins have all permissions
    ...Object.values(PERMISSIONS)
  ]
}

// Check if user has specific permission
export function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false
  
  const rolePermissions = ROLE_PERMISSIONS[userRole] || []
  return rolePermissions.includes(permission)
}

// Check if user has any of the specified permissions
export function hasAnyPermission(userRole, permissions) {
  return permissions.some(permission => hasPermission(userRole, permission))
}

// Check if user has all of the specified permissions
export function hasAllPermissions(userRole, permissions) {
  return permissions.every(permission => hasPermission(userRole, permission))
}

// Get all permissions for a role
export function getRolePermissions(userRole) {
  return ROLE_PERMISSIONS[userRole] || []
}

// Verify DeSo identity and determine role
export async function verifyUserRole(publicKey) {
  // This would integrate with DeSo identity verification
  // For now, return mock data based on known public keys
  
  // Mock investigation team members (replace with actual DeSo identities)
  const INVESTIGATION_TEAM = [
    'BC1YLhtBTFXAsKZgoaoYNW8mWAJWdfQjycheAeYjaX46azVrnZfJ94s',
    // Add more investigation team public keys
  ]
  
  // Mock node operators (replace with actual DeSo identities)
  const NODE_OPERATORS = [
    'BC1YLj8xM7K9pQwRsT3NqV4eF6gH8iJ2kL3mN5oP7qR9sT4uV6wX8y',
    // Add more node operator public keys
  ]
  
  // Mock admins (replace with actual DeSo identities)
  const ADMINS = [
    'BC1YLm1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k',
    // Add more admin public keys
  ]
  
  if (ADMINS.includes(publicKey)) {
    return USER_ROLES.ADMIN
  }
  
  if (INVESTIGATION_TEAM.includes(publicKey)) {
    return USER_ROLES.INVESTIGATOR
  }
  
  if (NODE_OPERATORS.includes(publicKey)) {
    return USER_ROLES.NODE_OPERATOR
  }
  
  // Default to regular user if logged in
  return publicKey ? USER_ROLES.USER : USER_ROLES.ANONYMOUS
}

// Check if user can access a specific route
export function canAccessRoute(userRole, route) {
  const routePermissions = {
    '/reports': [PERMISSIONS.VIEW_REPORTS],
    '/reports/submit': [PERMISSIONS.SUBMIT_REPORTS],
    '/admin': [PERMISSIONS.VIEW_ADMIN_PANEL],
    '/admin/investigation': [PERMISSIONS.VIEW_INVESTIGATION_PANEL],
    '/admin/nodes': [PERMISSIONS.VIEW_NODE_TRACKER],
    '/admin/users': [PERMISSIONS.MANAGE_USERS],
    '/admin/settings': [PERMISSIONS.CONFIGURE_SETTINGS]
  }
  
  const requiredPermissions = routePermissions[route]
  if (!requiredPermissions) return true // Public route
  
  return hasAnyPermission(userRole, requiredPermissions)
}
