const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

app.use(cors());
app.use(express.json());

//connect to mongoose
mongoose.connect('Enter Your MongoDB URI')
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB Connection Error:', err));;

//require route
app.use('/user', require('./routes/userRoute.cjs'));
app.use('/item', require('./routes/itemRoute.cjs'));
app.use('/cart', require('./routes/cartRoute.cjs'));

app.listen(5000, () => {
    console.log('Server has started on port 5000');
})