import React, { useState } from "react";
import "./ChangePassword.css"; // Import the CSS file

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [passwordErrors, setPasswordErrors] = useState([]);

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) errors.push("At least 8 characters");
        if (!/\d/.test(password)) errors.push("At least 1 number");
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("At least 1 special character");
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const validationErrors = validatePassword(newPassword);
        if (validationErrors.length > 0) {
            setPasswordErrors(validationErrors);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://127.0.0.1:5000/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setError("");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordErrors([]);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="change-password-container">
            <div className="form-container">
                <h1 className="form-heading">Change Password</h1>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label className="form-label">Current Password:</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setPasswordErrors(validatePassword(e.target.value));
                            }}
                            required
                            className="form-input"
                        />
                        {passwordErrors.length > 0 && (
                            <ul className="password-errors">
                                {passwordErrors.map((err, index) => (
                                    <li key={index}>• {err}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirm New Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Change Password
                    </button>
                </form>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default ChangePassword;