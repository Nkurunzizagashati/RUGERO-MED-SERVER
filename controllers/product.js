import { matchedData, validationResult } from 'express-validator';
import Product from '../models/product.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { getLoggedInUser } from '../utils/helpers.js';

const getProducts = async (req, res) => {
	try {
		const products = await Product.find();
		return res.status(200).json({
			products,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'something went wrong' });
	}
};
const addProduct = async (req, res) => {
	try {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res
				.status(400)
				.json({ errors: result.array()[0].msg });
		}

		const data = matchedData(req);

		console.log('DATA: ', data);
		console.log('FILES: ', req.files);

		// Validate file existence
		if (!req.files || !req.files.image) {
			return res
				.status(400)
				.json({ message: 'Image is required' });
		}

		const loggedInUser = await getLoggedInUser(req);
		if (!loggedInUser) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		if (loggedInUser.role !== 'admin') {
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

		console.log('IMAGE URL: ', imageUrl);

		// Save artifact to database
		const newProduct = new Product({
			...data,
			imageUrl,
		});

		await newProduct.save();

		res.status(201).json(newProduct);
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

const updateProduct = async (req, res) => {
	try {
		const productId = req.params.productId;
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res
				.status(400)
				.json({ errors: result.array()[0].msg });
		}

		const data = matchedData(req);
		const loggedInUser = await getLoggedInUser(req);
		if (!loggedInUser) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		if (loggedInUser.role !== 'admin') {
			return res.status(403).json({
				message:
					'You are not authorized to perform this action',
			});
		}

		let imageUrl;
		if (req.files && req.files.image) {
			imageUrl = await uploadToCloudinary(
				req.files.image[0].buffer,
				'artifacts'
			);
			if (!imageUrl) {
				return res
					.status(500)
					.json({ message: 'Image upload failed' });
			}
		}

		const updatedProduct = await Product.findByIdAndUpdate(
			productId,
			{
				...data,
				...(imageUrl && { imageUrl }),
			},
			{ new: true }
		);

		if (!updatedProduct) {
			return res
				.status(404)
				.json({ message: 'Product not found' });
		}

		return res.status(200).json(updatedProduct);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: 'Something went wrong' });
	}
};

const deleteProduct = async (req, res) => {
	try {
		const productId = req.params.productId;

		const loggedInUser = await getLoggedInUser(req);
		if (!loggedInUser) {
			return res.status(401).json({
				message: 'you need to login to perform this action',
			});
		}
		if (loggedInUser.role !== 'admin') {
			return res.status(403).json({
				message:
					'You are not authorized to perform this action',
			});
		}

		const deletedProduct = await Product.findByIdAndDelete(
			productId
		);
		if (!deletedProduct) {
			return res
				.status(404)
				.json({ message: 'Product not found' });
		}

		return res
			.status(200)
			.json({ message: 'Product deleted successfully' });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: 'Something went wrong' });
	}
};

export { deleteProduct, updateProduct, getProducts, addProduct };
