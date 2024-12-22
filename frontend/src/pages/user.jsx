import { useVerified } from '../context/verifiedcontext';
import { useState } from 'react';
import '../styles/user.css';
import axios from 'axios';
import { useEffect } from 'react';

function User(){
    const { verified } = useVerified();
    const [stripeCustomerId, setStripeCustomerId] = useState(localStorage.getItem('stripe_customer_id') || '');
    const [credit, setCredit] = useState(0);
    const url1 = 'http://localhost:8000/backend1/credit/';
    const url2 = 'http://localhost:8000/backend1/add_credit/';
    useEffect(() => {
        const fetchCredit = async () => {
            try {
                const response = await axios.get(url1, {
                    headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }, user: localStorage.getItem('user')
            })  
            console.log(response.data)
            setCredit(response.data.credit)
        } catch (error) {
            console.error('Error fetching credit:', error);
        }
    }

    fetchCredit()
    }, [])
    const handleStripeCustomerIdChange = (e) => {
        setStripeCustomerId(e.target.value);
        localStorage.setItem('stripe_customer_id', e.target.value);
    }

    const handleSaveStripeCustomerId = () => {
        localStorage.setItem('stripe_customer_id', stripeCustomerId);
    }
    const handleAddCredit = async () => {
        try {
            const response = await axios.post(url2, 
                { credit: 1000 },
                {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.new_balance) {
                setCredit(response.data.new_balance);
            }
        } catch (error) {
            console.error('Error adding credit:', error);
        }
    }
    return(
        <div>
            <h1>User Profile</h1>
            <p>Page in development</p>
            <p>Username: {localStorage.getItem('user')}</p>
            <p>Email: {localStorage.getItem('email')}</p>
            <p>Credit: {credit.toFixed(2)}</p>
            <button onClick={handleAddCredit}>Add Credit</button>
            <a href="/verify" style={{display: !verified ? 'block' : 'none'}}> Complete your user verification process in order to start selling items</a>
            <p style={{display: verified ? 'block' : 'none'}}>Your email is verified, you can now sell items</p>
        </div>
    )
}

export default User;