const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const auth = require('./authentication.js');
const app=express()
const cors = require('cors');
const DataStore = require('./DataStore.js');
const corsGitlab = cors({
  origin: 'https://young-escarpment-72389.herokuapp.com/',
  credentials: true,
});
app.use(corsGitlab);
auth.setupAuthentication(app);
const { OAUTH } = require('./secrets.js');
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
