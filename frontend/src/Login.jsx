import React from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

const Login = ({ onLoginSuccess }) => {
    const handleSuccess = (credentialResponse) => {
        try {
            const payloadBase64 = credentialResponse.credential.split('.')[1];
            const binaryString = atob(payloadBase64);
            const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
            const decodedPayload = JSON.parse(new TextDecoder().decode(bytes));

            if (decodedPayload.email === ADMIN_EMAIL) {
                onLoginSuccess(decodedPayload);
            } else {
                alert("You are not authorized to access this admin panel.");
                googleLogout();
            }
        } catch (error) {
            console.error("Token decoding error:", error);
        }
    };

    return (
        <main>
            <h1>SkyLounge - ADMIN</h1>
            <p>A folytatáshoz kérjük, jelentkezz be az adminisztrátori Google-fiókoddal!</p>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log("Login Failed")}
            />
        </main>
    );
};

export default Login;