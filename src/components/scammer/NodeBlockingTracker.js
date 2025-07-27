'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/Button'
import { Avatar } from '@/components/Avatar'

const MONITORED_NODES = [
  { 
    url: 'https://node.deso.org',
    name: 'Official DeSo Node',
    operator: 'DeSo Team',
    status: 'active'
  },
  { 
    url: 'https://desocialworld.desovalidator.net',
    name: 'DeSocial World',
    operator: 'Community Validator',
    status: 'active'
  },
  { 
    url: 'https://safetynet.social',
    name: 'SafetyNet Social',
    operator: 'Community Node',
    status: 'active'
  },
  { 
    url: 'https://api.deso.com',
    name: 'DeSo API',
    operator: 'DeSo Infrastructure',
    status: 'active'
  },
  {
    url: 'https://diamondapp.com',
    name: 'DiamondApp',
    operator: 'Diamond Team',
    status: 'active'
  }
]

function NodeCard({ node, blockingStatus, onCheckBlocking }) {
  const [isChecking, setIsChecking] = useState(false)
  
  const handleCheck = async () => {
    setIsChecking(true)
    await onCheckBlocking(node.url)
    setIsChecking(false)
  }

  const status = blockingStatus?.[node.url]
  const lastChecked = status?.lastChecked ? new Date(status.lastChecked).toLocaleString() : 'Never'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {node.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {node.operator} • {node.url}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Last checked: {lastChecked}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            node.status === 'active' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {node.status}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Blocking Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">
              {status?.blockedAccounts || 0}
            </div>
            <div className="text-xs text-gray-500">Blocked Accounts</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-600">
              {status?.underReview || 0}
            </div>
            <div className="text-xs text-gray-500">Under Review</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              {status?.responseTime || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">Avg Response (hrs)</div>
          </div>
        </div>

        {/* Recent Actions */}
        {status?.recentActions && status.recentActions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recent Actions:
            </h4>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {status.recentActions.map((action, index) => (
                <div key={index} className="text-xs bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <span className={`font-medium ${
                    action.type === 'BLOCKED' ? 'text-red-600' : 
                    action.type === 'REVIEWING' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {action.type}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    @{action.username} • {new Date(action.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleCheck}
          loading={isChecking}
          disabled={isChecking}
          size="sm"
          className="w-full"
        >
          {isChecking ? 'Checking...' : '🔍 Check Blocking Status'}
        </Button>
      </div>
    </div>
  )
}

function ScammerAccountCard({ account, nodeStatuses }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const blockedByNodes = MONITORED_NODES.filter(node => 
    nodeStatuses[node.url]?.blockedAccounts?.includes(account.username)
  )

  const blockingPercentage = (blockedByNodes.length / MONITORED_NODES.length) * 100

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Avatar
            publicKey={account.publicKey}
            username={account.username}
            size="md"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              @{account.username}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {account.category} • Reported {account.reportCount} times
            </p>
            <p className="text-xs text-gray-500">
              First reported: {new Date(account.firstReported).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">
            {blockedByNodes.length}/{MONITORED_NODES.length}
          </div>
          <div className="text-xs text-gray-500">Nodes Blocking</div>
          <div className={`text-sm font-medium ${
            blockingPercentage >= 50 ? 'text-red-600' : 
            blockingPercentage >= 25 ? 'text-yellow-600' : 'text-gray-600'
          }`}>
            {blockingPercentage.toFixed(0)}% Coverage
          </div>
        </div>
      </div>

      {/* Node Blocking Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        {MONITORED_NODES.map(node => {
          const isBlocked = blockedByNodes.some(n => n.url === node.url)
          const status = nodeStatuses[node.url]
          
          return (
            <div
              key={node.url}
              className={`px-2 py-1 rounded text-xs text-center border ${
                isBlocked 
                  ? 'bg-red-100 text-red-800 border-red-300' 
                  : status?.underReview?.includes(account.username)
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                  : 'bg-green-100 text-green-800 border-green-300'
              }`}
              title={node.name}
            >
              {isBlocked ? '🚫' : status?.underReview?.includes(account.username) ? '⏳' : '✅'}
              <div className="truncate">{node.name.split(' ')[0]}</div>
            </div>
          )
        })}
      </div>

      {/* Description Preview */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {isExpanded ? account.description : `${account.description.substring(0, 100)}...`}
        </p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t pt-4 space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Blocking Timeline:
            </h4>
            <div className="space-y-1">
              {blockedByNodes.map(node => (
                <div key={node.url} className="text-sm text-gray-600 dark:text-gray-400">
                  🚫 {node.name} - Blocked on {new Date().toLocaleDateString()}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Investigation Status:
            </h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              account.investigationStatus === 'VERIFIED_SCAMMER' ? 'bg-red-100 text-red-800' :
              account.investigationStatus === 'INVESTIGATING' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {account.investigationStatus}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export function NodeBlockingTracker() {
  const [nodeStatuses, setNodeStatuses] = useState({})
  const [activeTab, setActiveTab] = useState('nodes') // 'nodes' or 'scammers'

  // Fetch node blocking statuses
  const { data: reportedAccounts = [], isLoading } = useQuery({
    queryKey: ['reported-accounts'],
    queryFn: async () => {
      // Mock data for reported accounts
      return [
        {
          username: 'FakeDesoSupport',
          publicKey: 'BC1YLhtBTFXAsKZgoaoYNW8mWAJWdfQjycheAeYjaX46azVrnZfJ94s',
          category: 'CRITICAL',
          reportCount: 12,
          firstReported: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          investigationStatus: 'VERIFIED_SCAMMER',
          description: 'Impersonating official DeSo support and requesting seed phrases from users via direct messages.'
        },
        {
          username: 'CryptoGuru2025',
          publicKey: 'BC1YLj8xM7K9pQwRsT3NqV4eF6gH8iJ2kL3mN5oP7qR9sT4uV6wX8y',
          category: 'MEDIUM',
          reportCount: 5,
          firstReported: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          investigationStatus: 'INVESTIGATING',
          description: 'Promoting fake Telegram investment groups and requesting payments for premium trading signals.'
        }
      ]
    }
  })

  const checkNodeBlocking = async (nodeUrl) => {
    try {
      // Simulate checking node blocking status
      // In real implementation, this would query each node's API
      const mockResponse = {
        [nodeUrl]: {
          blockedAccounts: Math.random() > 0.5 ? ['FakeDesoSupport'] : [],
          underReview: ['CryptoGuru2025'],
          responseTime: Math.floor(Math.random() * 48) + 1,
          lastChecked: new Date().toISOString(),
          recentActions: [
            {
              type: 'BLOCKED',
              username: 'FakeDesoSupport',
              timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              type: 'REVIEWING',
              username: 'CryptoGuru2025',
              timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        }
      }

      setNodeStatuses(prev => ({
        ...prev,
        ...mockResponse
      }))
    } catch (error) {
      console.error('Error checking node blocking:', error)
    }
  }

  const checkAllNodes = async () => {
    for (const node of MONITORED_NODES) {
      await checkNodeBlocking(node.url)
      // Add small delay to avoid overwhelming nodes
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  useEffect(() => {
    // Initial check of all nodes
    checkAllNodes()
    
    // Set up periodic checks every 10 minutes
    const interval = setInterval(checkAllNodes, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading node blocking data...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🌐 Node Blocking Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor which DeSo nodes have blocked reported scammer accounts. Each node operates independently.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('nodes')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'nodes'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          🖥️ Node Status ({MONITORED_NODES.length})
        </button>
        <button
          onClick={() => setActiveTab('scammers')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'scammers'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          🚨 Reported Accounts ({reportedAccounts.length})
        </button>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              System Actions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bulk operations for node monitoring
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={checkAllNodes}
              size="sm"
              variant="outline"
            >
              🔄 Refresh All Nodes
            </Button>
            <Button
              onClick={() => {/* Export blocking data */}}
              size="sm"
              variant="outline"
            >
              📊 Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'nodes' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MONITORED_NODES.map(node => (
            <NodeCard
              key={node.url}
              node={node}
              blockingStatus={nodeStatuses}
              onCheckBlocking={checkNodeBlocking}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {reportedAccounts.map(account => (
            <ScammerAccountCard
              key={account.username}
              account={account}
              nodeStatuses={nodeStatuses}
            />
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          📊 Network Protection Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {MONITORED_NODES.filter(n => nodeStatuses[n.url]).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Nodes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {reportedAccounts.filter(a => a.investigationStatus === 'VERIFIED_SCAMMER').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Verified Scammers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {reportedAccounts.filter(a => a.investigationStatus === 'INVESTIGATING').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Under Investigation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(nodeStatuses).reduce((acc, status) => acc + (status?.responseTime || 0), 0) / Object.keys(nodeStatuses).length || 0}hrs
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NodeBlockingTracker
