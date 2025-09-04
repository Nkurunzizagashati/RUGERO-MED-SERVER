const loginUserValidator = {
	email: {
		notEmpty: {
			errorMessage: 'Email should not be empty',
		},
		isEmail: {
			errorMessage: 'Email should be a valid email',
		},
	},
	password: {
		notEmpty: {
			errorMessage: 'Password should not be empty',
		},
		isString: {
			errorMessage: 'Password should be a string',
		},
		isLength: {
			options: {
				min: 6,
				max: 10,
			},
			errorMessage: 'Password should have 6 to 10 characters',
		},
	},
};

export { loginUserValidator };
