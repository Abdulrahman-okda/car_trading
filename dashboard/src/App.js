import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/admin"
          element={
            isAuthenticated ? <AdminPanel /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
