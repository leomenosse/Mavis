module.exports = {
	getMainPage: (req, res) => {
		res.render('index.ejs');
	},

	getSignUpPage: (req, res) => {
		res.render('cadastro.ejs');
	},

	getHomePage: (req, res) => {
		res.render('login.ejs');
	}
}
