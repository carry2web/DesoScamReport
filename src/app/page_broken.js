"use client";

import Link from 'next/link'
import { Button } from '@/components/Button'

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'relative',
        zIndex: '10',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '120px 24px 48px'
      }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '128px',
              height: '128px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 25px 50px rgba(239, 68, 68, 0.5)'
            }}>
              <span style={{ fontSize: '4rem' }}>🛡️</span>
            </div>
          </div>
          
          <h1 style={{
            fontSize: '3.75rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '24px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #ef4444, #fb923c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              DeSo Scam Report
            </span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#cbd5e1',
            marginBottom: '32px',
            maxWidth: '768px',
            margin: '0 auto 32px',
            lineHeight: '1.75'
          }}>
            <span style={{ color: '#ef4444', fontWeight: '600' }}>Community Shield Protocol</span> – 
            Protecting the DeSo ecosystem from scammers through human-verified investigations.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Link href="/reports/submit">
              <Button size="large" variant="primary">
                🛡️ Report Threat
              </Button>
            </Link>
            <Link href="/reports">
              <Button size="large" variant="secondary">
                📋 View Reports
              </Button>
            </Link>
          </div>
        </div>

        {/* Security Stats Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '80px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(251, 146, 60, 0.1))',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚨</div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ef4444, #fb923c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '8px'
            }}>
              247
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '500' }}>
              Threats Identified
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(251, 146, 60, 0.1))',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚖️</div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ef4444, #fb923c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '8px'
            }}>
              12
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '500' }}>
              Under Investigation
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(251, 146, 60, 0.1))',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌐</div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ef4444, #fb923c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '8px'
            }}>
              15
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '500' }}>
              Active Nodes
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(251, 146, 60, 0.1))',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👥</div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ef4444, #fb923c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '8px'
            }}>
              1,847
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '500' }}>
              Community Reports
            </div>
          </div>
        </div>

        {/* Emergency Response Center */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(251, 146, 60, 0.2))',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '24px',
          padding: '48px',
          textAlign: 'center',
          marginBottom: '80px'
        }}>
          <div style={{
            width: '96px',
            height: '96px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            boxShadow: '0 25px 50px rgba(239, 68, 68, 0.5)'
          }}>
            <span style={{ fontSize: '3rem' }}>🚨</span>
          </div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '24px'
          }}>
            Emergency Response Center
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#fecaca',
            marginBottom: '32px',
            opacity: '0.9'
          }}>
            Encountered an active scam? Report immediately to protect the community.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Link href="/reports/submit">
              <Button size="large" variant="primary">
                🛡️ REPORT THREAT NOW
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: '#9ca3af',
          borderTop: '1px solid rgba(107, 114, 128, 0.5)',
          paddingTop: '48px'
        }}>
          <p style={{ marginBottom: '16px' }}>
            Built on the DeSo ecosystem for community protection
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            Community-driven • Human-verified • Decentralized approach
          </p>
        </div>
      </div>
    </div>
  )
}
              <Button size="lg" variant="outline" className="border-2 border-gray-400/50 text-gray-300 hover:bg-gray-800/50 hover:border-gray-300 px-8 py-3 rounded-lg">
                🔍 Investigation Center
              </Button>
            </Link>
          </div>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">247</div>
            <div className="text-gray-400 text-sm uppercase tracking-wide">Threats Blocked</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">98.7%</div>
            <div className="text-gray-400 text-sm uppercase tracking-wide">Detection Rate</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">5,240</div>
            <div className="text-gray-400 text-sm uppercase tracking-wide">Users Protected</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">12</div>
            <div className="text-gray-400 text-sm uppercase tracking-wide">Nodes Secured</div>
          </div>
        </div>

        {/* Protection Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Community Shield</h3>
            <p className="text-gray-400 leading-relaxed">
              Crowd-sourced threat detection with community-driven reporting and verification systems.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Human Verification</h3>
            <p className="text-gray-400 leading-relaxed">
              Expert investigators review all reports before taking action to prevent false positives.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Decentralized Defense</h3>
            <p className="text-gray-400 leading-relaxed">
              Node operators maintain autonomy while sharing threat intelligence across the network.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Evidence Vault</h3>
            <p className="text-gray-400 leading-relaxed">
              Immutable on-chain storage of evidence and investigation records for transparency.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">⚖️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Appeals Court</h3>
            <p className="text-gray-400 leading-relaxed">
              Fair review process for legitimate users who may have been incorrectly flagged.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🚨</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Threat Alerts</h3>
            <p className="text-gray-400 leading-relaxed">
              Real-time community warnings about verified threats and active scammer campaigns.
            </p>
          </div>
        </div>

        {/* Security Protocol */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50 mb-20">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Security Protocol
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📝</span>
                </div>
                <div className="absolute -inset-2 bg-red-600/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">1. Threat Detection</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Community identifies suspicious activity and submits detailed threat reports
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-yellow-600/30 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🔍</span>
                </div>
                <div className="absolute -inset-2 bg-yellow-600/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">2. Investigation</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Security experts analyze evidence and verify the legitimacy of threats
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📢</span>
                </div>
                <div className="absolute -inset-2 bg-blue-600/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">3. Network Alert</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Verified threats are broadcast to all nodes for independent action
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-600/30 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🛡️</span>
                </div>
                <div className="absolute -inset-2 bg-green-600/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">4. Protection</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Community is protected through coordinated threat mitigation
              </p>
            </div>
          </div>
        </div>

        {/* Threat Intelligence */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50 mb-20">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Threat Classification System
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-xl p-8 border border-red-600/30">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                <h3 className="text-xl font-bold text-red-300">🔴 CRITICAL THREATS</h3>
              </div>
              <ul className="text-red-200 space-y-2 text-sm">
                <li>• <strong>Seed phrase theft attempts</strong></li>
                <li>• <strong>Wallet recovery scams</strong></li>
                <li>• <strong>Impersonating official support</strong></li>
                <li>• <strong>Urgent security verification fraud</strong></li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 rounded-xl p-8 border border-orange-600/30">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
                <h3 className="text-xl font-bold text-orange-300">🟠 HIGH PRIORITY</h3>
              </div>
              <ul className="text-orange-200 space-y-2 text-sm">
                <li>• <strong>Team member impersonation</strong></li>
                <li>• <strong>Unauthorized logo usage</strong></li>
                <li>• <strong>False authority claims</strong></li>
                <li>• <strong>Fake verification badges</strong></li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-xl p-8 border border-yellow-600/30">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
                <h3 className="text-xl font-bold text-yellow-300">🟡 MEDIUM RISK</h3>
              </div>
              <ul className="text-yellow-200 space-y-2 text-sm">
                <li>• <strong>External platform luring</strong></li>
                <li>• <strong>Fake investment groups</strong></li>
                <li>• <strong>Malicious website links</strong></li>
                <li>• <strong>Social engineering attempts</strong></li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl p-8 border border-blue-600/30">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                <h3 className="text-xl font-bold text-blue-300">🔵 WATCHLIST</h3>
              </div>
              <ul className="text-blue-200 space-y-2 text-sm">
                <li>• <strong>Suspicious behavior patterns</strong></li>
                <li>• <strong>Mass messaging campaigns</strong></li>
                <li>• <strong>Potential threat preparation</strong></li>
                <li>• <strong>Profile anomalies</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Response Center */}
        <div className="bg-gradient-to-r from-red-900/40 via-red-800/40 to-orange-900/40 backdrop-blur-sm rounded-2xl p-12 border border-red-600/50 text-center mb-20">
          <div className="max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-600/50">
              <span className="text-4xl">🚨</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Emergency Response Center
            </h2>
            <p className="text-xl text-red-200 mb-8 opacity-90">
              Encountered an active scam? Report immediately to protect the community from ongoing threats.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/reports/submit">
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 font-bold px-10 py-4 rounded-xl shadow-lg">
                  🛡️ REPORT THREAT NOW
                </Button>
              </Link>
              <Link href="/nodes">
                <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 px-10 py-4 rounded-xl">
                  🌐 Network Status
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 border-t border-gray-700/50 pt-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center opacity-60">
              <span className="text-2xl">🛡️</span>
            </div>
          </div>
          <p className="mb-4 text-lg">
            Built on the <a href="https://github.com/brootle/deso-starter-nextjs-plus" className="text-red-400 hover:text-red-300 transition-colors">deso-starter-nextjs-plus</a> framework
          </p>
          <p className="text-sm opacity-75">
            Community-driven • Human-verified • Decentralized protection
          </p>
          <div className="mt-8 text-xs opacity-50">
            <p>Protecting the DeSo ecosystem, one report at a time.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Community Reporting
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Easy interface for community members to report suspicious accounts and scam attempts.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Human Investigation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              All reports require human moderator review before any automated actions are taken.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Decentralized Approach
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Respect node operator autonomy - each DeSo node decides independently on blocking accounts.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Evidence Collection
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Automated capture and archival of suspicious posts, profiles, and user reports.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">⚖️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Appeals System
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Protection mechanism for legitimate users who may be falsely reported.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">🚨</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Community Alerts
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Public warnings about verified scammer accounts to protect the community.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            🎯 How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-red-100 dark:bg-red-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">1. Report</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Community spots suspicious account and submits detailed report
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">2. Investigate</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Human moderators review evidence and verify threat legitimacy
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📢</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">3. Notify</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DeSo nodes are informed, each decides independently on blocking
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">4. Protect</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Community alert posted to warn users about verified scammers
              </p>
            </div>
          </div>
        </div>

        {/* Threat Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            ⚠️ Common Scam Types
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-900/10">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">
                🔴 Critical - Seed Phrase Theft
              </h3>
              <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                <li>• Requesting seed phrases or private keys</li>
                <li>• Fake wallet recovery assistance</li>
                <li>• Impersonating official support</li>
                <li>• Urgent "security verification" messages</li>
              </ul>
            </div>

            <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-6 bg-orange-50 dark:bg-orange-900/10">
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-3">
                🟠 High - Team Impersonation
              </h3>
              <ul className="text-sm text-orange-700 dark:text-orange-400 space-y-1">
                <li>• Fake DeSo team member accounts</li>
                <li>• Unauthorized use of official logos</li>
                <li>• False authority claims</li>
                <li>• Misleading verification badges</li>
              </ul>
            </div>

            <div className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 bg-yellow-50 dark:bg-yellow-900/10">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
                🟡 Medium - External Luring
              </h3>
              <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                <li>• Suspicious Telegram/Discord invites</li>
                <li>• Fake investment groups</li>
                <li>• Malicious website links</li>
                <li>• Social engineering attempts</li>
              </ul>
            </div>

            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/10">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
                🔵 Low - General Suspicious
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Unusual behavior patterns</li>
                <li>• Mass messaging campaigns</li>
                <li>• Potential scam preparation</li>
                <li>• Suspicious profile information</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Help Protect the DeSo Community
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Report suspicious accounts and help keep our decentralized social network safe for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reports/submit">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                🚨 Report a Scammer
              </Button>
            </Link>
            <Link href="/nodes">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                🌐 View Node Status
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            Built on the <a href="https://github.com/brootle/deso-starter-nextjs-plus" className="text-blue-600 hover:text-blue-800">deso-starter-nextjs-plus</a> framework
          </p>
          <p className="text-sm">
            Community-driven • Human-verified • Decentralized approach
          </p>
        </div>
      </div>
    </div>
  )
}

