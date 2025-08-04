import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from "../../../store/store";
import { setUserLoggedIn } from '../../../store/userSlice.ts';
import defaultAvatarImage from '../../../assets/default-profile-icon.png';
import './LoginComponent.styles.scss';

const LoginComponent: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [message, setMessage] = useState('');

    const loginUrl = 'http://localhost:3000/login';

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        };

        try {
            const res = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                dispatch(setUserLoggedIn({
                    _id: result._id,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: result.email,
                    image: result.image ? result.image : defaultAvatarImage,
                    occupation: result.occupation,
                    messagesCount: result.messagesCount,
                    likesCount: result.likesCount
                }));

                setMessage(result.message || 'Login successfull!');

                setTimeout(() => {
                    closeModal();
                }, 1000)

            } else {
                setMessage(result.message || 'Login failed');
            }

        } catch (err) {
            setMessage('Credentials Error');
        }
    }

    return (
        <div className="login-component-wrapper-overlay">
            <div className="login-component-wrapper">
                <h2 className="login-title">Login</h2>
                <button className="close-btn" onClick={closeModal}>X</button>
                <form id="login-form" onSubmit={handleLogin}>
                    <input type="email" name="email" placeholder="Email" required /><br />
                    <input type="password" name="password" placeholder="Password" required /><br />
                    <button type="submit">Login</button>
                </form>
                <div id="login-message">{message}</div>
            </div>
        </div>
    )
};

export default LoginComponent;