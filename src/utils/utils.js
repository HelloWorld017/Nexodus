const fs = require('fs');
const {promisify} = require('util');

module.exports.exists = async function exists(path) {
	let exists = false;
	try {
		await promisify(fs.access)(path);
		exists = true;
	} catch(e) {}

	return exists;
};
