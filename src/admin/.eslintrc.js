// 어드민 폴더 전용: 사이트 기존 규칙 중 코드 모양(스타일)에 관한 몇 가지만 완화해요.
module.exports = {
	rules: {
		"no-underscore-dangle": "off",
		"no-use-before-define": "off",
		"@typescript-eslint/no-use-before-define": "off",
		"prefer-destructuring": "off",
		"no-restricted-syntax": "off",
		"no-await-in-loop": "off",
		"react/require-default-props": "off",
		"react/jsx-props-no-spreading": "off",
		"jsx-a11y/label-has-associated-control": ["error", { assert: "either" }],
		"no-promise-executor-return": "off",
		"@typescript-eslint/no-explicit-any": "off",
	},
};
