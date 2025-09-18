const addProductValidator = {
	title: {
		notEmpty: {
			errorMessage: 'title should not be empty',
		},
		isString: {
			errorMessage: 'title should be a string',
		},
	},
	description: {
		notEmpty: {
			errorMessage: 'description should not be empty',
		},
		isString: {
			errorMessage: 'description should be a string',
		},
		isLength: {
			options: {
				min: 10,
			},
			errorMessage:
				'description should have at least 10 characters',
		},
	},
	category: [
		{
			type: String,
			trim: true,
		},
	],
};

const updateProductValidator = {
	title: {
		optional: true,
		isString: {
			errorMessage: 'title should be a string',
		},
		notEmpty: {
			errorMessage: 'title should not be empty',
		},
	},
	description: {
		optional: true,
		isString: {
			errorMessage: 'description should be a string',
		},
		isLength: {
			options: { min: 10 },
			errorMessage:
				'description should have at least 10 characters',
		},
		notEmpty: {
			errorMessage: 'description should not be empty',
		},
	},
	category: {
		optional: true,
		isArray: {
			errorMessage: 'category should be an array of strings',
		},
	},
	'category.*': {
		optional: true,
		isString: {
			errorMessage: 'each category should be a string',
		},
		isIn: {
			options: [
				[
					'CSSD',
					'Hospital Design',
					'Plastic Surgery',
					'Neurosurgery',
					'Theatre',
					'Home Care',
				],
			],
			errorMessage: 'invalid category',
		},
		notEmpty: {
			errorMessage: 'category item should not be empty',
		},
	},
};

export { addProductValidator, updateProductValidator };
