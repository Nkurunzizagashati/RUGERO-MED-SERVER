import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import nodemailer from 'nodemailer';

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	return hashedPassword;
};

const comparePasswords = async (password, hashedPassword) => {
	const passwordsMatch = await bcrypt.compare(
		password,
		hashedPassword
	);
	return passwordsMatch;
};

const getLoggedInUser = async (req) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return null; // no token
		}

		const accessToken = authHeader.split(' ')[1];
		const decodedAccessToken = jwt.verify(
			accessToken,
			process.env.JWT_SECRET
		);

		const user = await User.findOne({
			email: decodedAccessToken.email,
		});
		if (!user) {
			console.warn('Not authorized: User not found');
			return null;
		}

		console.log('LOGGED IN USER: ', user);
		return user;
	} catch (error) {
		console.error('Error in getLoggedInUser:', error.message);

		// Instead of throwing, return null when token is bad
		return null;
	}
};

const sendEmail = async (receiverEmail, message, subject) => {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOptions = {
			from: 'My Culture My Value org',
			to: receiverEmail,
			subject: subject,
			html: message,
		};

		const info = await transporter.sendMail(mailOptions);
		console.log('Email sent: ', info.response);
	} catch (error) {
		throw new Error(error.message);
	}
};

export { hashPassword, comparePasswords, getLoggedInUser, sendEmail };
