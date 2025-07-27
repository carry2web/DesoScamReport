'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { useAuth } from '@/context/AuthContext'

const SCAM_CATEGORIES = [
  { 
    value: 'CRITICAL', 
    label: '🔴 Critical - Seed Phrase Theft',
    description: 'Someone is requesting seed phrases, private keys, or wallet access. URGENT!'
  },
  { 
    value: 'HIGH', 
    label: '🟠 High - Team Impersonation',
    description: 'Impersonating DeSo team members, unauthorized logo usage, or false authority claims'
  },
  { 
    value: 'MEDIUM', 
    label: '🟡 Medium - External Luring',
    description: 'Suspicious external invites (Telegram, Discord), fake investment groups, malicious links'
  },
  { 
    value: 'LOW', 
    label: '🔵 Low - General Suspicious',
    description: 'Unusual behavior patterns, mass messaging, or potential scam preparation'
  }
]

const EXAMPLE_DESCRIPTIONS = {
  CRITICAL: "User @fakesupport messaged me claiming to be DeSo support and asked me to 'verify my wallet' by sharing my seed phrase. They said my account would be suspended if I didn't comply within 24 hours.",
  HIGH: "Account @desoofficial (not the real one) is using the official DeSo logo and claiming to be a team member. They're promoting a fake 'official' DeSo token sale.",
  MEDIUM: "User keeps inviting people to a Telegram group claiming it's an 'exclusive DeSo investment opportunity' with guaranteed 1000% returns.",
  LOW: "Account is sending identical copy-paste messages to many users about a 'limited time offer' that seems suspicious."
}

export function ScammerReportForm({ onReportSubmitted }) {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState({
    reportedUsername: '',
    reportedPublicKey: '',
    category: '',
    description: '',
    evidenceUrls: [''],
    urgentReport: false
  })

  const [errors, setErrors] = useState({})

  const submitReport = useMutation({
    mutationFn: async (reportData) => {
      // Here we'll integrate with DeSo API to submit the report
      // For now, simulate API call
      const response = await fetch('/api/reports/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reportData,
          reporterPublicKey: currentUser?.PublicKeyBase58Check,
          reporterUsername: currentUser?.Profile?.Username,
          timestamp: new Date().toISOString()
        })
      })
      
      if (!response.ok) throw new Error('Failed to submit report')
      return response.json()
    },
    onSuccess: (data) => {
      toast.success('🛡️ Report posted to DeSo blockchain! Community has been notified.')
      
      // Show additional success info
      if (data.desoPostUrl) {
        toast.info(
          <div>
            <p>Your report is now public on DeSo!</p>
            <a 
              href={data.desoPostUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View on DeSo →
            </a>
          </div>,
          { autoClose: 8000 }
        )
      }
      
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      setFormData({
        reportedUsername: '',
        reportedPublicKey: '',
        category: '',
        description: '',
        evidenceUrls: [''],
        urgentReport: false
      })
      onReportSubmitted?.(data)
    },
    onError: (error) => {
      toast.error(`Failed to submit report: ${error.message}`)
    }
  })

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.reportedUsername && !formData.reportedPublicKey) {
      newErrors.identity = 'Please provide either username or public key of the reported account'
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a scam category'
    }
    
    if (!formData.description || formData.description.length < 20) {
      newErrors.description = 'Please provide detailed description (minimum 20 characters)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!currentUser) {
      toast.error('Please log in to submit a report')
      return
    }
    
    if (validateForm()) {
      submitReport.mutate(formData)
    }
  }

  const addEvidenceUrl = () => {
    setFormData(prev => ({
      ...prev,
      evidenceUrls: [...prev.evidenceUrls, '']
    }))
  }

  const updateEvidenceUrl = (index, value) => {
    setFormData(prev => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.map((url, i) => i === index ? value : url)
    }))
  }

  const removeEvidenceUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.filter((_, i) => i !== index)
    }))
  }

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
            🔐 Safe DeSo Identity Login Required
          </h3>
          <div className="text-blue-700 dark:text-blue-300 space-y-3">
            <p>
              <strong>Why do we require login?</strong> To prevent false reports and maintain accountability, we need to verify your DeSo identity.
            </p>
            <p>
              <strong>Is it safe?</strong> Yes! We use the same secure DeSo Identity system that powers all DeSo apps like Diamond, Bitclout, and others.
            </p>
            <div className="bg-blue-100 dark:bg-blue-800/30 rounded-lg p-4 mt-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                ✅ DeSo Identity is secure because:
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• We never see your private keys or seed phrase</li>
                <li>• Login happens through official DeSo infrastructure</li>
                <li>• No passwords or sensitive data stored on our servers</li>
                <li>• Same system used by all legitimate DeSo applications</li>
                <li>• You maintain full control of your DeSo identity</li>
              </ul>
            </div>
            <p className="text-sm">
              <strong>Ready to help protect the community?</strong> Click the login button in the top navigation to get started with DeSo Identity.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
            🛡️ Alternative: Anonymous Tip
          </h4>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            If you prefer not to login, you can share threat information through official DeSo community channels:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Report to official DeSo support channels</li>
            <li>• Share warnings in community forums</li>
            <li>• Contact verified DeSo team members directly</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🚨 Report Scammer Account
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Help protect the DeSo community by reporting suspicious accounts. All reports are reviewed by human moderators before any action is taken.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reported Account Identity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reported Account *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="Username (e.g., @suspiciousaccount)"
                  value={formData.reportedUsername}
                  onChange={(e) => setFormData(prev => ({ ...prev, reportedUsername: e.target.value }))}
                  className={errors.identity ? 'border-red-500' : ''}
                />
                <span className="text-xs text-gray-500">Username with or without @</span>
              </div>
              <div>
                <Input
                  placeholder="Public Key (BC1YL...)"
                  value={formData.reportedPublicKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, reportedPublicKey: e.target.value }))}
                  className={errors.identity ? 'border-red-500' : ''}
                />
                <span className="text-xs text-gray-500">DeSo public key</span>
              </div>
            </div>
            {errors.identity && (
              <p className="text-red-500 text-sm mt-1">{errors.identity}</p>
            )}
          </div>

          {/* Scam Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Scam Category *
            </label>
            <Select
              options={SCAM_CATEGORIES}
              value={formData.category}
              onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              placeholder="Select the type of scam..."
              className={errors.category ? 'border-red-500' : ''}
            />
            {formData.category && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                  💡 Example Report for {SCAM_CATEGORIES.find(cat => cat.value === formData.category)?.label}:
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-400 italic">
                  "{EXAMPLE_DESCRIPTIONS[formData.category]}"
                </p>
              </div>
            )}
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Detailed Description *
            </label>
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                📝 Please include:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• <strong>What happened:</strong> How did they contact you?</li>
                <li>• <strong>What they asked for:</strong> Seed phrases, money, external links?</li>
                <li>• <strong>Their tactics:</strong> Urgency, authority claims, promises?</li>
                <li>• <strong>Timeline:</strong> When did this occur?</li>
                <li>• <strong>Evidence:</strong> Screenshots, post links, chat logs</li>
              </ul>
            </div>
            <textarea
              rows={5}
              placeholder="Example: 'User @suspiciousaccount sent me a direct message claiming to be from DeSo support. They said my account had suspicious activity and I needed to verify my seed phrase within 2 hours or my account would be suspended. They provided a fake support website link...'"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
              <span className={`text-xs ${formData.description.length > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
                {formData.description.length}/500 characters
              </span>
            </div>
          </div>

          {/* Evidence URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Evidence Links
            </label>
            <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                🔗 Types of evidence to include:
              </h4>
              <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                <li>• <strong>DeSo post links:</strong> Suspicious posts or profile</li>
                <li>• <strong>Screenshot links:</strong> Chat messages, fake websites</li>
                <li>• <strong>External links:</strong> Malicious websites they shared</li>
                <li>• <strong>Social media:</strong> Related accounts on other platforms</li>
              </ul>
            </div>
            <div className="space-y-2">
              {formData.evidenceUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="https://... (DeSo post, screenshot, suspicious link, etc.)"
                    value={url}
                    onChange={(e) => updateEvidenceUrl(index, e.target.value)}
                    className="flex-1"
                  />
                  {formData.evidenceUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEvidenceUrl(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEvidenceUrl}
              >
                + Add Evidence Link
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <strong>Tip:</strong> Screenshots can be uploaded to imgur.com or similar services, then paste the link here
            </p>
          </div>

          {/* Urgent Report */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="urgentReport"
              checked={formData.urgentReport}
              onChange={(e) => setFormData(prev => ({ ...prev, urgentReport: e.target.checked }))}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="urgentReport" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              🚨 <strong>Urgent Report</strong> - Active threat to community (seed phrase theft in progress)
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              loading={submitReport.isPending}
              disabled={submitReport.isPending}
            >
              {submitReport.isPending ? 'Posting to DeSo Blockchain...' : '� Post Report to DeSo Blockchain'}
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Your report will be publicly visible on the DeSo blockchain for transparency
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
              📋 How DeSo Blockchain Reports Work:
            </h4>
            <ul className="text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Your report will be posted publicly on the DeSo blockchain</li>
              <li>• Reports are permanent and cannot be deleted (blockchain immutability)</li>
              <li>• All reports are tagged with #DeSoSCAMReport for transparency</li>
              <li>• Community can see, like, and share your report to spread awareness</li>
              <li>• Investigation team reviews all reports for verification</li>
              <li>• False reports may result in community downvotes and reputation damage</li>
            </ul>
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-blue-700 dark:text-blue-400 text-xs">
                <strong>🔗 Transparency:</strong> Using DeSo blockchain ensures all reports are public, 
                verifiable, and cannot be censored or manipulated by any central authority.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScammerReportForm
