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
        var ret=await DataStore.findmatch(req.user?.id)
        console.log(ret)
        res.status(200).json(ret);
    });
app.get('/api/checkopp',
    async (req, res) => {
        var ret=await DataStore.checkopp(req.user?.id)
        console.log(ret)
        res.status(200).json(ret);
    });
app.get('/api/findname',
    async (req, res) => {
        //let data=await DataStore.findmatch(req.user?.id,first=true)
        res.json(req.user?.id);
    });
app.get('/api/sendshot',
    async (req, res) => {
        await DataStore.sendshot(req.user?.id,req.query.ar)
    });
app.get('/api/getobs',
    async (req, res) => {
        let obs=await DataStore.getobs(req.query.opp)
        res.json(obs);
    });
app.get('/api/sendobs',
    async (req, res) => {
        await DataStore.sendobs(req.user?.id,req.query.pax,req.query.pay,req.query.paz,req.query.wx,req.query.wy,req.query.wz,req.query.ax,req.query.ay,req.query.az,req.query.gx,req.query.gy,req.query.gz)
        //res.json(lat);
    });
