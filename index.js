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
app.get('/api/findmatch',
    async (req, res) => {
        await DataStore.findmatch(req.user?.id,first=true)
        //res.json(lat);
    });
app.get('/api/getobs',
    async (req, res) => {
        await DataStore.getobs(req.query.opp)
        //res.json(lat);
    });
app.get('/api/sendobs',
    async (req, res) => {
        await DataStore.getobs(req.user?.id,req.query.pax,req.query.pay,req.query.paz,req.query.wx,req.query.wy,req.query.wz,req.query.gx,req.query.gy,req.query.gz,req.query.ax,req.query.ay,req.query.az)
        //res.json(lat);
    });
