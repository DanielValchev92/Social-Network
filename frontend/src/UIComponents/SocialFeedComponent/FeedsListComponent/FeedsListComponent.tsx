import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from "../../../store/store";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import PostSingleFeed from "./PostSingleFeed/PostSingleFeed";
import defaultProfileIcon from '../../../assets/default-profile-icon.png';
import likesIcon from '../../../assets/heart-icon.svg';
import { incrementLikesCount } from "../../../store/userSlice";
import './FeedListComponent.styles.scss';

dayjs.extend(relativeTime);

const MESSAGE_PREVIEW_LENGTH = 200;

const FeedsListComponent: React.FC = () => {
    type Message = {
        content: string;
        createdAt: Date;
        _id: string;
        user: {
            occupation?: string;
        };
        authorName: string;
        likes: number;
        likedByCurrentUser?: boolean;
    };

    const getAllMessagesUrl = 'http://localhost:3000/messages';
    const likeAMessageUrl = 'http://localhost:3000/messages';

    const { userLoggedIn, _id } = useSelector((state: RootState) => state.user);
    const image = useSelector((state: RootState) => state.user.image);

    const dispatch = useDispatch<AppDispatch>();

    const [messagesArray, setMessagesArray] = useState<Message[]>([]);
    const [expandMessaegeID, setExpandMessageID] = useState<{ [key: string]: boolean }>({});

    const toggleExpand = (id: string) => {
        setExpandMessageID(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getAllMessages = async () => {
        const res = await fetch(getAllMessagesUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await res.json();


        setMessagesArray(result);
    };

    const likeAMessage = async (messageId: string, liked: boolean) => {
        const res = await fetch(`${likeAMessageUrl}/${messageId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: _id })
        });

        if (res.ok) {
            setMessagesArray(prevMessages =>
                prevMessages.map(message => {
                    if (message._id === messageId) {
                        return {
                            ...message,
                            likes: liked ? message.likes - 1 : message.likes + 1,
                            likedByCurrentUser: !liked
                        };
                    }
                    return message;
                })
            )

            dispatch(incrementLikesCount(liked ? -1 : +1));

        } else {
            const errorData = await res.json();
            console.error(errorData.message);
        }
    }

    const HeartIcon = (active: boolean, onClick: () => void) => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg"
                onClick={onClick}
                viewBox="0 0 24 24"
                width="24" height="24"
                fill="#f0f0f5"
                className={`heart-button ${active ? 'active' : ''}`}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
           2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
           C13.09 3.81 14.76 3 16.5 3 
           19.58 3 22 5.42 22 8.5 
           c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        )
    }

    useEffect(() => {
        getAllMessages();

    }, []);


    return (
        <>
            <PostSingleFeed getAllMessages={() => getAllMessages()} />
            <div className="messages-list-wrapper">
                {messagesArray &&
                    messagesArray.map((message, index) => {
                        const isExpanded = expandMessaegeID[message._id] || false;
                        const isMessageLong = message.content.length > MESSAGE_PREVIEW_LENGTH;
                        const displayContent = isExpanded ? message.content : message.content.slice(0, MESSAGE_PREVIEW_LENGTH) + (isMessageLong ? '...' : '');

                        return (
                            <div key={index} className="message-wrapper">
                                <div className="user-profile-section">
                                    <div className="user-data-wrapper">
                                        <div className="profile-avatar">
                                            <img src={image ? image : defaultProfileIcon} alt="Profile Avatar" />
                                        </div>
                                        <div className="user-personal-data">
                                            <div className="user-names">{message.authorName}</div>
                                            <div className="user-occupation">{message.user.occupation ? message.user.occupation : ''}</div>
                                        </div>
                                    </div>
                                    <div className="timestamp">{dayjs(message.createdAt).fromNow()}</div>
                                </div>
                                <div className="message-content">
                                    {displayContent}
                                    {isMessageLong && (
                                        <button className="see-more-less-button" onClick={() => toggleExpand(message._id)}>
                                            {isExpanded ? '...see less' : '...see more'}
                                        </button>
                                    )}
                                </div>
                                <div className="likes-count-wrapper">
                                    <img src={likesIcon} alt="Likes icon" />
                                    <span>{message.likes}</span>
                                </div>
                                {userLoggedIn &&
                                    <div className="engagement-buttons-wrapper">
                                        {HeartIcon(message.likedByCurrentUser ? true : false, () => likeAMessage(message._id, !!message.likedByCurrentUser))}
                                    </div>
                                }
                            </div>
                        )
                    })}
            </div>
        </>
    )
};

export default FeedsListComponent;