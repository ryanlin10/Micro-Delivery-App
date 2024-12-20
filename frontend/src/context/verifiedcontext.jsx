import { createContext, useState, useContext } from "react";

export const VerifiedContext = createContext();

export function useVerified() {
    return useContext(VerifiedContext);
}

export const VerifiedProvider = ({ children }) => {
    const email = localStorage.getItem('email');
    const initialVerifiedStatus = localStorage.getItem(`verificationStatus_${email}`) === 'false';
    const [verified, setVerified] = useState(initialVerifiedStatus);

    return (
        <VerifiedContext.Provider value={{ verified, setVerified }}>
            {children}
        </VerifiedContext.Provider>
    );
};