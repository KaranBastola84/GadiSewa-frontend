import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CustomerProvider } from "./context/CustomerContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <CustomerProvider>
        <AppRoutes />
      </CustomerProvider>
    </Router>
  );
}

export default App;
