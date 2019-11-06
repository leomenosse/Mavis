const mysql = require('mysql');
const sql = require('../public/javascripts/sql.js');
const { promisify } = require('util');

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

	manipulateVisualization: async (req, res) => {

		let data = {
			tableName: req.params.tableName,
			latitudeField: req.body.latitude,
			longitudeField: req.body.longitude,
			textAttr: req.body.textAttr,
			numericAttr: req.body.numericAttr
		}
		let latValues = [];
		let longValues = [];
		let textValues = [];
		let numericValues = [];

		console.log(data);

		const syncQuery = promisify(con.query).bind(con);

		// DANDO SELECT NA LATITUDE E COLOCANDO NUM VETOR
		try{
			let resultLat = await syncQuery('SELECT `' + data.latitudeField + '` FROM ' + data.tableName);
			for (let i = 0; i < resultLat.length; i++) {
				latValues.push(resultLat[i][data.latitudeField]);
			}

			let resultLong = await syncQuery('SELECT `' + data.longitudeField + '` FROM ' + data.tableName);
			for (let i = 0; i < resultLong.length; i++) {
				longValues.push(resultLong[i][data.longitudeField]);
			}

			let sqlSelect = sql.montarQuery(data.textAttr, data.tableName);
			let resultTextAttr = await syncQuery(sqlSelect);
			for(let i = 0; i < resultTextAttr.length; i++){
				let text = '';
				for (let key in resultTextAttr[i]){
					text += resultTextAttr[i][key] + '<br>';
				}
				textValues.push(text);
			}

			let resultNumericAttr = await syncQuery('SELECT `' + data.numericAttr + '` FROM ' + data.tableName);
			for(let i = 0; i < resultNumericAttr.length; i++){
				numericValues.push(resultNumericAttr[i][data.numericAttr]);
			}

			console.log(latValues);
			console.log(longValues);
			console.log(textValues);
			console.log(numericValues);

			res.render('visualization.ejs', { latValues, longValues, textValues, numericValues });
		}
		catch(e){
			console.log(e);
		}		
		
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
	},

	signUpUser: (req, res) => {
		//criando a conexão com o banco de dados onde registramos os usuarios
		let signUpCon = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '123456',
			database: 'usuarios_mavis'
		});

		let usuario = req.body.usuario;
		let email = req.body.email;
		let senha = req.body.senha;
		console.log(usuario);
		console.log(email);
		console.log(senha);

		signUpCon.connect((err, result) => {
			if (err) throw err;
			console.log('Conexão realizada com sucesso');

			signUpCon.query('INSERT INTO usuarios VALUES(\"' + usuario + '\",\"' + email + '\",\"' + senha + '\")');
		});
	}
}