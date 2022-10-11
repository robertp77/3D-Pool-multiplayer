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
    async findmatch(name){
        //if(first){
        await this.dataRef.child('0/lobby/0').child(`${name}/name`).set(name)
        await this.dataRef.child('0/lobby/0').child(`${name}/opp`).set('none')
        //}
        let data=await this.dataRef.child('0/lobby').once('value')
        //return data.val()
        data=data.val()
        var turn=false
        for(let i=0;i<Object.values(data[0]).length;i++){
            console.log(Object.values(data[0])[i].name)
            const t=Object.keys(data[0])[i]
            console.log(t)
            console.log(name)
            if(Object.values(data[0])[i].name!=name){
                let ret=await this.dataRef.child('0/lobby/0').child(`${t}`).once('value')
                await this.dataRef.child('0/lobby/0').child(`${t}/opp`).set(name)
                ret=ret.val()
                ret.turn=turn
                console.log(ret)
                return ret
            }
            else{
                turn=true
            }
        }
        return null
    },
    async checkopp(name){
        let ans=await this.dataRef.child('0/lobby/0').child(`${name}/opp`).once('value')
        return ans.val()
    },
    async getobs(opp){
        let pax=await this.dataRef.child('0/lobby/0').child(`${opp}/pax`).once('value')
        let pay=await this.dataRef.child('0/lobby/0').child(`${opp}/pay`).once('value')
        let paz=await this.dataRef.child('0/lobby/0').child(`${opp}/paz`).once('value')
        let wx=await this.dataRef.child('0/lobby/0').child(`${opp}/wx`).once('value')
        let wy=await this.dataRef.child('0/lobby/0').child(`${opp}/wy`).once('value')
        let wz=await this.dataRef.child('0/lobby/0').child(`${opp}/wz`).once('value')
        let ax=await this.dataRef.child('0/lobby/0').child(`${opp}/ax`).once('value')
        let ay=await this.dataRef.child('0/lobby/0').child(`${opp}/ay`).once('value')
        let az=await this.dataRef.child('0/lobby/0').child(`${opp}/az`).once('value')
        let gx=await this.dataRef.child('0/lobby/0').child(`${opp}/gx`).once('value')
        let gy=await this.dataRef.child('0/lobby/0').child(`${opp}/gy`).once('value')
        let gz=await this.dataRef.child('0/lobby/0').child(`${opp}/gz`).once('value')
        let shot=await this.dataRef.child('0/lobby/0').child(`${opp}/shot`).once('value')
        return pax.val(),pay.val(),paz.val(),wx.val(),wy.val(),wz.val(),ax.val(),ay.val(),az.val(),gx.val(),gy.val(),gz.val(),shot.val()
    },
    async sendobs(opp,pax,pay,paz,wx,wy,wz,ax,ay,az,gx,gy,gz){
        await this.dataRef.child('0/lobby/0').child(`${opp}/pax`).set(pax)
        await this.dataRef.child('0/lobby/0').child(`${opp}/pay`).set(pay)
        await this.dataRef.child('0/lobby/0').child(`${opp}/paz`).set(paz)
        await this.dataRef.child('0/lobby/0').child(`${opp}/wx`).set(wx)
        await this.dataRef.child('0/lobby/0').child(`${opp}/wy`).set(wy)
        await this.dataRef.child('0/lobby/0').child(`${opp}/wz`).set(wz)
        await this.dataRef.child('0/lobby/0').child(`${opp}/ax`).set(ax)
        await this.dataRef.child('0/lobby/0').child(`${opp}/ay`).set(ay)
        await this.dataRef.child('0/lobby/0').child(`${opp}/az`).set(az)
        await this.dataRef.child('0/lobby/0').child(`${opp}/gx`).set(gx)
        await this.dataRef.child('0/lobby/0').child(`${opp}/gy`).set(gy)
        await this.dataRef.child('0/lobby/0').child(`${opp}/gz`).set(gz)
    },
    async sendshot(opp,ar){
        await this.dataRef.child('0/lobby/0').child(`${opp}/shot`).set(ar)
    }
}