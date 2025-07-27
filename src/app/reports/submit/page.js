'use client'

import { ScammerReportForm } from '@/components/scammer/ScammerReportForm'

export default function SubmitReportPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🚨 Report Scammer Account
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Help protect the DeSo community by reporting suspicious accounts
          </p>
          
          {/* Security Assurance */}
          <div className="max-w-2xl mx-auto bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl mr-2">🔒</span>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                Secure DeSo Identity Login
              </h3>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              We use the same trusted DeSo Identity system as all official DeSo apps. 
              <strong> We never access your private keys or seed phrase.</strong> Your security is our priority.
            </p>
          </div>
        </div>

        {/* Safety Reminder */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">
            � URGENT: If You're Currently Being Scammed
          </h3>
          <div className="text-red-700 dark:text-red-400 space-y-2">
            <p><strong>STOP IMMEDIATELY</strong> - Do not share any more information</p>
            <p><strong>NEVER GIVE:</strong> Seed phrases, private keys, passwords, or money</p>
            <p><strong>OFFICIAL DeSo TEAM:</strong> Will never ask for your wallet details</p>
            <p><strong>REPORT NOW:</strong> Fill out the form below to warn others</p>
          </div>
        </div>

        {/* How to Report Guide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
            📋 How to Submit an Effective Report
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">1. Identify the Scammer</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Find their username (with or without @)</li>
                <li>• Copy their public key if available</li>
                <li>• Take screenshots of their profile</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">2. Choose Category</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• 🔴 <strong>Critical:</strong> Asking for seed phrases</li>
                <li>• 🟠 <strong>High:</strong> Impersonating team members</li>
                <li>• 🟡 <strong>Medium:</strong> Suspicious external links</li>
                <li>• 🔵 <strong>Low:</strong> General suspicious behavior</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">3. Describe What Happened</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• How they contacted you</li>
                <li>• What they asked for</li>
                <li>• When it happened</li>
                <li>• Their exact messages if possible</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">4. Provide Evidence</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Screenshots of conversations</li>
                <li>• Links to suspicious posts</li>
                <li>• Malicious websites they shared</li>
                <li>• Related social media accounts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Report Form */}
        <ScammerReportForm 
          onReportSubmitted={(report) => {
            // Handle successful report submission
            console.log('Report submitted:', report)
          }}
        />

        {/* Additional Help */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📋 Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                What Information to Include:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Username or public key of suspicious account</li>
                <li>• Screenshots of suspicious messages</li>
                <li>• Links to problematic posts</li>
                <li>• Description of scam attempt</li>
                <li>• Timeline of events</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Investigation Process:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Report reviewed by human moderators</li>
                <li>• Evidence verified and cross-checked</li>
                <li>• DeSo nodes notified of findings</li>
                <li>• Community alert posted if verified</li>
                <li>• Appeals process available for false positives</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
