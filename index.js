const express = require('express');
const path = require('path');
const imageRoute = require('./routes/imageRoute');
const connectDB = require('./db/connect');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(imageRoute);
connectDB();

app.get('/', (req, res) => {
  res.send('Image Processor ,Redis will only work for development server...');
})

app.get('/health', (req, res) => {
  res.send('Server is Up and running');
})

app.use(() => {
  throw { status: 404, message: 'Route Not Found' };
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
