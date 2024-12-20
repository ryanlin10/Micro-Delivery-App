import { createContext, useState, useContext } from "react";

export const VerifiedContext = createContext();

export function useVerified() {
    return useContext(VerifiedContext);
}

export const VerifiedProvider = ({ children }) => {
    const [verified, setVerified] = useState(false);

    return (
        <VerifiedContext.Provider value={{ verified, setVerified }}>
            {children}
        </VerifiedContext.Provider>
    );
};