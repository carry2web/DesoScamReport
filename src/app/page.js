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
              DeSo SCAM Report
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
          
          {/* Security Trust Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 24px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '24px',
            marginBottom: '32px',
            maxWidth: '480px',
            margin: '0 auto 32px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🔒</span>
            <span style={{ 
              color: '#22c55e', 
              fontSize: '0.875rem', 
              fontWeight: '500' 
            }}>
              Secure DeSo Identity • No Private Keys Required
            </span>
          </div>
          
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

        {/* Security & Trust Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          borderRadius: '24px',
          padding: '48px',
          textAlign: 'center',
          marginBottom: '80px'
        }}>
          <div style={{
            width: '96px',
            height: '96px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            boxShadow: '0 25px 50px rgba(34, 197, 94, 0.3)'
          }}>
            <span style={{ fontSize: '3rem' }}>🔒</span>
          </div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '24px'
          }}>
            Your Security is Our Priority
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#a7f3d0',
            marginBottom: '32px',
            opacity: '0.9'
          }}>
            We use the same trusted DeSo Identity system as all official DeSo applications.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '32px',
            textAlign: 'left'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🛡️</div>
              <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>
                No Private Keys
              </h3>
              <p style={{ color: '#a7f3d0', fontSize: '0.875rem' }}>
                We never access, store, or request your private keys or seed phrase. Login is handled entirely by DeSo Identity.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔐</div>
              <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>
                Standard DeSo Auth
              </h3>
              <p style={{ color: '#a7f3d0', fontSize: '0.875rem' }}>
                Same secure authentication used by Diamond, Bitclout, and all legitimate DeSo applications.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>👤</div>
              <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>
                Identity Verification Only
              </h3>
              <p style={{ color: '#a7f3d0', fontSize: '0.875rem' }}>
                We only verify your DeSo identity to prevent false reports. No financial access or wallet control.
              </p>
            </div>
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
