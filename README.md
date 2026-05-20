# GadiSewa - Vehicle Service Management Frontend

GadiSewa is a comprehensive web-based platform for vehicle service, repair, and parts management. This repository contains the frontend React application, built to serve Admins, Staff, and Customers seamlessly.

## 🚀 Tech Stack

- **React 19** - Modern UI development
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS v4** - Utility-first styling framework
- **React Router DOM** - Application routing and navigation
- **Axios** - Promise-based HTTP client for API requests
- **Lucide React** - Beautiful and consistent iconography
- **Recharts** - Composable charting library for analytics

## 👥 Features by Role

### 👨‍💼 Admin Panel
- **Dashboard Overview**: Get high-level insights into business performance.
- **User Management**: Manage staff and customer accounts.
- **Inventory & Parts**: Track stock levels, manage parts, and suppliers/vendors.
- **Financial & Inventory Reports**: Generate and view detailed reports.
- **Purchase Invoices**: Track expenses and vendor purchases.
- **Notifications**: System-wide alerts and updates.

### 🛠️ Staff Portal
- **Appointments Management**: Schedule and track service appointments.
- **Customer Management**: Register new customers, search, and view detailed customer profiles.
- **Invoicing & Sales**: Create sales invoices, manage credit payments, and run Sales POS.
- **Part Requests**: Manage inventory requests for specific services.
- **Reports**: Generate customer and service reports.

### 👤 Customer Dashboard
- **My Vehicles**: Manage vehicle profiles and history.
- **Appointments**: Request new services and track ongoing appointments.
- **Service History & Invoices**: View past services and detailed invoices.
- **Reviews**: Leave feedback on completed services.
- **Notifications**: Stay updated on service status and promotions.
- **Profile**: Manage personal information and settings.

### 🔒 Authentication
Secure role-based access control including Login, Registration, Password Recovery, and Email Verification.

## 📦 Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd GadiSewa-Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and configure your backend API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
   *(Ensure the variable name matches what is used in `src/config` or `src/services`)*

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Preview production build**:
   ```bash
   npm run preview
   ```

## 📂 Project Structure

```text
src/
├── components/   # Reusable UI components
├── config/       # Configuration files
├── constants/    # App-wide constants
├── context/      # React Context providers (Auth, Theme, etc.)
├── data/         # Mock data or static data
├── hooks/        # Custom React hooks
├── pages/        # Route components (Admin, Staff, Customer, Auth)
├── routes/       # Route definitions and access control
├── services/     # API service calls (Axios instances)
├── utils/        # Utility and helper functions
└── validation/   # Form validation schemas
```

## 📜 Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Bundles the app for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Previews the production build locally.

---
*Built with ❤️ for better vehicle service management.*