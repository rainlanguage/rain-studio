export const interpreterName = (
	interpreterType_: string,
	options_: { isPLural?: boolean; addArticle?: boolean } = {}
) => {
	const { isPLural, addArticle } = options_;

	let _name: string;
	// Only deployer, rainterpreter and stores should be possible since
	// the app redirect or throw an error when the `[type]` is not one of those.
	if (interpreterType_ === 'deployer') {
		_name = 'Expression Deployer';
	} else {
		_name = interpreterType_.charAt(0).toUpperCase() + interpreterType_.slice(1);
	}

	// Don't use "the" article...
	if (isPLural) {
		_name = _name + 's';
	} else {
		// Only add articles on singulars
		if (addArticle) {
			if (['a', 'e', 'i', 'o', 'u'].includes(_name.charAt(0).toLowerCase())) {
				_name = 'an ' + _name;
			} else {
				_name = 'a ' + _name;
			}
		}
	}

	return _name;
};
