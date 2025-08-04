import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store.ts";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from "../../../../store/store.ts";
import './PostSingleFeed.styles.scss';
import { incrementMessagesCount } from '../../../../store/userSlice.ts';

const PostSingleFeed: React.FC<{ getAllMessages: () => void }> = ({ getAllMessages }) => {
    const { userLoggedIn, _id, firstName, lastName, occupation } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const [feed, setFeed] = useState('');
    const [message, setMessage] = useState('');

    const postMessagesUrl = 'http://localhost:3000/messages';

    const handlePost = async () => {
        if (!feed.trim()) {
            setMessage('Please enter a message');

            setTimeout(() => {
                setMessage('');
            }, 2000);

            return;
        }

        try {
            const res = await fetch(postMessagesUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: feed,
                    userId: _id,
                    firstName,
                    lastName,
                    occupation
                })
            });

            const result = await res.json();

            if (res.ok) {
                setMessage('Message is posted successfully!');
                setFeed('');
                dispatch(incrementMessagesCount(result.newMessage.messagesCount));
                getAllMessages();
            } else {
                setMessage(result.message || 'Failed to post a message.')
            }

            setTimeout(() => {
                setMessage('');
            }, 2000);

        } catch (err) {
            setMessage('Server error while posting the message.');
        }
    }

    return (
        <>
            <div className="post-single-feed-wrapper">
                <div className="post-message-wrapper">
                    <input
                        className="message-input"
                        placeholder={userLoggedIn ? "Share something to the community..." : "Log in to post a message :)"}
                        value={feed}
                        onChange={(e) => setFeed(e.target.value)}
                    />
                </div>
                <div className="button-and-message-wrapper">
                    {message && <p className="message-warning">{message}</p>}
                    <button disabled={userLoggedIn ? false : true} onClick={handlePost}>Post</button>
                </div>
            </div>
        </>
    );
};

export default PostSingleFeed;