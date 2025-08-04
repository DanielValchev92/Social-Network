const dotenv = require('dotenv');
const PORT = process.env.PORT || 3000;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Message = require('./models/Message');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

//Register API
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, occupation, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ firstName, lastName, email, occupation, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
});

//Login API
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({
            message: 'Login successful',
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            image: user.image,
            occupation: user.occupation,
            messagesCount: user.messagesCount,
            likesCount: user.likesCount
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

//post a message
app.post('/messages', async (req, res) => {
    const { content, userId } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Please enter a message!' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        await User.findByIdAndUpdate(userId, { $inc: { messagesCount: 1 } });

        const updatedUser = await User.findById(userId);

        const newMessage = new Message({ content, user: userId, authorName: `${user.firstName} ${user.lastName}`, occupation: user.occupation });

        await newMessage.save();

        res.status(201).json({
            message: 'Message saved!',
            newMessage: {
                _id: newMessage.id,
                content: newMessage.content,
                user: userId,
                messagesCount: updatedUser.messagesCount,
                authorName: `${user.firstName} ${user.lastName}`,
                occupation: user.occupation
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
});

//get all messages
app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('user', 'firstName lastName occupation')
            .sort({ createdAt: -1 });

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

//post a like
app.post('/messages/:id/like', async (req, res) => {
    const messageId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User id is required" });
    }

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            res.status(400).json({ message: 'Message not found' });
        }

        const hasLiked = message.likedBy && message.likedBy.includes(userId);

        if (hasLiked) {

            await Message.findByIdAndUpdate(messageId, {
                $pull: { likedBy: userId },
                $inc: { likesGiven: -1 }
            });

            return res.status(200).json({ message: 'Unliked' });

        } else {

            await Message.findByIdAndUpdate(messageId, {
                $addToSet: { likedBy: userId },
                $inc: { likesGiven: 1 }
            });

            return res.status(200).json({ message: 'Liked' });

        }

    } catch (err) {
        res.status(500).json({ message: 'Error', error: err.message })
    }
})