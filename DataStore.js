const admin = require('firebase-admin');

// provide global access to initialized app database
const { FIREBASE_CONFIG } = require('./secrets');
admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_CONFIG),
    databaseURL: `https://${FIREBASE_CONFIG.project_id}-default-rtdb.firebaseio.com`,
});
const DB = admin.database();
module.exports = {
    // could store a local copy of the database data to reduce time querying,
    // but note that any "extra" data only here in server will be wiped out 
    // periodically when Heroku restarts server
    dataRef: DB.ref('data'),
    // return all the data
    async getData () {
        // NOT the data directly, get current snapshot of all data to process locally
        //console.log(this.dataRef.child('Location36n79').child('user1/name'))
        //console.log(lat)
        //this.dataRef.child('Location36n79').child('user1/curlong').set(long)
        //this.dataRef[0].Location36n79[0].curlat=lat;
        //this.dataRef[0].Location36n79[0].curlong=long;
        const snapshot = await this.dataRef.once('value');
        //console.log(snapshot);
        //console.log(this.dataRef.child(`${Location36n79}`))
        // return actual data held within snapshot (also has convenience functions like forEach to process the data)
        return snapshot.val();
        // note could catch possible errors here, but should be caught be "general" error middleware
    },
    async setlat(lat,name){
        this.dataRef.child('0/Location36n79/0').child(`${name}/0/curlat`).set(lat)
    },
    async setlong(long,name){
        this.dataRef.child('0/Location36n79/0').child(`${name}/0/curlong`).set(long)
    },
    async getriderlat(riderid){
        const snap=await this.dataRef.child('0/Location36n79/0').child(`${riderid}/0/curlat`).once('value')
        return snap.val()
    },
    async getriderlong(riderid){
        const snap=await this.dataRef.child('0/Location36n79/0').child(`${riderid}/0/curlong`).once('value')
        return snap.val()
    },
    async getusergive(name){
        const snap=await this.dataRef.child('0/Location36n79/0').child(`${name}/0`).once('value')
        //console.log(this.dataRef.child('0/Location36n79/0').child(`${name}/0`))
        return snap.val()
    },
    async changegive(name){
        this.dataRef.child('0/Location36n79/0').child(`${name}/0/giving`).set("True")
    },
    async changegivefalse(name){
        this.dataRef.child('0/Location36n79/0').child(`${name}/0/giving`).set("False")
    },
    async changerequested(name){
        this.dataRef.child('0/Location36n79/0').child(`${name}/0/requested`).set("True")
    },
    async changerequestedfalse(name){
        this.dataRef.child('0/Location36n79/0').child(`${name}/0/requested`).set("False")
    },
    async newUser(id,name){
        this.dataRef.child('0').child(`${id}/0/name`).set(`${id}`)
        this.dataRef.child('0').child(`${id}/0/acname`).set(`${name}`)
    },
    async sendride(name,requestedpickuplong,requestedpickuplat,requesteddropofflong,requesteddropofflat){
        await this.dataRef.child('0/Location36n79/0').child(`${name}/0/requestedpickuplong`).set(requestedpickuplong)
        await this.dataRef.child('0/Location36n79/0').child(`${name}/0/requestedpickuplat`).set(requestedpickuplat)
        await this.dataRef.child('0/Location36n79/0').child(`${name}/0/requesteddropofflong`).set(requesteddropofflong)
        await this.dataRef.child('0/Location36n79/0').child(`${name}/0/requesteddropofflat`).set(requesteddropofflat)
    },
    async sendmiles(cost,userid,riderid){
        let snap=await this.dataRef.child('0/Location36n79/0').child(`${userid}/0/score`).once('value')
        var score=snap.val()
        score+=cost
        await this.dataRef.child('0/Location36n79/0').child(`${userid}/0/score`).set(score)
        let snap2=await this.dataRef.child('0/Location36n79/0').child(`${riderid}/0/score`).once('value')
        var score2=snap2.val()
        score2-=cost
        await this.dataRef.child('0/Location36n79/0').child(`${riderid}/0/score`).set(score2)
    },
    async grabscore(name){
        let snap=await this.dataRef.child('0/Location36n79/0').child(`${name}/0/score`).once('value')
        return snap.val()
    },
    async findmatch(name,first=false){
        if(first){
            await this.dataRef.child('0/lobby/0').child(`${name}/0`).set(name)
        }
        let data=await this.dataRef.child('0/lobby').once('value')
        var turn=false
        for(let i=0;i<Object.values(data[0]).length;i++){
            if(Object.values(data[0])[i]!=name){
                return Object.values(data[0])[i],turn
            }
            else{
                turn=true
            }
        }
        await this.findmatch(name)
    },
    async getobs(opp){
        let pax=await this.dataRef.child('0/lobby/0').child(`${opp}/0/pax`).once('value')
        let pay=await this.dataRef.child('0/lobby/0').child(`${opp}/0/pay`).once('value')
        let paz=await this.dataRef.child('0/lobby/0').child(`${opp}/0/paz`).once('value')
        let wx=await this.dataRef.child('0/lobby/0').child(`${opp}/0/wx`).once('value')
        let wy=await this.dataRef.child('0/lobby/0').child(`${opp}/0/wy`).once('value')
        let wz=await this.dataRef.child('0/lobby/0').child(`${opp}/0/wz`).once('value')
        let ax=await this.dataRef.child('0/lobby/0').child(`${opp}/0/ax`).once('value')
        let ay=await this.dataRef.child('0/lobby/0').child(`${opp}/0/ay`).once('value')
        let az=await this.dataRef.child('0/lobby/0').child(`${opp}/0/az`).once('value')
        let gx=await this.dataRef.child('0/lobby/0').child(`${opp}/0/gx`).once('value')
        let gy=await this.dataRef.child('0/lobby/0').child(`${opp}/0/gy`).once('value')
        let gz=await this.dataRef.child('0/lobby/0').child(`${opp}/0/gz`).once('value')
        return pax.val(),pay.val(),paz.val(),wx.val(),wy.val(),wz.val(),ax.val(),ay.val(),az.val(),gx.val(),gy.val(),gz.val()
    },
    async sendobs(opp,pax,pay,paz,wx,wy,wz,ax,ay,az,gx,gy,gz){
        await this.dataRef.child('0/lobby/0').child(`${opp}/0/pax`).set(pax)
        await this.dataRef.child('0/lobby/0').child(`${opp}/0/pay`).set(pay)
        await this.dataRef.child('0/lobby/0').child(`${opp}/0/paz`).set(paz)
        await this.dataRef.child('0/lobby/0').child(`${opp}/0/wx`).set(wx)
        await this.dataRef.child('0/lobby/0').child(`${opp}/0/wy`).set(wy)
        await this.dataRef.child('0/lobby/0').child(`${opp}/0/wz`).set(wz)
        await this.dataRef.child('0/lobby/0').child(`${opp}/0/ax`).set(ax)
        await this.dataRef.child('0/lobby/0').child(`${opp}/0/ay`).set(ay)
        await this.dataRef.child('0/lobby/0').child(`${opp}/0/az`).set(az)
        await this.dataRef.child('0/lobby/0').child(`${opp}/0/gx`).set(gx)
        await this.dataRef.child('0/lobby/0').child(`${opp}/0/gy`).set(gy)
        await this.dataRef.child('0/lobby/0').child(`${opp}/0/gz`).set(gz)
    }
}