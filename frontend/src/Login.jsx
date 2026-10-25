import React from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import "./Login.css";

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
        <div className="container dvh-100 w-100 align-items-center justify-content-center d-flex">
            <div className="card shadow-sm border-0" style={{ maxWidth: '450px' }}>
                <div className="card-body p-4 text-center">
                    <h3 className="card-title mb-3 fw-bold">Superfly Admin</h3>
                    <p className="text-muted mb-4">
                        A folytatáshoz kérjük, jelentkezz be az adminisztrátori Google-fiókoddal!
                    </p>
                    <div className="d-flex justify-content-center">
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={() => console.log("Login Failed")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;