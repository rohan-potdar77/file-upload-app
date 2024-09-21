import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const login = "http://localhost:4000/api/public/login";
const register = "http://localhost:4000/api/public/register";

const AuthForm = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    return isLogin ? handleLogin() : handleRegister();
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(register, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const body = await response.json();

      if (response.status === 201) {
        alert(body);
      } else {
        alert(body.error);
      }
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setFormData({ username: "", password: "" });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(login, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const body = await response.json();

      if (response.status === 200) {
        sessionStorage.setItem("token", body);
        return navigate("/home");
      } else {
        alert(body.error);
      }
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setFormData({ username: "", password: "" });
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    token && navigate("/home");
  }, []);

  return (
    <Fragment>
      <div className="auth-form">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              autoComplete="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>

        <p>{isLogin ? "Register ?" : "Already registered ?"}</p>

        <p>
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </Fragment>
  );
};

export default AuthForm;
