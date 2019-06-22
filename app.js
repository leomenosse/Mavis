const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const {connectionPage, connectToDB, tablesPage, visualizationPage, uploadCsvPage} = require('./routes/users');
const {getHomePage} = require('./routes/index');
const port = 3000;

app.set('port', process.env.port || port);
app.set('views', __dirname + '/views');
app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public'))); // configure express to use public folder
app.use(fileUpload());

app.get('/', getHomePage);
app.get('/connection', connectionPage);
app.post('/connection', connectToDB);
app.get('/selectTable', tablesPage);
app.get('/visualization/:tableName', visualizationPage);
app.get('/upload', uploadCsvPage);

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});