import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Auth.css'; 
import axiosInstance from '../utils/axiosInstance';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/api/signup/', {
                username,
                email,
                password,
            });
            alert(response.data.message); // Adjust this to your needs
            navigate('/'); // Redirect to login page after successful signup
        } catch (err) {
            if (err.response) {
                console.log(err.response.data);
                alert(`Error: ${err.response.data.error || 'Something went wrong'}`);
            } else {
                console.log(err);
                alert('Error: Something went wrong');
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <div className="input-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className='auth-btn' type="submit">Sign Up</button>
                <p>
                    Already have an account? <Link to="/">Sign In</Link>
                </p>
            </form>
        </div>
    );
};

export default SignUp;
