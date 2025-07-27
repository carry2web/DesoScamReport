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
  { value: 'true', label: '🚨 Urgent Reports Only' },
  { value: 'false', label: '📊 Normal Priority Reports' }
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
    switch (status?.toLowerCase()) {
      case 'verified': return styles.statusVerified
      case 'investigating': return styles.statusInvestigating
      case 'dismissed': return styles.statusDismissed
      default: return styles.statusPending
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'CRITICAL': return '#ef4444'
      case 'HIGH': return '#fb923c'
      case 'MEDIUM': return '#fbbf24'
      case 'LOW': return '#06b6d4'
      default: return '#6b7280'
    }
  }

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'CRITICAL': return '🔴'
      case 'HIGH': return '🟠'
      case 'MEDIUM': return '🟡'
      case 'LOW': return '🔵'
      default: return '⚫'
    }
  }

  return (
    <div className={styles.reportCard}>
      <div className={styles.reportHeader}>
        <div className={styles.reportMeta}>
          <div className={styles.reportId}>
            #{report.id}
            {report.urgent && <span className={styles.urgentBadge}>🚨 URGENT</span>}
          </div>
          <div 
            className={styles.category}
            style={{ 
              backgroundColor: `${getCategoryColor(report.category)}20`,
              color: getCategoryColor(report.category),
              border: `1px solid ${getCategoryColor(report.category)}40`
            }}
          >
            {getCategoryEmoji(report.category)} {report.category}
          </div>
        </div>
        <div className={styles.reportDate}>
          {new Date(report.timestamp).toLocaleDateString()}
        </div>
      </div>

      <div className={styles.reportContent}>
        <div className={styles.reportedUser}>
          <Avatar 
            publicKey={report.reportedPublicKey} 
            username={report.reportedUsername}
            size="sm"
          />
          <div className={styles.userInfo}>
            <div className={styles.username}>@{report.reportedUsername}</div>
            <div className={styles.publicKey}>
              {report.reportedPublicKey?.slice(0, 8)}...{report.reportedPublicKey?.slice(-8)}
            </div>
          </div>
        </div>

        <p className={styles.description}>
          {isExpanded ? report.description : `${report.description?.slice(0, 100)}...`}
          {report.description?.length > 100 && (
            <button 
              className={styles.expandButton}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </p>

        {report.evidence && report.evidence.length > 0 && (
          <div className={styles.evidence}>
            <div className={styles.evidenceLabel}>🔍 Evidence:</div>
            <ul className={styles.evidenceList}>
              {report.evidence.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {report.desoPostUrl && (
          <div className={styles.desoLink}>
            <a 
              href={report.desoPostUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.desoPostLink}
            >
              🌐 View on DeSo Blockchain
            </a>
          </div>
        )}
      </div>

      <div className={styles.reportFooter}>
        <div className={styles.reporter}>
          Reported by: <strong>@{report.reporterUsername}</strong>
        </div>
        <div className={`${styles.status} ${getStatusClass(report.status)}`}>
          {report.status || 'Pending'}
        </div>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    category: '',
    urgent: '',
    search: ''
  })

  // Fetch reports from DeSo blockchain
  const { data: reportsData, isLoading, error } = useQuery({
    queryKey: ['reports', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.urgent) params.append('urgent', filters.urgent)
      if (filters.search) params.append('search', filters.search)
      
      const response = await fetch(`/api/reports?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reports from DeSo blockchain')
      }
      return response.json()
    },
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
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
          <div style={{color: '#94a3b8'}}>🔍 Loading threat intelligence from DeSo blockchain...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className="flex items-center justify-center min-h-64">
          <div style={{color: '#ef4444'}}>❌ Error loading reports: {error.message}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>
              🛡️ Threat Intelligence Dashboard
            </h1>
            <p className={styles.subtitle}>
              Community-driven scammer reports stored transparently on the DeSo blockchain
            </p>
          </div>
          <PermissionGuard permission={PERMISSIONS.SUBMIT_REPORTS}>
            <Link href="/reports/submit">
              <Button variant="primary" size="large">
                🚨 Report Threat
              </Button>
            </Link>
          </PermissionGuard>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Total Reports</div>
          <div className={styles.statIcon}>📊</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.urgent}</div>
          <div className={styles.statLabel}>Urgent Threats</div>
          <div className={styles.statIcon}>🚨</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.critical}</div>
          <div className={styles.statLabel}>Critical Reports</div>
          <div className={styles.statIcon}>🔴</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.high}</div>
          <div className={styles.statLabel}>High Priority</div>
          <div className={styles.statIcon}>🟠</div>
        </div>
      </div>

      {/* Blockchain Info Banner */}
      <div className={styles.blockchainBanner}>
        <div className={styles.bannerIcon}>🌐</div>
        <div className={styles.bannerContent}>
          <div className={styles.bannerTitle}>Powered by DeSo Blockchain</div>
          <div className={styles.bannerText}>
            All reports are stored permanently and transparently on the decentralized DeSo network. 
            This ensures data integrity and prevents tampering or censorship.
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <Select
            value={filters.category}
            onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            options={CATEGORY_FILTERS}
            placeholder="Filter by threat level"
          />
        </div>
        <div className={styles.filterGroup}>
          <Select
            value={filters.urgent}
            onChange={(value) => setFilters(prev => ({ ...prev, urgent: value }))}
            options={URGENT_FILTERS}
            placeholder="Filter by urgency"
          />
        </div>
        <div className={styles.filterGroup}>
          <input
            type="text"
            placeholder="🔍 Search reports..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Reports List */}
      <div className={styles.reportsList}>
        {filteredReports.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>No reports found</h3>
            <p>No threat reports match your current filters. Try adjusting your search criteria.</p>
            <PermissionGuard permission={PERMISSIONS.SUBMIT_REPORTS}>
              <Link href="/reports/submit">
                <Button variant="primary">
                  Submit First Report
                </Button>
              </Link>
            </PermissionGuard>
          </div>
        ) : (
          filteredReports.map((report) => (
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
          All reports are stored permanently on the DeSo blockchain for transparency.
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
