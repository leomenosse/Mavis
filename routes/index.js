module.exports = {
	getLoginPage: (req, res) => {
		res.render('login.ejs');
	},

	getSignUpPage: (req, res) => {
		res.render('cadastro.ejs');
	},

	getHomePage: (req, res) => {
		res.render('index.ejs');
	}
}
