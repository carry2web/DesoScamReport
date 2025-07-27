'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PermissionGuard } from '@/components/PermissionGuard'
import { Button } from '@/components/Button'
import { Select } from '@/components/Select'
import { Avatar } from '@/components/Avatar'
import { PERMISSIONS } from '@/lib/permissions'
import { usePermissions } from '@/context/PermissionContext'
import styles from './page.module.css'

const INVESTIGATION_STATUS = [
  { value: '', label: 'All Cases' },
  { value: 'PENDING', label: '🔍 Pending Review' },
  { value: 'INVESTIGATING', label: '⚖️ Under Investigation' },
  { value: 'NEEDS_MORE_EVIDENCE', label: '📋 Needs More Evidence' },
  { value: 'READY_FOR_DECISION', label: '⚡ Ready for Decision' }
]

const SEVERITY_LEVELS = [
  { value: '', label: 'All Severities' },
  { value: 'CRITICAL', label: '🔴 Critical' },
  { value: 'HIGH', label: '🟠 High' },
  { value: 'MEDIUM', label: '🟡 Medium' },
  { value: 'LOW', label: '🔵 Low' }
]

function InvestigationCard({ report, onUpdateStatus }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [notes, setNotes] = useState(report.investigationNotes || '')
  const { hasPermission } = usePermissions()

  const handleStatusUpdate = (newStatus) => {
    onUpdateStatus(report.id, newStatus, notes)
  }

  return (
    <div className={styles.investigationCard}>
      <div className={styles.cardHeader}>
        <div className={styles.reportInfo}>
          <Avatar 
            publicKey={report.reportedPublicKey}
            username={report.reportedUsername}
            size="md"
          />
          <div>
            <h3>@{report.reportedUsername}</h3>
            <p>Report #{report.id}</p>
            <span className={`${styles.severityBadge} ${styles[`severity${report.category}`]}`}>
              {report.category}
            </span>
          </div>
        </div>
        <div className={styles.caseStatus}>
          <span className={`${styles.statusBadge} ${styles[`status${report.status}`]}`}>
            {INVESTIGATION_STATUS.find(s => s.value === report.status)?.label || report.status}
          </span>
          <div className={styles.caseStats}>
            <div>Reports: {report.communityReportCount}</div>
            <div>Evidence: {report.evidenceUrls?.length || 0}</div>
          </div>
        </div>
      </div>

      <div className={styles.reportDescription}>
        <h4>Reported Activity:</h4>
        <p>{report.description}</p>
      </div>

      {report.evidenceUrls && report.evidenceUrls.length > 0 && (
        <div className={styles.evidenceSection}>
          <h4>Evidence ({report.evidenceUrls.length} items):</h4>
          <div className={styles.evidenceList}>
            {report.evidenceUrls.map((url, index) => (
              <a 
                key={index} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.evidenceLink}
              >
                🔗 Evidence {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      {isExpanded && (
        <div className={styles.investigationPanel}>
          <div className={styles.notesSection}>
            <label>Investigation Notes:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add investigation notes, findings, and recommendations..."
              className={styles.notesTextarea}
              rows={4}
            />
          </div>

          {hasPermission(PERMISSIONS.UPDATE_REPORT_STATUS) && (
            <div className={styles.actionButtons}>
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => handleStatusUpdate('INVESTIGATING')}
              >
                🔍 Start Investigation
              </Button>
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => handleStatusUpdate('NEEDS_MORE_EVIDENCE')}
              >
                📋 Request More Evidence
              </Button>
              <Button 
                variant="danger" 
                size="small"
                onClick={() => handleStatusUpdate('VERIFIED_SCAMMER')}
              >
                🚨 Verify as Scammer
              </Button>
              <Button 
                variant="success" 
                size="small"
                onClick={() => handleStatusUpdate('FALSE_POSITIVE')}
              >
                ✅ Mark False Positive
              </Button>
            </div>
          )}
        </div>
      )}

      <div className={styles.cardFooter}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.expandButton}
        >
          {isExpanded ? '▲ Hide Investigation Panel' : '▼ Show Investigation Panel'}
        </button>
      </div>
    </div>
  )
}

export default function InvestigationPage() {
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    search: ''
  })

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['investigation-reports', filters],
    queryFn: async () => {
      // Mock investigation data
      return [
        {
          id: 'RPT-001',
          reportedUsername: 'FakeDesoSupport',
          reportedPublicKey: 'BC1YLhtBTFXAsKZgoaoYNW8mWAJWdfQjycheAeYjaX46azVrnZfJ94s',
          category: 'CRITICAL',
          status: 'PENDING',
          description: 'Account impersonating DeSo support, requesting seed phrases via DM.',
          evidenceUrls: ['https://example.com/screenshot1.png', 'https://node.deso.org/posts/abc123'],
          communityReportCount: 12,
          investigationNotes: ''
        },
        {
          id: 'RPT-002',
          reportedUsername: 'CryptoGuru2025',
          reportedPublicKey: 'BC1YLj8xM7K9pQwRsT3NqV4eF6gH8iJ2kL3mN5oP7qR9sT4uV6wX8y',
          category: 'MEDIUM',
          status: 'INVESTIGATING',
          description: 'Promoting fake Telegram trading signals group.',
          evidenceUrls: ['https://example.com/telegram-invite.png'],
          communityReportCount: 5,
          investigationNotes: 'Initial review shows suspicious activity patterns.'
        }
      ]
    }
  })

  const handleUpdateStatus = async (reportId, newStatus, notes) => {
    // This would call an API to update the report status
    console.log('Updating report:', reportId, 'to status:', newStatus, 'with notes:', notes)
    // Implement API call here
  }

  const filteredReports = reports.filter(report => {
    const matchesStatus = !filters.status || report.status === filters.status
    const matchesSeverity = !filters.severity || report.category === filters.severity
    const matchesSearch = !filters.search || 
      report.reportedUsername?.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.description.toLowerCase().includes(filters.search.toLowerCase())
    
    return matchesStatus && matchesSeverity && matchesSearch
  })

  return (
    <PermissionGuard permission={PERMISSIONS.VIEW_INVESTIGATION_PANEL}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>⚖️ Investigation Panel</h1>
          <p className={styles.subtitle}>
            Review, investigate, and make decisions on reported threats
          </p>
        </div>

        <div className={styles.filters}>
          <Select
            options={INVESTIGATION_STATUS}
            value={filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            placeholder="Filter by Status"
          />
          <Select
            options={SEVERITY_LEVELS}
            value={filters.severity}
            onChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}
            placeholder="Filter by Severity"
          />
          <input
            type="text"
            placeholder="🔍 Search cases..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.casesList}>
          {isLoading ? (
            <div className={styles.loading}>🔍 Loading investigation cases...</div>
          ) : filteredReports.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>⚖️</div>
              <h3>No cases match your filters</h3>
              <p>Try adjusting your search criteria or check back later for new cases.</p>
            </div>
          ) : (
            filteredReports.map(report => (
              <InvestigationCard 
                key={report.id} 
                report={report} 
                onUpdateStatus={handleUpdateStatus}
              />
            ))
          )}
        </div>
      </div>
    </PermissionGuard>
  )
}
