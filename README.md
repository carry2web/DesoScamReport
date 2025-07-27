# DeSo Scam Report - Community Scammer Reporting System

A **decentralized scammer reporting and investigation platform** built for the DeSo ecosystem. This application empowers the community to identify and report suspicious accounts while maintaining a human-driven investigation process that respects node operator autonomy.

�️ **Built on**: [deso-starter-nextjs-plus](https://github.com/brootle/deso-starter-nextjs-plus) framework

## 🚨 **Core Features**

* 📝 **Community Reporting**: Easy interface for reporting suspicious accounts
* 🔍 **Human Investigation**: Moderator dashboard requiring human approval for all actions
* 🌐 **Node Blocking Tracker**: Monitor which DeSo nodes have blocked reported accounts
* 🏛️ **Decentralized Approach**: Respect individual node operator decisions
* 📊 **Evidence Collection**: Automated capture of profiles, posts, and suspicious activity
* 🔒 **Investigation Workflow**: Multi-step verification before any community alerts
* 📈 **Transparency**: Public audit trail of all investigations and decisions
* ⚡ **Real-time Updates**: Live tracking of report status and node responses

---

## 🎯 **How It Works**

### **1. Community Detection & Reporting**
- Users spot suspicious accounts (fake team members, seed phrase thieves, etc.)
- Submit reports through intuitive web interface
- Automatic evidence collection (screenshots, profile data, post history)
- Smart categorization by threat level (Critical, High, Medium, Low)

### **2. Human Investigation Process**
- **No Automated Actions**: All reports require human moderator review
- Evidence presentation dashboard for thorough investigation
- Multi-step verification process before any community alerts
- Appeal system for false positive protection

### **3. Decentralized Node Response**
- Track which DeSo nodes choose to block reported accounts
- Respect node operator autonomy - no forced blocking
- Real-time monitoring of node blocking status
- Transparency about node-level moderation decisions

### **4. Community Protection**
- Public alerts only after human verification
- Educational content about scammer tactics
- Community voting on report validity
- Protection for legitimate users through appeals process

---

## 🔥 **Technical Features**

* 🔐 **DeSo Auth**: Secure login using DeSo Identity service
* � **Report Submission**: Intuitive interface for community scammer reporting
* � **Investigation Dashboard**: Comprehensive moderator tools for report review
* 🌐 **Node Monitoring**: Real-time tracking of which nodes block reported accounts
* � **Evidence Archive**: Automated collection and storage of suspicious activity
* 🛡️ **Human Verification**: Mandatory human approval before any automated actions
* 📈 **Audit Trail**: Complete transparency of investigation processes
* � **Community Alerts**: Public warnings about verified scammer accounts
* 👥 **Multi-Moderator**: Collaborative investigation with multiple reviewers
* ⚖️ **Appeals System**: Protection mechanism for falsely reported accounts
* 🎨 **Component Library**: Built on proven DeSo starter components
* 🌐 **Responsive UI**: Full mobile and desktop compatibility
* 📦 **Floating UI**: Precise positioning for investigation tooltips and modals

### 🧠 **State Management with React Query**

This starter uses [**TanStack React Query**](https://tanstack.com/query/latest) for efficient, declarative data fetching and caching with enterprise-grade reliability.

✅ **Core Benefits:**
* Smart caching and deduplication of network requests
* Declarative `useQuery` / `useMutation` hooks  
* Built-in error/loading states
* React Query Devtools support (optional)

✅ **Network Resilience Features:**
* **Wake-from-sleep protection** - No more "failed to fetch" errors when laptop wakes up
* **Smart retry logic** - Won't retry when offline or for client errors
* **Progressive retry delays** - Intelligent backoff (1s, 2s, 4s, 8s, max 15s)
* **Offline awareness** - Graceful handling of network transitions
* **Centralized configuration** - Consistent behavior across all pages

### 💬 **Advanced Comment System**

The commenting system features sophisticated state management and user experience optimizations:

✅ **Real-time Features:**
* **Optimistic updates** - Comments appear instantly while syncing to blockchain
* **Local/remote merging** - Seamlessly combines user's new comments with server data
* **Infinite pagination** - Load more comments on demand
* **Smart deduplication** - Prevents duplicate comments across page loads

✅ **User Experience:**
* **Inline replies** - Reply directly from any post without page navigation
* **Expand/collapse** - Show/hide comment threads with state persistence
* **Comment promotion** - Local comments become permanent after server sync
* **Visual feedback** - Clear loading states and error handling

Usage examples include:
- Fetching user profiles by public key or username
- Fetching posts and comments with infinite scroll
- Creating replies with optimistic UI updates
- Managing complex UI state like comment visibility
- Handling username → public key resolution for notifications and feeds

Query keys are centralized in `/queries/queryKeys.js`, UI keys in `/queries/uiKeys.js`, and network configuration in `/queries/queryClientConfig.js` for consistency and maintainability.

> 🔧 Profile editing and mutations use `invalidateQueries()` for cache synchronization and support optimistic updates.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/brootle/deso-starter-nextjs-plus.git
cd deso-starter-nextjs-plus
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` to view the app.

---

## 🧪 Storybook

Run Storybook to browse UI components in isolation:

```bash
npm run storybook
```

Opens at: `http://localhost:6006`

---

## 🛠 Tech Stack

* **Framework**: [Next.js App Router](https://nextjs.org/docs/app) (v15.2.4)
* **UI Logic**: React 19 + CSS Modules
* **Data Fetching & Caching**: [React Query v5](https://tanstack.com/query/latest) with network-aware configuration
* **State Management**: React Context (Auth, User) + React Query for UI state
* **Floating Dropdowns**: [`@floating-ui/react`](https://floating-ui.com/)
* **DeSo Identity**: Authentication via DeSo Identity service
* **Theming**: CSS variable-based dark/light support

---

## 🧩 Folder Structure

```
/api               → DeSo API abstraction hooks and handlers
/app               → Next.js App Router structure (routes, pages, layout)
/assets            → Static assets like icons and illustrations
/components        → Reusable UI components (Button, Select, Input, etc.)
/config            → Environment-independent constants (e.g. API base URLs)
/context           → Global state via React Context API (Auth, User, QueryProvider)
/hooks             → Custom React hooks (e.g. useClickOutside, useToast)
/layouts           → Shared layout components (MainLayout, etc.)
/queries           → React Query configuration and key definitions
  ├── queryKeys.js         → API query keys
  ├── uiKeys.js           → UI state keys  
  ├── queryClientConfig.js → Network-aware configuration
  └── index.js            → Clean exports
/styles            → Theme system and shared styles (CSS Modules + variables)
/utils             → Helper functions (auth, DeSo profiles, tokens)
```

---

## 🔧 Query Configuration

The app features a sophisticated React Query setup optimized for reliability:

### **Network-Aware Retry Logic**
```javascript
// Won't retry when offline or for client errors (4xx)
// Uses progressive delays: 1s → 2s → 4s → 8s → max 15s
const networkAwareRetry = (failureCount, error) => {
  if (!navigator.onLine) return false;
  if (error?.status >= 400 && error?.status < 500) return false;
  return failureCount < 2;
};
```

### **Wake-from-Sleep Protection**
```javascript
// Prevents "failed to fetch" errors when laptop wakes up
refetchOnReconnect: false,  // Key setting
refetchOnWindowFocus: false,
```

### **Smart Cache Management**
- **API queries**: 2-minute stale time, 10-minute cache time
- **Search queries**: 30-second stale time for fresh results  
- **Comments**: Infinite stale time for persistent threading
- **UI state**: Cached for consistent user experience

---

## 📜 License

This project is open-sourced under the [MIT License](LICENSE).

---

## 🤝 Contributing

Pull requests are welcome! Open issues or suggestions any time.

---

## 🌍 Credits

Built using the [DeSo Protocol](https://github.com/deso-protocol) — the decentralized social blockchain.

---

## 🪲 Known Issues and Bug Reports

During development, several minor issues were identified with the DeSo backend API:

### Open Issues

- **Unresolved:** See [this bug report](https://github.com/deso-protocol/backend/issues/736) for details on an issue that remains open.

### Resolved Issues

- **Fixed:** A previously reported bug has been addressed. Refer to [this issue](https://github.com/deso-protocol/backend/issues/725) for more information.

If you encounter additional issues, please report them via the appropriate GitHub repository.
