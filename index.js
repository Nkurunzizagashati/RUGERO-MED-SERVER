import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import createDBConnection from './utils/db.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import http from 'http';
dotenv.config();

const app = express();
const server = http.createServer(app);
const origins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
	cors({
		origin: origins,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
	})
);

app.use('/api', routes);

app.get('/api', async (req, res) => {
	res.send('HELLO FROM RUGERO MED BACKEND');
});

// Connect to the Database

createDBConnection();

const PORT = process.env.PORT || 3002;

try {
	server.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
} catch (error) {
	console.error(
		`ERROR OCCURED WHILE INITIALIZING THE SERVER CONNECTION: ${error.message}`
	);
	process.exit(1);
}
