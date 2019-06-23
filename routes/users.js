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

	manipulateVisualization: (req, res) => {
		let tableName = req.params.tableName;
		let latitudeField = req.body.latitude;
		let longitudeField = req.body.longitude;
		let markerAttributes = req.body.textAttr;
		let numericAttribute = req.body.numericAttr;

		sql.separarEmTextoENumero(con, tableName, (textAttributes, numericAttributes) => {
			console.log(textAttributes);
			console.log(numericAttributes);

			res.render('visualization.ejs', { tableName, 
				textAttributes, 
				numericAttributes,
				latitudeField,
				longitudeField,
				markerAttributes,
				numericAttribute });
		});
		
	},

	uploadCsvPage: (req, res) => {
		message = '';
		res.render('inserirCSV.ejs', {message});
	},

	manipulateCsv: (req, res) => {
		// if(!req.files){
		// 	return res.status(400).send("No files were uploaded.");
		// }

		let uploadedFile = req.files.uploadedFile;
		let fileExtension = uploadedFile.mimetype.split('/')[1];
		console.log(fileExtension);

		if (uploadedFile.mimetype === 'text/csv' || uploadedFile.mimetype === 'text/plain' || uploadedFile.mimetype === 'application/vnd.ms-excel'){
			//manipulação do csv
			console.log(uploadedFile);
		}
		else{
			message = "Formato de arquivo é inválido. Apenas '.csv' e '.txt' são permitidos"
			res.render('inserirCSV.ejs', {message});
		}
	}
}