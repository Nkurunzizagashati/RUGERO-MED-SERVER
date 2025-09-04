import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
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
		category: {
			type: String,
			required: true,
		},

		imageUrl: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const News = mongoose.model('News', newsSchema);

export default News;
