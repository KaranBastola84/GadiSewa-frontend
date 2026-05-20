import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CustomerProvider } from "./context/CustomerContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <CustomerProvider>
          <AppRoutes />
        </CustomerProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;