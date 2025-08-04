import React from 'react';
import HeaderComponent from './UIComponents/HeaderComponent/HeaderComponent';
import SocialFeedComponent from './UIComponents/SocialFeedComponent/SocialFeedComponent';
import FooterComponent from './UIComponents/FooterComponent/FooterComponent';
import './App.scss';


const App: React.FC = () => {
    return (
        <>
            <div className="social-network-wrapper">
                <HeaderComponent />
                <SocialFeedComponent />
                <FooterComponent />
            </div>
        </>
    );
};

export default App;
