import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
// Security packages
import helmet from 'helmet';
import dbConnection from './dbConfig/index.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import router from './routes/index.js';
import { configureImageKitRoutes } from './controllers/imagekitController.js';
import User from './models/userModel.js';

const __dirname = path.resolve(path.dirname(''));

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, 'views/build')));

const PORT = process.env.PORT || 8800;

dbConnection();

app.use(helmet());
app.use(cors());
// app.use(
//   cors({
//     origin: "https://cluster-client.vercel.app/",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: false,
//   })
// );

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(router);

// app.use(`/api`, router);
configureImageKitRoutes(app);

// Error middleware
app.use(errorMiddleware);

// const usersToUpdate = await User.find({ tick: { $exists: false } });

// // Update each document to include the tick field
// await Promise.all(usersToUpdate.map(async (user) => {
//   user.tick = false; // Set the default value for tick
//   await user.save();
// }));

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
});
