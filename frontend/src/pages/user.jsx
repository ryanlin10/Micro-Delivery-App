import { useVerified } from '../context/verifiedcontext';
import { useState } from 'react';
import '../styles/user.css';
function User(){
    const { verified } = useVerified();
    const [stripeCustomerId, setStripeCustomerId] = useState(localStorage.getItem('stripe_customer_id') || '');

    const handleStripeCustomerIdChange = (e) => {
        setStripeCustomerId(e.target.value);
        localStorage.setItem('stripe_customer_id', e.target.value);
    }

    const handleSaveStripeCustomerId = () => {
        localStorage.setItem('stripe_customer_id', stripeCustomerId);
    }

    return(
        <div>
            <h1>User Profile</h1>
            <p>Page in development</p>
            <p>Username: {localStorage.getItem('user')}</p>
            <p>Email: {localStorage.getItem('email')}</p>
            <div className="stripe-customer-id">
                <p>Stripe Customer ID:</p>
                <input 
                    type="text"
                    value={stripeCustomerId}
                    onChange={handleStripeCustomerIdChange}
                    name="stripe_customer_id"
                    placeholder="Enter Stripe Customer ID"
                />
                <button onClick={handleSaveStripeCustomerId}>Save</button>
                <p>{localStorage.getItem('stripe_customer_id')}</p>
            </div>
            <a href="/verify" style={{display: !verified ? 'block' : 'none'}}> Complete your user verification process in order to start selling items</a>
            <p style={{display: verified ? 'block' : 'none'}}>Your email is verified, you can now sell items</p>
        </div>
    )
}

export default User;