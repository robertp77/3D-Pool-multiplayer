const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const auth = require('./authentication.js');
auth.setupAuthentication(app);
const { OAUTH } = require('./secrets.js');
const cors = require('cors');
const DataStore = require('./DataStore.js');
const corsGitlab = cors({
  origin: 'https://compsci290_2021spring.dukecs.io',
  credentials: true,
});
app.use(corsGitlab);
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
