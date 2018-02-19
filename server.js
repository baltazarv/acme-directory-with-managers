const db = require('./db');
const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const router = require('./routes');
const bodyParser = require('body-parser');

const nunjucks = require('nunjucks');
nunjucks.configure({ noCache: true });
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(bodyParser.urlencoded());
app.use(require('method-override')('_method'));

db.sync()
  .then(() => db.seed());

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use('/', router);

app.listen(port, () => {
  console.log(`Open http://localhost:${port}`);
});
