'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Button } from '@/components/Button'
import { Select } from '@/components/Select'
import { Avatar } from '@/components/Avatar'

const INVESTIGATION_STATUSES = [
  { value: 'PENDING', label: '🔍 Pending Investigation', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'INVESTIGATING', label: '⚖️ Under Investigation', color: 'bg-blue-100 text-blue-800' },
  { value: 'VERIFIED_SCAMMER', label: '🚨 Verified Scammer', color: 'bg-red-100 text-red-800' },
  { value: 'FALSE_POSITIVE', label: '✅ False Positive', color: 'bg-green-100 text-green-800' },
  { value: 'INSUFFICIENT_EVIDENCE', label: '📋 Insufficient Evidence', color: 'bg-gray-100 text-gray-800' }
]

const PRIORITY_LEVELS = [
  { value: 'URGENT', label: '🚨 Urgent', color: 'bg-red-100 text-red-800' },
  { value: 'HIGH', label: '🔴 High', color: 'bg-orange-100 text-orange-800' },
  { value: 'MEDIUM', label: '🟡 Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'LOW', label: '🔵 Low', color: 'bg-blue-100 text-blue-800' }
]

function ReportCard({ report, onStatusUpdate, onAssignInvestigator }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [investigationNotes, setInvestigationNotes] = useState(report.investigationNotes || '')

  const priorityConfig = PRIORITY_LEVELS.find(p => p.value === report.priority) || PRIORITY_LEVELS[3]
  const statusConfig = INVESTIGATION_STATUSES.find(s => s.value === report.status) || INVESTIGATION_STATUSES[0]

  const handleStatusUpdate = (newStatus) => {
    onStatusUpdate(report.id, newStatus, investigationNotes)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 border-red-500 p-6 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Avatar
            publicKey={report.reportedPublicKey}
            username={report.reportedUsername}
            size="md"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Report #{report.id}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Reported: @{report.reportedUsername || 'Unknown'}
            </p>
            <p className="text-xs text-gray-500">
              By: @{report.reporterUsername} • {new Date(report.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
            {priorityConfig.label}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
          <p className="text-sm text-gray-900 dark:text-white">{report.category}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Community Reports:</span>
          <p className="text-sm text-gray-900 dark:text-white">{report.communityReportCount || 1}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nodes Blocking:</span>
          <p className="text-sm text-gray-900 dark:text-white">{report.nodesBlocking?.length || 0}/10</p>
        </div>
      </div>

      {/* Description Preview */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {isExpanded ? report.description : `${report.description.substring(0, 150)}...`}
        </p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-4 border-t pt-4">
          {/* Evidence Links */}
          {report.evidenceUrls && report.evidenceUrls.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Evidence:</h4>
              <ul className="space-y-1">
                {report.evidenceUrls.map((url, index) => (
                  <li key={index}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      🔗 {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Node Blocking Status */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Node Blocking Status:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['node.deso.org', 'desocialworld.desovalidator.net', 'safetynet.social', 'api.deso.com'].map(node => {
                const isBlocking = report.nodesBlocking?.includes(node)
                return (
                  <div
                    key={node}
                    className={`px-2 py-1 rounded text-xs text-center ${
                      isBlocking 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {isBlocking ? '🚫' : '✅'} {node.split('.')[0]}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Investigation Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Investigation Notes:
            </label>
            <textarea
              rows={3}
              value={investigationNotes}
              onChange={(e) => setInvestigationNotes(e.target.value)}
              placeholder="Add investigation findings, evidence analysis, decision reasoning..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Select
              options={INVESTIGATION_STATUSES}
              value={report.status}
              onChange={handleStatusUpdate}
              placeholder="Update Status..."
              className="flex-1"
            />
            
            {report.status === 'VERIFIED_SCAMMER' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* Handle community alert */}}
                className="bg-red-50 hover:bg-red-100 text-red-700"
              >
                🚨 Post Community Alert
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* Handle node notification */}}
            >
              📢 Notify Nodes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function InvestigationDashboard() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: ''
  })

  // Fetch reports
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['investigation-reports', filters],
    queryFn: async () => {
      // Here we'll integrate with API to fetch reports
      // For now, return mock data
      return [
        {
          id: 'RPT-001',
          reportedUsername: 'FakeDesoSupport',
          reportedPublicKey: 'BC1YLhtBTFXAsKZgoaoYNW8mWAJWdfQjycheAeYjaX46azVrnZfJ94s',
          reporterUsername: 'CommunityMember1',
          category: 'CRITICAL',
          priority: 'URGENT',
          status: 'PENDING',
          description: 'This account is impersonating DeSo support and asking users for seed phrases in DMs. Multiple community members have reported receiving identical messages requesting wallet recovery assistance.',
          evidenceUrls: [
            'https://example.com/screenshot1.png',
            'https://node.deso.org/posts/abc123'
          ],
          timestamp: new Date().toISOString(),
          communityReportCount: 7,
          nodesBlocking: ['node.deso.org'],
          investigationNotes: ''
        },
        {
          id: 'RPT-002',
          reportedUsername: 'CryptoGuru2025',
          reportedPublicKey: 'BC1YLj8xM7K9pQwRsT3NqV4eF6gH8iJ2kL3mN5oP7qR9sT4uV6wX8y',
          reporterUsername: 'VigilantUser',
          category: 'MEDIUM',
          priority: 'MEDIUM',
          status: 'INVESTIGATING',
          description: 'Account promoting fake Telegram group claiming to be official DeSo trading signals. Asking for small payments to join premium group.',
          evidenceUrls: [
            'https://example.com/telegram-invite.png'
          ],
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          communityReportCount: 3,
          nodesBlocking: [],
          investigationNotes: 'Checking Telegram group validity. Appears to be unrelated to DeSo team.'
        }
      ]
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  // Update report status
  const updateStatus = useMutation({
    mutationFn: async ({ reportId, status, notes }) => {
      // API call to update report status
      await fetch(`/api/reports/${reportId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, investigationNotes: notes })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investigation-reports'] })
      toast.success('Report status updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`)
    }
  })

  const handleStatusUpdate = (reportId, newStatus, notes) => {
    updateStatus.mutate({ reportId, status: newStatus, notes })
  }

  const filteredReports = reports.filter(report => {
    return (!filters.status || report.status === filters.status) &&
           (!filters.priority || report.priority === filters.priority) &&
           (!filters.category || report.category === filters.category)
  })

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'PENDING').length,
    investigating: reports.filter(r => r.status === 'INVESTIGATING').length,
    verified: reports.filter(r => r.status === 'VERIFIED_SCAMMER').length
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading investigation dashboard...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🔍 Investigation Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Review and investigate community scammer reports. All actions require human verification.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Reports</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending Review</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.investigating}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Investigating</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.verified}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Verified Scammers</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            options={[{ value: '', label: 'All Statuses' }, ...INVESTIGATION_STATUSES]}
            value={filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            placeholder="Filter by Status"
          />
          <Select
            options={[
              { value: '', label: 'All Priorities' },
              ...PRIORITY_LEVELS
            ]}
            value={filters.priority}
            onChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
            placeholder="Filter by Priority"
          />
          <Select
            options={[
              { value: '', label: 'All Categories' },
              { value: 'CRITICAL', label: 'Critical' },
              { value: 'HIGH', label: 'High' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'LOW', label: 'Low' }
            ]}
            value={filters.category}
            onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            placeholder="Filter by Category"
          />
        </div>
      </div>

      {/* Reports List */}
      <div>
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="text-gray-500 dark:text-gray-400">
              No reports match your current filters.
            </div>
          </div>
        ) : (
          filteredReports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onStatusUpdate={handleStatusUpdate}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default InvestigationDashboard
