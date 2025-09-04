import User from '../models/user.js';
import { validationResult, matchedData } from 'express-validator';
import { comparePasswords } from '../utils/helpers.js';
import { generateJWTauthToken } from '../utils/authToken.js';

const loginUser = async (req, res) => {
	try {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res
				.status(400)
				.json({ message: result.array()[0].msg });
		}

		const data = matchedData(req);
		const existingUser = await User.findOne({ email: data.email });

		if (!existingUser) {
			return res
				.status(401)
				.json({ message: 'Invalid credentials' });
		}

		const passwordMatches = await comparePasswords(
			data.password,
			existingUser.password
		);
		if (!passwordMatches) {
			return res
				.status(401)
				.json({ message: 'Invalid credentials' });
		}

		const accessToken = generateJWTauthToken({
			email: existingUser.email,
		});

		const userData = existingUser.toObject();
		delete userData.password;

		return res.status(200).json({
			message: 'Logged in successfully!',
			user: userData,
			accessToken,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export { loginUser };
