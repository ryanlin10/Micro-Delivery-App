import '../styles/register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/authcontext';

function Register() {
    const { setIsAuth } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const url = 'http://localhost:8000/backend1/register/';
    const { username, email, password } = formData;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(url, {
                username,
                email,
                password
            });
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user.username));
            localStorage.setItem('email', JSON.stringify(response.data.user.email));
            navigate('/User');
            setIsAuth(true);
        } catch (error) {
            console.error('Error:', error.response?.data);
        }
    }

    return(
        <>
        <div>
            <h1>Sign Up</h1>
        </div>
        <div className="register-form">
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input 
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleChange}
                />  
                
                <label>Email</label>
                <input 
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                />
                
                <label>Password</label>
                <input 
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                />
                
                <button type="submit">Sign Up</button>
            </form>
        </div>
        </>
    )
}

export default Register;
