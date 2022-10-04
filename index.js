const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const auth = require('./authentication.js');
const app=express()
auth.setupAuthentication(app);
const { OAUTH } = require('./secrets.js');
const cors = require('cors');
const DataStore = require('./DataStore.js');
const corsGitlab = cors({
  origin: 'https://compsci290_2021spring.dukecs.io',
  credentials: true,
});
app.use(corsGitlab);
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
