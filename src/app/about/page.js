'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/Button'
import styles from './page.module.css'

const ABOUT_SECTIONS = [
  {
    id: 'overview',
    title: '🛡️ System Overview',
    icon: '🌐',
    description: 'Learn how DeSo Scam Report protects the community through decentralized reporting'
  },
  {
    id: 'investigation',
    title: '🔍 Investigation Process',
    icon: '⚖️',
    description: 'Understand the human-driven investigation workflow and evidence collection'
  },
  {
    id: 'roles',
    title: '👥 Roles & Permissions',
    icon: '🔐',
    description: 'Explore the permission system and user roles in the platform'
  },
  {
    id: 'blockchain',
    title: '🌐 Blockchain Integration',
    icon: '⛓️',
    description: 'How DeSo blockchain ensures transparency and permanence'
  },
  {
    id: 'nodes',
    title: '🔗 Node Coordination',
    icon: '🤝',
    description: 'Decentralized node blocking decisions and community coordination'
  }
]

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState('overview')

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            📚 About DeSo Scam Report
          </h1>
          <p className={styles.subtitle}>
            Understanding the decentralized community protection system built on DeSo blockchain
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        {ABOUT_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`${styles.navButton} ${
              activeSection === section.id ? styles.navButtonActive : ''
            }`}
          >
            <span className={styles.navIcon}>{section.icon}</span>
            <div>
              <div className={styles.navTitle}>{section.title}</div>
              <div className={styles.navDescription}>{section.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeSection === 'overview' && (
          <div className={styles.section}>
            <h2>🛡️ System Overview</h2>
            
            <div className={styles.infoCard}>
              <h3>🎯 Mission</h3>
              <p>
                DeSo Scam Report is a <strong>community-driven, blockchain-transparent</strong> system for identifying 
                and warning about scammer accounts on the DeSo network. Our mission is to protect users while 
                respecting decentralized principles and node operator autonomy.
              </p>
            </div>

            <div className={styles.infoCard}>
              <h3>🌟 Key Principles</h3>
              <ul>
                <li><strong>🔍 Human Investigation Required</strong> - No automated blocking, all cases reviewed by humans</li>
                <li><strong>🌐 Blockchain Transparency</strong> - All reports stored permanently on DeSo for verification</li>
                <li><strong>🤝 Decentralized Decisions</strong> - Node operators make independent blocking choices</li>
                <li><strong>👥 Community-Driven</strong> - Reports come from real users experiencing scam attempts</li>
                <li><strong>📋 Evidence-Based</strong> - Decisions backed by verifiable evidence and investigation</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3>🔄 How It Works</h3>
              <div className={styles.workflowSteps}>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>1</span>
                  <div>
                    <strong>Community Reports</strong>
                    <p>Users submit scammer reports with evidence via DeSo blockchain posts</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>2</span>
                  <div>
                    <strong>Human Investigation</strong>
                    <p>Investigation team reviews evidence and conducts thorough analysis</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>3</span>
                  <div>
                    <strong>Community Alert</strong>
                    <p>Verified scammers get public alerts posted to DeSo blockchain</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>4</span>
                  <div>
                    <strong>Node Coordination</strong>
                    <p>Node operators independently decide on blocking based on evidence</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🔍</div>
                <div className={styles.statValue}>100%</div>
                <div className={styles.statLabel}>Human Reviewed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🌐</div>
                <div className={styles.statValue}>∞</div>
                <div className={styles.statLabel}>Blockchain Permanent</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🤝</div>
                <div className={styles.statValue}>0</div>
                <div className={styles.statLabel}>Central Authority</div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'investigation' && (
          <div className={styles.section}>
            <h2>🔍 Investigation Process</h2>
            
            <div className={styles.processFlow}>
              <div className={styles.processStep}>
                <div className={styles.processHeader}>
                  <span className={styles.processIcon}>📝</span>
                  <h3>Report Submission</h3>
                </div>
                <ul>
                  <li>User submits report with evidence via blockchain post</li>
                  <li>Automatic categorization (Critical, High, Medium, Low)</li>
                  <li>Unique report ID and permanent DeSo URL generated</li>
                  <li>Report enters investigation queue</li>
                </ul>
              </div>

              <div className={styles.processStep}>
                <div className={styles.processHeader}>
                  <span className={styles.processIcon}>🔬</span>
                  <h3>Evidence Collection</h3>
                </div>
                <ul>
                  <li>Investigation team reviews submitted evidence</li>
                  <li>Cross-reference with known scammer patterns</li>
                  <li>Analyze DeSo profile and post history</li>
                  <li>Check for additional community reports</li>
                  <li>Document findings in investigation notes</li>
                </ul>
              </div>

              <div className={styles.processStep}>
                <div className={styles.processHeader}>
                  <span className={styles.processIcon}>⚖️</span>
                  <h3>Decision Making</h3>
                </div>
                <ul>
                  <li><strong>Verified Scammer:</strong> Clear evidence of malicious activity</li>
                  <li><strong>False Positive:</strong> Account cleared of suspicion</li>
                  <li><strong>Insufficient Evidence:</strong> Case remains open for more information</li>
                  <li>All decisions documented with reasoning</li>
                </ul>
              </div>

              <div className={styles.processStep}>
                <div className={styles.processHeader}>
                  <span className={styles.processIcon}>📢</span>
                  <h3>Community Alert</h3>
                </div>
                <ul>
                  <li>Verified scammers get permanent warning post on DeSo</li>
                  <li>Node operators notified with blocking recommendation</li>
                  <li>Public dashboard updated with verified status</li>
                  <li>Complete audit trail preserved on blockchain</li>
                </ul>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>📋 Investigation Standards</h3>
              <ul>
                <li><strong>Multiple Evidence Sources:</strong> Require corroborating evidence from different sources</li>
                <li><strong>Pattern Recognition:</strong> Look for consistent scammer behavior patterns</li>
                <li><strong>Community Validation:</strong> Consider multiple reports and community feedback</li>
                <li><strong>Clear Documentation:</strong> All decisions must include detailed reasoning</li>
                <li><strong>Appeals Process:</strong> Falsely accused accounts can appeal decisions</li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'roles' && (
          <div className={styles.section}>
            <h2>👥 Roles & Permissions</h2>
            
            <div className={styles.rolesGrid}>
              <div className={styles.roleCard}>
                <div className={styles.roleHeader}>
                  <span className={styles.roleIcon}>👁️</span>
                  <h3>Anonymous</h3>
                </div>
                <div className={styles.rolePermissions}>
                  <strong>Permissions:</strong>
                  <ul>
                    <li>View public scammer reports</li>
                    <li>Browse threat intelligence dashboard</li>
                  </ul>
                </div>
              </div>

              <div className={styles.roleCard}>
                <div className={styles.roleHeader}>
                  <span className={styles.roleIcon}>👤</span>
                  <h3>User</h3>
                </div>
                <div className={styles.rolePermissions}>
                  <strong>Permissions:</strong>
                  <ul>
                    <li>Submit scammer reports</li>
                    <li>View all public reports</li>
                    <li>Add evidence to existing reports</li>
                  </ul>
                </div>
              </div>

              <div className={styles.roleCard}>
                <div className={styles.roleHeader}>
                  <span className={styles.roleIcon}>🔍</span>
                  <h3>Investigator</h3>
                </div>
                <div className={styles.rolePermissions}>
                  <strong>Permissions:</strong>
                  <ul>
                    <li>Access investigation dashboard</li>
                    <li>Update report status</li>
                    <li>Add investigation notes</li>
                    <li>Verify scammer accounts</li>
                    <li>Post community alerts</li>
                  </ul>
                </div>
              </div>

              <div className={styles.roleCard}>
                <div className={styles.roleHeader}>
                  <span className={styles.roleIcon}>🔗</span>
                  <h3>Node Operator</h3>
                </div>
                <div className={styles.rolePermissions}>
                  <strong>Permissions:</strong>
                  <ul>
                    <li>View node tracking dashboard</li>
                    <li>Update blocking status</li>
                    <li>Coordinate with other nodes</li>
                    <li>Access verified scammer alerts</li>
                  </ul>
                </div>
              </div>

              <div className={styles.roleCard}>
                <div className={styles.roleHeader}>
                  <span className={styles.roleIcon}>⚙️</span>
                  <h3>Admin</h3>
                </div>
                <div className={styles.rolePermissions}>
                  <strong>Permissions:</strong>
                  <ul>
                    <li>Full system access</li>
                    <li>User role management</li>
                    <li>System configuration</li>
                    <li>Audit log access</li>
                    <li>Investigation team oversight</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>🔐 Role Assignment</h3>
              <p>
                Roles are assigned based on DeSo public keys configured in the system. To become an 
                investigator or node operator, your DeSo public key must be added to the appropriate 
                permission list by system administrators.
              </p>
              <div className={styles.codeBlock}>
                <strong>Configuration Location:</strong> <code>src/lib/permissions.js</code>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'blockchain' && (
          <div className={styles.section}>
            <h2>🌐 Blockchain Integration</h2>
            
            <div className={styles.blockchainFeatures}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>📝</div>
                <div>
                  <h3>Permanent Storage</h3>
                  <p>
                    Every scammer report is stored as a DeSo blockchain post with the hashtag 
                    <code>#DeSoSCAMReport</code>. This ensures reports cannot be deleted, modified, 
                    or censored by any central authority.
                  </p>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>🔗</div>
                <div>
                  <h3>Fixed URLs</h3>
                  <p>
                    Each report gets a permanent URL on DeSo: 
                    <code>https://diamondapp.com/posts/[PostHash]</code>
                    These URLs never change and provide direct access to the original report.
                  </p>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>🔍</div>
                <div>
                  <h3>Public Verification</h3>
                  <p>
                    Anyone can verify reports by searching the DeSo blockchain for the 
                    <code>#DeSoSCAMReport</code> hashtag. The complete investigation history 
                    is transparent and auditable.
                  </p>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>📊</div>
                <div>
                  <h3>Structured Data</h3>
                  <p>
                    Reports contain both human-readable content and structured JSON data 
                    embedded in the post body for programmatic parsing and analysis.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>🔄 API Integration</h3>
              <p>The system uses DeSo's official API endpoints:</p>
              <ul>
                <li><strong>submit-post:</strong> Store new scammer reports on blockchain</li>
                <li><strong>get-posts-stateless:</strong> Retrieve reports by hashtag search</li>
                <li><strong>get-single-post:</strong> Fetch specific report details</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3>🌐 Decentralized Benefits</h3>
              <ul>
                <li><strong>No Single Point of Failure:</strong> Data distributed across DeSo network</li>
                <li><strong>Censorship Resistant:</strong> Cannot be taken down by authorities</li>
                <li><strong>Global Access:</strong> Available anywhere DeSo nodes operate</li>
                <li><strong>Immutable Records:</strong> Historical data preserved forever</li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'nodes' && (
          <div className={styles.section}>
            <h2>🔗 Node Coordination</h2>
            
            <div className={styles.infoCard}>
              <h3>🤝 Decentralized Approach</h3>
              <p>
                DeSo Scam Report respects the decentralized nature of DeSo by providing 
                <strong> recommendations, not mandates</strong>. Each node operator makes 
                independent decisions about blocking accounts based on the evidence provided.
              </p>
            </div>

            <div className={styles.coordinationFlow}>
              <div className={styles.flowStep}>
                <span className={styles.flowIcon}>🚨</span>
                <div>
                  <h3>Scammer Verified</h3>
                  <p>Investigation team verifies a scammer with evidence</p>
                </div>
              </div>
              <div className={styles.flowArrow}>→</div>
              <div className={styles.flowStep}>
                <span className={styles.flowIcon}>📢</span>
                <div>
                  <h3>Node Notification</h3>
                  <p>All registered node operators receive blocking recommendation</p>
                </div>
              </div>
              <div className={styles.flowArrow}>→</div>
              <div className={styles.flowStep}>
                <span className={styles.flowIcon}>⚖️</span>
                <div>
                  <h3>Independent Decision</h3>
                  <p>Each node operator decides whether to block based on their criteria</p>
                </div>
              </div>
              <div className={styles.flowArrow}>→</div>
              <div className={styles.flowStep}>
                <span className={styles.flowIcon}>📊</span>
                <div>
                  <h3>Status Tracking</h3>
                  <p>System tracks which nodes have blocked each verified scammer</p>
                </div>
              </div>
            </div>

            <div className={styles.nodeGrid}>
              <div className={styles.nodeCard}>
                <h3>🌐 Major Nodes</h3>
                <ul>
                  <li>node.deso.org</li>
                  <li>deso.run</li>
                  <li>desocialworld.com</li>
                  <li>safetynet.social</li>
                </ul>
              </div>
              <div className={styles.nodeCard}>
                <h3>📊 Tracking Metrics</h3>
                <ul>
                  <li>Blocking decisions per node</li>
                  <li>Response time to alerts</li>
                  <li>Community protection coverage</li>
                  <li>Coordination effectiveness</li>
                </ul>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>🎯 Node Operator Benefits</h3>
              <ul>
                <li><strong>Evidence-Based Decisions:</strong> Receive thoroughly investigated cases</li>
                <li><strong>Community Support:</strong> Coordinate with other responsible operators</li>
                <li><strong>Transparency:</strong> Public tracking of blocking decisions</li>
                <li><strong>Autonomy Respected:</strong> No pressure to block, just information provided</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <Link href="/reports">
          <Button variant="primary" size="large">
            🔍 View Reports
          </Button>
        </Link>
        <Link href="/reports/submit">
          <Button variant="outline" size="large">
            🚨 Submit Report
          </Button>
        </Link>
      </div>
    </div>
  )
}
