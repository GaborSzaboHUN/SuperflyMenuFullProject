import React from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

// .env:   VITE_ADMIN_EMAILS=first@gmail.com,second@gmail.com   (one string)
// result: ["first@gmail.com", "second@gmail.com"]               (a list)
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim());

const Login = ({ onLoginSuccess }) => {
    const handleSuccess = (credentialResponse) => {

        try {
            const payloadBase64 = credentialResponse.credential.split('.')[1];
            const binaryString = atob(payloadBase64);
            const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
            const decodedPayload = JSON.parse(new TextDecoder().decode(bytes));

            if (ADMIN_EMAILS.includes(decodedPayload.email)) {
                // 1. param: user data (name, email) - for display
                // 2. param: the raw token - we will send this to the backend
                onLoginSuccess(decodedPayload, credentialResponse.credential);
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