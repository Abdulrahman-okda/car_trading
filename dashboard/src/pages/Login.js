import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من كلمة المرور الثابتة
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("token", "dummy-token");
      setIsAuthenticated(true);
      navigate("/admin");
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>تسجيل الدخول</h2>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label>اسم المستخدم</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">تسجيل الدخول</button>
      </form>
    </div>
  );
};

export default Login;
