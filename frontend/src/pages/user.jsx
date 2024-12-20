import { useVerified } from '../context/verifiedcontext';

function User(){
    const { verified } = useVerified();
    
    return(
        <div>
            <h1>User Profile</h1>
            <p>Page in development</p>
            <p>Username: {localStorage.getItem('user')}</p>
            <p>Email: {localStorage.getItem('email')}</p>
   
            <a href="/verify" style={{display: !verified ? 'block' : 'none'}}> Complete your user verification process in order to start selling items</a>
            <p style={{display: verified ? 'block' : 'none'}}>Your email is verified, you can now sell items</p>
        </div>
    )
}

export default User;