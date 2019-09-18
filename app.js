const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const {connectionPage, connectToDB, tablesPage, visualizationPage, manipulateVisualization, uploadCsvPage, manipulateCsv, signUpUser} = require('./routes/users');
const {getMainPage, getSignUpPage, getHomePage} = require('./routes/index');
const port = 3000;

app.set('port', process.env.port || port);
app.set('views', __dirname + '/views');
app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public'))); // configure express to use public folder
app.use(fileUpload());

app.get('/', getHomePage);
app.get('/cadastro', getSignUpPage);
app.post('/cadastro', signUpUser);
app.get('/main', getMainPage);
app.get('/connection', connectionPage);
app.post('/connection', connectToDB);
app.get('/selectTable', tablesPage);
app.get('/visualization/:tableName', visualizationPage);
app.post('/visualization/:tableName', manipulateVisualization);
app.get('/upload', uploadCsvPage);
app.post('/upload', manipulateCsv)

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});