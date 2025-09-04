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
price: {
			type: Number,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			enum: [
				'CSSD',
				'Hospital Design',
				'Plastic Surgery',
				'Neurosurgery',
				'Theatre',
				'Home Care',
			],
		},

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
