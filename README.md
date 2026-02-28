# Nexus OS - Enterprise Asset Management Command Center

Nexus OS is a high-performance, dark-mode B2B asset management platform engineered for IT Operations and Office Managers. Built with the MERN stack (MongoDB, Express, React, Node.js), it replaces slow, clunky inventory spreadsheets with a lightning-fast, keyboard-first Command Palette experience (Ctrl+K).

## 🚀 Key Features

*   **Premium Dark UI:** Custom, glassmorphic dark mode engineered with CSS variables, featuring sub-pixel gradients, 'Outfit'/'JetBrains Mono' native fonts, and an embedded grain texture for a hardware-like feel.
*   **Command Palette (Ctrl+K):** A global spotlight search interface powered by `lucide-react`. Instantly navigate routing, execute actions, or download reports using just your keyboard.
*   **Real-Time Data Sync:** Create, Edit, and Delete assets securely. Global Event Listeners (`assets-updated`) ensure that data tables and dashboard charts synchronize flawlessly without ever reloading the browser.
*   **Audit Trail Engine:** Full backend and frontend activity logging tracks exact timestamps and actions (`CREATE`, `UPDATE`, `DELETE`), rendering to a dashboard timeline.
*   **One-Click CSV Export:** A custom frontend utility script instantly compiles current state Redux data into a clean, downloaded Excel `.csv` file.
*   **Granular Table Filtering:** Filter 1000s of hardware assets dynamically by In-Stock/Out-of-Stock lifecycle statuses or by fuzzy searching strings.
*   **Framer Motion Animations:** Smooth 60fps row staggering on the main data tables and elegant sliding toast notifications replacing native alerts.
*   **100% Responsive Blueprint:** The fixed sidebar converts seamlessly into an interactive hamburger overlay on mobile and tablets.

## 🛠 Tech Stack

*   **Frontend:** React (Vite), Redux Toolkit, React Router DOM, Framer Motion, Chart.js / react-chartjs-2, React Dropzone.
*   **Backend:** Node.js, Express, MongoDB, Mongoose, JWT Auth, Multer (Local Image Storage).
*   **Design:** Custom Vanilla CSS Design System, Lucide-React Iconography.

## 📦 Local Installation

To run Nexus OS on your local machine, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Poojan2107/Product-Nexus.git
   cd Product-Nexus
   ```

2. **Set up the Database**
   Ensure you have MongoDB running locally or have a MongoDB URI ready.
   Create a `.env` file in the `/backend` folder.

3. **Install Dependencies and Run**
   This project is configured to run both the frontend and backend concurrently via a single command.
   ```bash
   npm i
   npm start
   ```

4. **Access the App**
   The database runs on `http://localhost:5000`
   The frontend runs on `http://localhost:5173`

---

*Designed and Developed by Poojan*
