const postNewsValidator = {
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
	category: {
		notEmpty: {
			errorMessage: 'category should not be empty',
		},
		isString: {
			errorMessage: 'category should be a string',
		},
	},
};

const updateNewsValidator = {
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
		isString: {
			errorMessage: 'category should be a string',
		},
		notEmpty: {
			errorMessage: 'category should not be empty',
		},
	},
};

export { postNewsValidator, updateNewsValidator };
