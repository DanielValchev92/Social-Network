import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from "../../../store/store";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import PostSingleFeed from "./PostSingleFeed/PostSingleFeed";
import defaultProfileIcon from '../../../assets/default-profile-icon.png';
import likeButton from '../../../assets/like-button.svg';
import activeLikeButton from '../../../assets/like-button-active.png';
import shareButton from '../../../assets/share-button.svg';
import likesIcon from '../../../assets/likes-icon.png';
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
    const [shareMessage, setShareMessage] = useState<string>('');
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
                                        <img 
                                            src={message.likedByCurrentUser ? activeLikeButton : likeButton} 
                                            alt="Like Button" 
                                            className={`${message.likedByCurrentUser ? 'like-button-active' : 'like-button'}`}
                                            onClick={() => { likeAMessage(message._id, !!message.likedByCurrentUser) }} />
                                        <img src={shareButton} alt="Share Button" className="share-button" onClick={() => {
                                            setShareMessage('The message is shared!'),
                                                setTimeout(() => {
                                                    setShareMessage('')
                                                }, 2000)
                                        }} />
                                        {shareMessage && <p className="share-message-text">{shareMessage}</p>}
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