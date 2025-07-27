'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { Select } from '@/components/Select'
import { Avatar } from '@/components/Avatar'
import { PermissionGuard } from '@/components/PermissionGuard'
import { PERMISSIONS } from '@/lib/permissions'
import styles from './page.module.css'

const URGENT_FILTERS = [
  { value: '', label: 'All Reports' },
  { value: 'true', label: '� Urgent Reports Only' },
  { value: 'false', label: '� Normal Priority Reports' }
]

const CATEGORY_FILTERS = [
  { value: '', label: 'All Categories' },
  { value: 'CRITICAL', label: '🔴 Critical - Seed Phrase Theft' },
  { value: 'HIGH', label: '🟠 High - Team Impersonation' },
  { value: 'MEDIUM', label: '🟡 Medium - External Luring' },
  { value: 'LOW', label: '🔵 Low - General Suspicious' }
]

function ReportCard({ report }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return styles.statusPending
      case 'INVESTIGATING': return styles.statusInvestigating
      case 'VERIFIED_SCAMMER': return styles.statusVerified
      case 'FALSE_POSITIVE': return styles.statusFalse
      case 'INSUFFICIENT_EVIDENCE': return styles.statusInsufficient
      default: return styles.statusInsufficient
    }
  }

  const getCategoryClass = (category) => {
    switch (category) {
      case 'CRITICAL': return styles.categoryHigh
      case 'HIGH': return styles.categoryHigh
      case 'MEDIUM': return styles.categoryMedium
      case 'LOW': return styles.categoryLow
      default: return styles.categoryLow
    }
  }

  return (
    <div className={styles.reportCard}>
      {/* Header */}
      <div className={styles.reportHeader}>
        <div className={styles.userInfo}>
          <Avatar
            publicKey={report.reportedPublicKey}
            username={report.reportedUsername}
            size="md"
          />
          <div className={styles.userDetails}>
            <h3>@{report.reportedUsername || 'Unknown User'}</h3>
            <p>Report #{report.id}</p>
            <p>Reported {new Date(report.timestamp).toLocaleDateString()} by @{report.reporterUsername}</p>
          </div>
        </div>
        
        <div className={styles.statusBadges}>
          <span className={`${styles.badge} ${getStatusClass(report.status)}`}>
            {STATUS_FILTERS.find(s => s.value === report.status)?.label || report.status}
          </span>
          <span className={`${styles.badge} ${getCategoryClass(report.category)}`}>
            {report.category}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.quickStat}>
          <div className="value">{report.communityReportCount || 1}</div>
          <div className="label">Community Reports</div>
        </div>
        <div className={styles.quickStat}>
          <div className="value">{report.nodesBlocking?.length || 0}</div>
          <div className="label">Nodes Blocking</div>
        </div>
        <div className={styles.quickStat}>
          <div className="value">{report.evidenceUrls?.length || 0}</div>
          <div className="label">Evidence Items</div>
        </div>
      </div>

      {/* Description */}
      <div className={styles.reportDescription}>
        <p>
          {isExpanded ? report.description : `${report.description.substring(0, 150)}...`}
        </p>
        {report.description.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.expandButton}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={styles.evidenceSection}>
          {/* Evidence Links */}
          {report.evidenceUrls && report.evidenceUrls.length > 0 && (
            <div>
              <h4>Evidence:</h4>
              <div className={styles.evidenceGrid}>
                {report.evidenceUrls.map((url, index) => (
                  <div key={index} className={styles.evidenceItem}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔗 Evidence {index + 1}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Investigation Notes */}
          {report.investigationNotes && (
            <div>
              <h4>Investigation Notes:</h4>
              <p>{report.investigationNotes}</p>
            </div>
          )}

          {/* Node Blocking Status */}
          <div>
            <h4>Node Blocking Status:</h4>
            <div className={styles.evidenceGrid}>
              {['node.deso.org', 'desocialworld.com', 'safetynet.social', 'api.deso.com'].map(node => {
                const isBlocking = report.nodesBlocking?.includes(node)
                return (
                  <div key={node} className={styles.evidenceItem}>
                    {isBlocking ? '🚫' : '✅'} {node.split('.')[0]}
                  </div>
                )
              })}
            </div>
          </div>

          <div className={styles.actionButtons}>
            <Button variant="secondary" size="small">
              View Details
            </Button>
            <Button variant="primary" size="small">
              Update Status
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    urgent: '',
    category: '',
    search: ''
  })

  // Fetch reports from DeSo blockchain
  const { data: reportsData, isLoading, error } = useQuery({
    queryKey: ['reports', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.category) params.set('category', filters.category)
      if (filters.urgent === 'true') params.set('urgent', 'true')
      params.set('limit', '100')
      
      const response = await fetch(`/api/reports?${params}`)
      if (!response.ok) throw new Error('Failed to fetch reports from DeSo')
      return response.json()
    },
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })

  const reports = reportsData?.reports || []
  const stats = reportsData?.stats || { critical: 0, high: 0, medium: 0, low: 0, urgent: 0, total: 0 }

  // Filter reports based on search
  const filteredReports = reports.filter(report => {
    const matchesCategory = !filters.category || report.category === filters.category
    const matchesUrgent = filters.urgent === '' || 
      (filters.urgent === 'true' && report.urgent) ||
      (filters.urgent === 'false' && !report.urgent)
    const matchesSearch = !filters.search || 
      report.reportedUsername?.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.description?.toLowerCase().includes(filters.search.toLowerCase())
    
    return matchesCategory && matchesUrgent && matchesSearch
  })

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className="flex items-center justify-center min-h-64">
          <div style={{color: '#94a3b8'}}>🔍 Loading threat intelligence...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>🛡️ Threat Intelligence</h1>
        <p className={styles.subtitle}>
          Community-driven scammer detection and investigation
        </p>
        <PermissionGuard permission={PERMISSIONS.SUBMIT_REPORTS}>
          <Link href="/reports/submit">
            <Button variant="primary" size="large">
              🚨 Report Scammer
            </Button>
          </Link>
        </PermissionGuard>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Total Reports</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.pending}</div>
          <div className={styles.statLabel}>Pending Review</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.investigating}</div>
          <div className={styles.statLabel}>Under Investigation</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.verified}</div>
          <div className={styles.statLabel}>Verified Threats</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <Select
          options={URGENT_FILTERS}
          value={filters.urgent}
          onChange={(value) => setFilters(prev => ({ ...prev, urgent: value }))}
          placeholder="Filter by Priority"
        />
        <Select
          options={CATEGORY_FILTERS}
          value={filters.category}
          onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
          placeholder="Filter by Category"
        />
        <input
          type="text"
          placeholder="🔍 Search reports..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          style={{
            padding: '12px 16px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.5)',
            color: '#f1f5f9',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Reports List */}
      <div className={styles.reportsGrid}>
        {filteredReports.length === 0 ? (
          <div className={styles.noReports}>
            <div className={styles.shieldIcon}>🛡️</div>
            <div style={{fontSize: '18px', marginBottom: '16px'}}>
              No threats match your current filters.
            </div>
            <Link href="/reports/submit">
              <Button variant="primary">Submit First Report</Button>
            </Link>
          </div>
        ) : (
          filteredReports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{
        marginTop: '48px',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(251, 146, 60, 0.2))',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #ef4444, #fb923c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🚨 See Something Suspicious?
        </h3>
        <p style={{
          fontSize: '1.125rem',
          marginBottom: '24px',
          color: '#cbd5e1'
        }}>
          Help protect the community by reporting scammer accounts immediately.
        </p>
        <PermissionGuard permission={PERMISSIONS.SUBMIT_REPORTS}>
          <Link href="/reports/submit">
            <Button variant="primary" size="large">
              🛡️ Submit Threat Report
            </Button>
          </Link>
        </PermissionGuard>
      </div>
    </div>
  )
}
