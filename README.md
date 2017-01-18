# kkm-validity-reader
Checks if KKM card has a valid ticket associated with it

In order to run this one needs to add a secure.js file which would export:

module.exports = {
	pass: '', // SMTP account pass
	user: '', // SMTP account user
	domain: '', // SMTP account domain
	mail: {
		from: '',
		to: ''
	},
	cityCardNumber: '', // KKM card number
	identityNumber: '' // KKM card number
};
