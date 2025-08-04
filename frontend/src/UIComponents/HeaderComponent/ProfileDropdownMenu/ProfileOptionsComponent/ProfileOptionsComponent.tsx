import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import React, { useEffect, useState } from "react";
import defaultProfileImage from '../../../../assets/default-profile-icon.png';
import './ProfileOptionsComponent.styles.scss';
import { setUserImage, setOccupation } from "../../../../store/userSlice";

const ProfileOptionsComponent: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
    const dispatch = useDispatch();
    const { firstName, lastName, email, image, occupation } = useSelector((state: RootState) => state.user);

    const [avatar, setAvatar] = useState<string | null>(null);
    const [occupationValue, setOccupationValue] = useState<string>(occupation || '');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setAvatar(image)
    }, [image]);

    useEffect(() => {
        setOccupationValue(occupation || '');
    }, [occupation]);

    const handleOccupationValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setOccupationValue(value);
        dispatch(setOccupation(value));
    };

    const handleUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async () => {
            const file = input.files?.[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = () => {
                const base64 = reader.result as string;
                setAvatar(base64);
                dispatch(setUserImage(base64));
                setMessage('Avatar uploaded');

                setTimeout(() => {
                    setMessage('');
                }, 2000);
            };

            reader.onerror = () => {
                setMessage('Upload failed');

                setTimeout(() => {
                    setMessage('');
                }, 2000);
            };

            reader.readAsDataURL(file);

        };

        input.click();
    };

    const renderAvatar = () => {
        return (
            <div className="profile-avatar-wrapper">
                <img src={avatar ? avatar : defaultProfileImage} alt="Avatar" width={100} height={100} />
                <button onClick={handleUpload}>Upload Photo</button>
            </div>
        )
    }

    const renderPersonalData = () => {
        return (
            <div className="profile-personal-data-wrapper">
                <span className="user-names">
                    <span className="first-name">
                        <span className="first-name-label">First Name:</span>
                        <span className="first-name-value">{firstName}</span>
                    </span>
                    <span className="last-name">
                        <span className="last-name-label">Last Name:</span>
                        <span className="last-name-value">{lastName}</span>
                    </span>
                </span>
                <span className="user-email">
                    <span className="email-label">Email: </span>
                    <span className="email-value">{email}</span>
                </span>
                <span className="user-occupation">
                    <span className="occupation-label">Occupation: </span>
                    <input
                        className="occupation-value"
                        type="text"
                        value={occupationValue}
                        onChange={handleOccupationValue}
                        placeholder="Occupation"
                    />
                </span>
            </div>
        )
    }

    return (
        <div className="profile-options-wrapper-overlay">
            <div className="profile-options-wrapper">
                <h2 className="profile-options-title">My Profile</h2>
                <button className="close-btn" onClick={closeModal}>X</button>
                <div className="profile-avatar-and-data">
                    {renderAvatar()}
                    {renderPersonalData()}
                </div>
                <p className="upload-message">{message}</p>
            </div>
        </div>
    )
}

export default ProfileOptionsComponent;