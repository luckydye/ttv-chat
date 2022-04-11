module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	extends: ['prettier'],
	plugins: ['prettier'],

	// add your custom rules here
	rules: {
		'prettier/prettier': 'error',
		'arrow-body-style': 'off',
		'prefer-arrow-callback': 'off',
		'class-methods-use-this': 0,
		'no-console': 0,
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'indent': 'off',
		'@typescript-eslint/indent': ['error', 'tabs', 2],
		'max-len': 0,
		'no-tabs': 0,
		'import/prefer-default-export': 0,
		'import/named': 0,
		'spaced-comment': [
			'error',
			'always',
			{
				markers: ['/']
			}
		],
		'comma-dangle': 0,
		'no-plusplus': 0,
		'prefer-destructuring': 0,
		'consistent-return': 0,
		'no-undefined': 0,
		'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
		'lines-around-comment': [
			'error',
			{
				beforeBlockComment: true,
				afterBlockComment: false,
				beforeLineComment: true,
				afterLineComment: false,
				allowBlockStart: true,
				allowBlockEnd: true,
				allowObjectStart: true,
				allowObjectEnd: true,
				allowArrayStart: true,
				allowArrayEnd: true
			}
		],
		'object-curly-spacing': 'off',
		'@typescript-eslint/object-curly-spacing': [2, 'always'],
		'no-dupe-class-members': 'off',
		'@typescript-eslint/no-dupe-class-members': ['error'],
		'@typescript-eslint/explicit-member-accessibility': 2,
		'@typescript-eslint/explicit-function-return-type': 2,
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/no-inferrable-types': 0,
		'no-unused-vars': 0,
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				args: 'after-used'
			}
		],
		'@typescript-eslint/interface-name-prefix': 'off',
		'semi': 0,
		'@typescript-eslint/semi': ['error']
	}
};
