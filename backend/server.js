require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const properties = require('./data/index.js');
const llmService = require('./services/llmService.js');

const app = express();
app.use(cors());
app.use(express.json());

let isMongoConnected = false;
let memorySavedProperties = [];

if (process.env.MONGO_URI && process.env.MONGO_URI !== 'mongodb+srv://<user>:<password>@cluster.mongodb.net/realestate?retryWrites=true&w=majority') {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('MongoDB connected successfully');
            isMongoConnected = true;
        })
        .catch(err => console.log('MongoDB connection error:', err.message));
} else {
    console.log("No valid MONGO_URI found in .env, using in-memory storage for saved properties.");
}

const UserSchema = new mongoose.Schema({
    userId: { type: String, default: 'test-user' },
    savedProperties: [Number]
});
const User = mongoose.model('User', UserSchema);

app.get('/api/properties', (req, res) => {
    res.json(properties);
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const responseText = await llmService.handleChat(message, properties);
        res.json({ reply: responseText });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users/saved', async (req, res) => {
    if (!isMongoConnected) return res.json(memorySavedProperties);
    try {
        const user = await User.findOne({ userId: 'test-user' });
        res.json(user ? user.savedProperties : []);
    } catch (err) { res.status(500).json({error: err.message}); }
});

app.post('/api/users/saved', async (req, res) => {
    const { propertyId } = req.body;
    if (!isMongoConnected) {
        if (!memorySavedProperties.includes(propertyId)) memorySavedProperties.push(propertyId);
        else memorySavedProperties = memorySavedProperties.filter(id => id !== propertyId);
        return res.json(memorySavedProperties);
    }
    try {
        let user = await User.findOne({ userId: 'test-user' });
        if (!user) user = new User({ userId: 'test-user', savedProperties: [] });

        if (!user.savedProperties.includes(propertyId)) {
            user.savedProperties.push(propertyId);
        } else {
            user.savedProperties = user.savedProperties.filter(id => id !== propertyId);
        }
        await user.save();
        res.json(user.savedProperties);
    } catch (err) { res.status(500).json({error: err.message}); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Node server running on port ${PORT}`));
