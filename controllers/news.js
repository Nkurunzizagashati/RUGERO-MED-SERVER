import { matchedData, validationResult } from 'express-validator';
import News from '../models/news.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { getLoggedInUser } from '../utils/helpers.js';

const postNews = async (req, res) => {
	try {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res
				.status(400)
				.json({ errors: result.array()[0].msg });
		}

		const data = matchedData(req);
		// Validate file existence
		if (!req.files || !req.files.image) {
			return res
				.status(400)
				.json({ message: 'Image is required' });
		}

		const loggedInUser = await getLoggedInUser(req);
		if (!loggedInUser || loggedInUser.role !== 'admin') {
			return res.status(403).json({
				message:
					'You are not authorized to perform this action',
			});
		}
		// Upload files to Cloudinary
		const imageUrl = await uploadToCloudinary(
			req.files.image[0].buffer,
			'artifacts'
		);

		// Validate upload results
		if (!imageUrl) {
			return res
				.status(500)
				.json({ message: 'File upload failed' });
		}

		// Parse tags if it's a string
		const newsData = { ...data };
		if (typeof newsData.tags === 'string') {
			try {
				newsData.tags = JSON.parse(newsData.tags);
			} catch (e) {
				return res.status(400).json({ message: 'Invalid tags format' });
			}
		}

		// Save news to database
		const postedNews = new News({
			...newsData,
			imageUrl,
		});

		await postedNews.save();

		res.status(201).json(postedNews);
	} catch (error) {
		console.log(error);
		if (error.message.includes('Not authorized')) {
			return res
				.status(401)
				.json({ message: 'Invalid token or not authorized' });
		} else {
			return res
				.status(500)
				.json({ message: 'Something went wrong' });
		}
	}
};

const getNews = async (req, res) => {
	try {
		const news = await News.find();
		return res.status(200).json({ news });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'something went wrong' });
	}
};

const updateNews = async (req, res) => {
	try {
		const newsId = req.params.newsId;
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res
				.status(400)
				.json({ errors: result.array()[0].msg });
		}

		const data = matchedData(req);
		const loggedInUser = await getLoggedInUser(req);
		if (!loggedInUser || loggedInUser.role !== 'admin') {
			return res.status(403).json({
				message:
					'You are not authorized to perform this action',
			});
		}

		// Parse tags if it's a string
		if (typeof data.tags === 'string') {
			try {
				data.tags = JSON.parse(data.tags);
			} catch (e) {
				return res.status(400).json({ message: 'Invalid tags format' });
			}
		}

		let imageUrl;
		if (req.files && req.files.image) {
			imageUrl = await uploadToCloudinary(
				req.files.image[0].buffer,
				'artifacts'
			);

			// Validate upload results
			if (!imageUrl) {
				return res
					.status(500)
					.json({ message: 'File upload failed' });
			}
		}

		const updatedNews = await News.findByIdAndUpdate(
			newsId,
			{
				...data,
				...(imageUrl && { imageUrl }),
			},
			{ new: true }
		);

		if (!updatedNews) {
			return res.status(404).json({ message: 'News not found' });
		}

		return res.status(200).json(updatedNews);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: 'Something went wrong' });
	}
};

const deleteNews = async (req, res) => {
	try {
		const newsId = req.params.newsId;

		const loggedInUser = await getLoggedInUser(req);
		if (!loggedInUser || loggedInUser.role !== 'admin') {
			return res.status(403).json({
				message:
					'You are not authorized to perform this action',
			});
		}

		const deletedNews = await News.findByIdAndDelete(newsId);

		if (!deletedNews) {
			return res.status(404).json({ message: 'News not found' });
		}

		return res
			.status(200)
			.json({ message: 'News deleted successfully' });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: 'Something went wrong' });
	}
};

export { postNews, getNews, updateNews, deleteNews };
