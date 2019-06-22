const mysql = require('mysql');
const sql = require('../public/javascripts/sql.js');

module.exports = {
	connectionPage: (req, res) => {
    	res.render('conectarDB.ejs');
	},

  	connectToDB: (req, res) => {

		//pegando dados do formulário enviado pelo usuário
		let dbInfo = {
			host: req.body.host,
			user: req.body.user,
			password: req.body.password,
			database: req.body.database,
			tableNames: undefined
		}

		//criando a conexão com os dados que o usuário passou
		let con = mysql.createConnection({
			host: dbInfo.host,
			user: dbInfo.user,
			password: dbInfo.password,
			database: dbInfo.database
		});

		con.connect((err, result) => {
			if (err) throw err;
			console.log(`Conexão realizada no host: ${dbInfo.host}\nuser: ${dbInfo.user}\ndatabase: ${dbInfo.database}`)
		});
		global.con = con;

		sql.mostrarTabelas(con, dbInfo.database, (tableNames) => {
			dbInfo.tableNames = tableNames;
			global.dbInfo = dbInfo;
			res.redirect('/selectTable');
		});

	},
	
	tablesPage: (req, res) => {
		res.render('selecionarTabela.ejs', {dbInfo});
	},

	visualizationPage: (req, res) => {
		let tableName = req.params.tableName;

		sql.separarEmTextoENumero(con, tableName, (textAttributes, numericAttributes) => {
			console.log(textAttributes);
			console.log(numericAttributes);

			res.render('visualization.ejs', {tableName, textAttributes, numericAttributes});
		});

	},

	uploadCsvPage: (req, res) => {
		res.render('inserirCSV.ejs');
	}
}