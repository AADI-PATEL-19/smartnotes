import React, {  useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Auth.css';
import axiosInstance from '../utils/axiosInstance';

const SignIn = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/login/', form);
      if (response.status === 200) {
        const token = response.data.access;
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', form.username);
        alert(response.data.message); // Adjust this to your needs
        console.log("Login successful", response.data);
        navigate('/home');
    }
     
    } catch (error) {
      alert('Error: Something went wrong');
      console.error("Login failed", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className='auth-btn' type="submit">Sign In</button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
