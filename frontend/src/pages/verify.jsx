import { useState } from 'react';
import axios from 'axios';
import '../styles/verify.css';
import { useNavigate } from 'react-router-dom';
import { useVerified } from '../context/verifiedcontext';
function Verify() {
    const email = localStorage.getItem('email');
    const [message, setMessage] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const navigate = useNavigate();
    const [verificationinput, setVerificationInput] = useState('');
    const [clicked, setClicked] = useState(false);
    const { setVerified } = useVerified();
    const verification_url = 'http://localhost:8000/backend1/verification-status/';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setClicked(true);
        try {
            const response = await axios.post('http://localhost:8000/backend1/send-verification-email/', { email });
            setMessage(response.data.message);
            setVerificationCode(response.data.verification_code);
     
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error sending verification email');
        console.error('Email error:', error);  // For debugging
        }
    };
    
    const handleVerify = async () => {
        if (verificationCode === verificationinput) {
            try {
                await axios.post(verification_url, { user: localStorage.getItem('user'), email, verification_status: 'verified' }, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                });
                setMessage('Email verified, you can now sell items');
                setVerified(true);
                navigate('/sell');
            } catch (error) {
                console.error('Verification error:', error);
                setMessage('Error verifying email');
            }
        } else {
            setMessage('Invalid verification code');
        }
    };

    return (
        <div className="page-background">
            <div className="verify-container">
                <h1>Request Email Verification</h1>
            <div className="verify-button">
                <button onClick={handleSubmit}>Send Verification Email</button>
            </div>
            {message && <p>{message}</p>}
            </div>

            <div className="verify-input" style={{display: clicked ? 'block' : 'none'}}>
                <label>Enter Verification Code:</label>
                <input type="text" value={verificationinput} name="verificationinput" onChange={(e) => setVerificationInput(e.target.value)} />
                <button onClick={handleVerify}>Verify</button>
            </div>
        </div>
    );
}

export default Verify;