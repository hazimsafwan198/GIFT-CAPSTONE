const mongoose = require('mongoose');

//Add data here if new data arrive
const UserSchema = new mongoose.Schema({
    user: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    about: { type: String, required: false, default: '' },
    points: { type: Number, required: false },
    image: { type: String, required: false },
    verificationCode: { type: String, required: false },
});

const UserData = mongoose.model('UserData', UserSchema, 'UserData');

module.exports = UserData;