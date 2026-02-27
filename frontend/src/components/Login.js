import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [status, setStatus] = useState(null); // { type: 'error' | 'success', msg: string }
  const [isExiting, setIsExiting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus(null);
    const API_URL = 'http://localhost/React Web App'; 

    try {
      const res = await axios.post(`${API_URL}/register.php`, formData);
      if (res.data.success) {
        setStatus({ type: 'success', msg: '> User entity created.\n> Switching to login protocol...' });
        setTimeout(() => {
          setIsLogin(true);
          setStatus(null);
        }, 5000);
      } else {
        setStatus({ type: 'error', msg: res.data.message });
      }
    } catch (error) {
      setStatus({ type: 'error', msg: 'ERR_CONNECTION_REFUSED' });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const API_URL = 'http://localhost/React Web App'; 

    try {
      const res = await axios.post(`${API_URL}/login.php`, {
        email: formData.email,
        password: formData.password
      });
      if (res.data.success) {
        setStatus({ type: 'success', msg: '> Access Granted.\n> Loading Dashboard...' });
        setIsExiting(true);
        setTimeout(() => {
          onLogin(res.data.user);
        }, 500);
      } else {
        setStatus({ type: 'error', msg: res.data.message });
      }
    } catch (error) {
      setStatus({ type: 'error', msg: 'ERR_CONNECTION_REFUSED' });
    }
  };

  return (
    <div className={`slider-container ${!isLogin ? 'active' : ''} ${isExiting ? 'slide-out' : ''}`} id="container">
      
      {/* Sign Up Form */}
      <div className="form-container sign-up">
        <form onSubmit={handleRegister}>
          <h1>Create Account</h1>
          <span>Use your email for registration</span>
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Sign Up</button>
          {status && !isLogin && <div className={`status-message ${status.type}`}>{status.msg}</div>}
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in">
        <form onSubmit={handleLoginSubmit}>
          <h1>Sign In</h1>
          <span>Use your email password</span>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <a href="/" onClick={(e) => e.preventDefault()}>Forgot Your Password?</a>
          <button type="submit">Sign In</button>
          {status && isLogin && <div className={`status-message ${status.type}`}>{status.msg}</div>}
        </form>
      </div>

      {/* Toggle Overlay */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className="hidden" onClick={() => setIsLogin(true)}>Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Dev!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button className="hidden" onClick={() => setIsLogin(false)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;