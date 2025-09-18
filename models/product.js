import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},

		description: {
			type: String,
			minlength: 6,
		},
		category: [
			{
				type: String,
				trim: true,
			},
		],

		imageUrl: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model('Product', productSchema);

export default Product;
