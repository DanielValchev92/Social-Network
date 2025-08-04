import React, { useState } from "react";
import './RegisterComponent.styles.scss';

const RegisterComponent: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
    const [message, setMessage] = useState('');

    const registerUrl = 'http://localhost:3000/register';

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            occupation: formData.get('occupation') as string,
            password: formData.get('password') as string,
        };

        try {
            const res = await fetch(registerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            setMessage(result.message || 'Done!');

            setTimeout(() => {
                closeModal();
            }, 2000)

        } catch (err) {
            setMessage('Registration Error')
        }
    }

    return (
        <div className="register-component-wrapper-overlay">
            <div className="register-component-wrapper">
                <h2 className="register-title">Register</h2>
                <button className="close-btn" onClick={closeModal}>X</button>
                <form id="register-form" onSubmit={handleRegister}>
                    <input type="firstName" name="firstName" placeholder="First Name" required /><br />
                    <input type="lastName" name="lastName" placeholder="Last Name" required /><br />
                    <input type="email" name="email" placeholder="Email" required /><br />
                    <input type="occupation" name="occupation" placeholder="Occupation" required /><br />
                    <input type="password" name="password" placeholder="Password" required /><br />
                    <button type="submit">Register</button>
                </form>
                <div id="register-message">{message}</div>
            </div>
        </div>
    )
};

export default RegisterComponent;