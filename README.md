# DeSo Frontend Starter

A modern frontend web application built using **Next.js App Router** and designed to integrate with the [**DeSo Protocol**](https://github.com/deso-protocol) — a decentralized social blockchain platform.

📦 **Repository**: [brootle/deso-starter-nextjs-plus](https://github.com/brootle/deso-starter-nextjs-plus)

This starter includes:

* DeSo authentication via Identity service
* Profile selector and alternate identity switching
* Clean UI component system (Buttons, Inputs, Dropdowns, Select, etc.)
* Support for Floating UI dropdowns and portals
* Dark/light theming via CSS variables
* Storybook for component exploration

---

## 🔥 Features

* 🔐 **DeSo Auth**: Log in using DeSo Identity
* 👥 **Alt Profile Switcher**: Switch between multiple public keys
* 🔎 **Search Profiles**: Find users by public key or username
* 📝 **Post Support**: Read and create posts on the DeSo blockchain
* 👻 **Profileless Accounts**: Fully functional even without a user profile
* 🎨 **Component Library**: Custom Select, MenuItem, Avatar, and Dropdown components
* 🌐 **Responsive UI**: Built with modular CSS and theme tokens
* 📦 **Floating UI**: Precise positioning via `@floating-ui/react`
* 🧱 **Scalable Structure**: Clean folder structure for extending easily

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

* **Framework**: [Next.js App Router](https://nextjs.org/docs/app)
* **UI Logic**: React + CSS Modules
* **Floating Dropdowns**: [`@floating-ui/react`](https://floating-ui.com/)
* **DeSo Identity**: Authentication via identity service + public key
* **Context**: Authentication and User state management
* **Theming**: CSS variable-based dark/light support

---

## 🧩 Folder Structure

```
/api               → DeSo API abstraction hooks and handlers
/app               → Next.js App Router structure (routes, pages, layout)
/assets            → Static assets like icons and illustrations
/components        → Reusable UI components (Button, Select, Input, etc.)
/config            → Environment-independent constants (e.g. API base URLs)
/context           → Global state via React Context API (Auth, User)
/hooks             → Custom React hooks (e.g. useClickOutside)
/layouts           → Shared layout components (MainLayout, etc.)
/styles            → Theme system and shared styles (CSS Modules + variables)
/utils             → Helper functions (auth, DeSo profiles, tokens)
```

---

## 📜 License

This project is open-sourced under the [MIT License](LICENSE).

---

## 🤝 Contributing

Pull requests are welcome! Open issues or suggestions any time.

---

## 🌍 Credits

Built using the [DeSo Protocol](https://github.com/deso-protocol) — the decentralized social blockchain.
