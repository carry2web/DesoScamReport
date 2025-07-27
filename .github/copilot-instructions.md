<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# DeSo Scam Report - Copilot Instructions

## Project Overview
This is a **DeSo Scammer Reporting System** built on the deso-starter-nextjs-plus framework. The application provides community-driven scammer detection and reporting with human investigation workflows.

## Key Features to Implement
- **Community Reporting Interface**: Allow users to report suspicious accounts
- **Human Investigation Dashboard**: Moderator interface for reviewing reports
- **Node Blocking Tracker**: Monitor which DeSo nodes have blocked reported accounts
- **Decentralized Approach**: Respect individual node operator autonomy
- **Evidence Collection**: Screenshots, profile data, and post archival
- **Investigation Workflow**: Require human approval before taking action

## Architecture Guidelines

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **DeSo Integration**: deso-protocol package (v3.3.8)
- **State Management**: TanStack React Query for data fetching
- **Styling**: CSS modules with theme tokens
- **Authentication**: DeSo Identity service
- **UI Components**: Custom component library included in starter

### Key Components to Build
1. **ReportForm**: Interface for submitting scammer reports
2. **InvestigationDashboard**: Moderator panel for reviewing reports
3. **NodeBlockingTracker**: Display which nodes have blocked accounts
4. **EvidenceViewer**: Display collected evidence (screenshots, posts)
5. **ReportHistory**: Track investigation progress and decisions
6. **CommunityAlerts**: Public warnings about confirmed scammers

### Data Flow
1. **Community Report** → **Evidence Collection** → **Human Investigation** → **Node Notification** → **Community Alert**
2. Always require human verification before any automated actions
3. Track which nodes choose to block reported accounts (decentralized approach)
4. Maintain audit trail of all investigations and decisions

### DeSo Integration Patterns
- Use existing auth system from starter framework
- Leverage DeSo protocol for posting alerts and collecting evidence
- Integrate with DeSo node APIs to check blocking status
- Follow DeSo best practices for profile and post handling

### UI/UX Guidelines
- Maintain consistency with DeSo ecosystem design patterns
- Prioritize clear investigation workflows for moderators
- Ensure transparent community reporting process
- Responsive design for both desktop and mobile usage

### Security Considerations
- Validate all user inputs for report submissions
- Implement rate limiting for report submissions
- Secure evidence storage and access controls
- Audit trail for all moderator actions
- Privacy protection for legitimate users

## File Structure Conventions
- Place scammer-related components in `src/components/scammer/`
- Investigation logic in `src/lib/investigation/`
- Report management in `src/app/reports/`
- Moderator dashboard in `src/app/admin/`
- Node tracking utilities in `src/lib/nodes/`

## Development Notes
- Follow the existing patterns from deso-starter-nextjs-plus
- Use React Query for all DeSo API interactions
- Implement optimistic updates where appropriate
- Maintain network resilience features from the starter
- Test with multiple DeSo nodes for decentralized compatibility
