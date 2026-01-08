const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://KC:39794580Kc*@cluster0.wftypqu.mongodb.net/')
.then(() => console.log('Connected to MongoDB'))
.catch((e) => console.log(e));