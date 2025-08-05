import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import logo from '../../assets/social-network-logo.svg';
import defaultProfileIcon from '../../assets/default-profile-icon.png';
import './HeaderComponent.styles.scss';
import RegisterComponent from "./RegisterComponent/RegisterComponent";
import LoginComponent from "./LoginComponent/LoginComponent";
import ProfileOptionsComponent from './ProfileDropdownMenu/ProfileOptionsComponent/ProfileOptionsComponent';
import { logout } from "../../store/userSlice";
import { persistor } from '../../store/store';

const HeaderComponent: React.FC = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showProfileOption, setShowProfileOptions] = useState(false);

    const { userLoggedIn, firstName, lastName, occupation, messagesCount, likesCount } = useSelector((state: RootState) => state.user);
    const image = useSelector((state: RootState) => state.user.image);

    const dispatch = useDispatch<AppDispatch>();

    const notLoggedInUserView = () => {
        return (
            <>
                <button className="register-button" onClick={() => setShowRegister(true)}>Register</button>
                <button className="login-button" onClick={() => setShowLogin(true)}>Login</button>
            </>
        )
    }

    const loggedInUserView = () => {
        return (
            <>
                <div className="loggedin-profile-wrapper">
                    <div className="personal-data-wrapper">
                        <div className="user-data">
                            <div className="user-names">{firstName} {lastName}</div>
                            <div className="user-occupation">{occupation ? occupation : ''}</div>
                        </div>
                        <div className="engagement-wrapper">
                            <div className="likes-wrapper">
                                <span className="count likes-count">{likesCount ? likesCount : 0}</span>
                                <span>Likes</span>
                            </div>
                            <div className="posts-wrapper">
                                <span className="count posts-count">{messagesCount ? messagesCount : 0}</span>
                                <span>Posts</span>
                            </div>
                        </div>
                    </div>
                    <img src={image ? image : defaultProfileIcon} alt="Profile Icon" className="profile-icon"
                        onClick={() => {
                            if (!showProfileDropdown) {
                                setShowProfileDropdown(true);
                            } else {
                                setShowProfileDropdown(false);
                            }

                        }} />
                </div>
                {showProfileDropdown && renderProfileDropDownMenu()}
            </>
        )
    }

    const handleLogout = () => {
        dispatch(logout());
        persistor.purge();

        window.location.href = '/';
    }

    const renderProfileDropDownMenu = () => {
        return (
            <>
                <div className="profile-dropdown-menu-wrapper">
                    <div className="my-profile-options" onClick={() => {
                        setShowProfileOptions(true), setShowProfileDropdown(false)
                    }}>My profile</div>
                    <div className="logout" onClick={() => { handleLogout() }}>Logout</div>
                </div>
            </>
        )
    }

    return (
        <div className="header-wrapper-overlay">
            <div className="header-wrapper">
                <div className="logo-wrapper">
                    <img src={logo} alt="logo" />
                </div>
                <div className="profile-wrapper">
                    <div className="login-register-section">
                        {userLoggedIn ? loggedInUserView() : notLoggedInUserView()}
                    </div>
                </div>
            </div>
            {showRegister && <RegisterComponent closeModal={() => setShowRegister(false)} />}
            {showLogin && <LoginComponent closeModal={() => setShowLogin(false)} />}
            {showProfileOption && <ProfileOptionsComponent closeModal={() => setShowProfileOptions(false)} />}
        </div>
    );
};

export default HeaderComponent;