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
	tags: {
		custom: {
			options: (value) => {
				try {
					// If it's a string, try to parse it as JSON
					const tagsArray = typeof value === 'string' ? JSON.parse(value) : value;
					// Check if it's an array and has at least one item
					if (!Array.isArray(tagsArray) || tagsArray.length === 0) {
						return false;
					}
					// Check each tag is a non-empty string
					return tagsArray.every(tag => typeof tag === 'string' && tag.trim().length > 0);
				} catch (e) {
					return false;
				}
			},
			errorMessage: 'Tags must be a valid JSON array of non-empty strings (e.g., ["tag1", "tag2"])',
		}
	},
	reporter: {
		notEmpty: {
			errorMessage: 'Reporter name is required',
		},
		isString: {
			errorMessage: 'Reporter name must be a string',
		},
		trim: true,
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
	tags: {
		optional: true,
		custom: {
			options: (value) => {
				if (value === undefined || value === '') return true; // Skip if optional and not provided
				try {
					// If it's a string, try to parse it as JSON
					const tagsArray = typeof value === 'string' ? JSON.parse(value) : value;
					// Check if it's an array and has at least one item
					if (!Array.isArray(tagsArray) || tagsArray.length === 0) {
						return false;
					}
					// Check each tag is a non-empty string
					return tagsArray.every(tag => typeof tag === 'string' && tag.trim().length > 0);
				} catch (e) {
					return false;
				}
			},
			errorMessage: 'Tags must be a valid JSON array of non-empty strings (e.g., ["tag1", "tag2"])',
		}
	},
	reporter: {
		optional: true,
		isString: {
			errorMessage: 'Reporter name must be a string',
		},
		trim: true,
	},
};

export { postNewsValidator, updateNewsValidator };
