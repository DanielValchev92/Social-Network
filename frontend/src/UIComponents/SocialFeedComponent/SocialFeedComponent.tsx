import React from "react";
import Chatroom from "./Chatroom/Chatroom";
import FeedsListComponent from "./FeedsListComponent/FeedsListComponent";
import './SocialFeedComponent.styles.scss';

const SocialFeedComponent: React.FC = () => {
    return (
        <div className="social-network-feed-wrapper">
            <div className="chatroom-wrapper">
                <Chatroom />
            </div>
            <div className="feeds-section-wrapper">
                <FeedsListComponent />
            </div>
        </div>
    )
}

export default SocialFeedComponent;