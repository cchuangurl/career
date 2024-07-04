//載入相對應的model
const Userright = require('../models/index').userright;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /career/userright !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Userright.find({}).then(async userrights=>{
        //console.log("found userrights:"+userrights);
        console.log("type of userrights:"+typeof(userrights));
        console.log("type of 1st userright:"+typeof(userrights[0]));
        //console.log("1st userright:"+userrights[0].a05group)
        console.log("No. of userright:"+userrights.length)
        let userrightlist=encodeURIComponent(JSON.stringify(userrights));
        console.log("type of userrights:"+typeof(userrightlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("userright/listpage",{
        //ctx.response.send({
            userrightlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Userright.find({}) failed !!");
        console.log(err)
    })
},


//到新增資料頁
async inputpage(ctx, next) {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    var termlist
    await Term.find({a15model:"person"}).then(async terms=>{
      console.log("type of terms:"+typeof(terms));
      console.log("type of 1st term:"+typeof(terms[0]));
      console.log("1st term:"+terms[0])
      console.log("No. of term:"+terms.length)
      termlist=encodeURIComponent(JSON.stringify(terms));
      console.log("type of termlist:"+typeof(termlist));
      })
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("userright/inputpage",{
        //ctx.response.send({
            termlist,
            personID,
            statusreport
        })
    .catch(err=>{
        console.log("Term.find({}) failed !!");
        console.log(err)
    })
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id2);
    console.log("entered userright.findById(ctx.params.id2)!!");
    var personID=ctx.params.id;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Userright.findById(ctx.params.id2)
        .then(async userrightx=>{
            console.log("Userrightx:"+userrightx);
            let userright=encodeURIComponent(JSON.stringify(userrightx));
            console.log("userright:"+userright);
            console.log("type of userright:"+typeof(userright));
            await ctx.render("userright/editpage",{
                userright,
                statusreport,
                personID
            })
        })
        .catch(err=>{
            console.log("Userright.findById(ctx.params.id2) failed !!");
            console.log(err)
        })
},

//依參數id取得資料
retrieve(req,res){

},
//依參數no取得一筆資料
findByNo(req,res){

},

//寫入一筆資料
async create(ctx,next){
    var new_userright = new Userright(ctx.request.body);
    console.log("got new_userright:"+new_userright.a05group);
    var personID=ctx.params.id;
    await new_userright.save()
    .then(()=>{
        console.log("Saving new_userright....");
    statusreport="儲存單筆userright資料後進入本頁";
    ctx.redirect("/career/userright/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Userright.save() failed !!")
        console.log(err)
    })
},
//批次新增資料
async batchinput(ctx, next){
    var statusreport=ctx.query.statusreport;
    var datafile=ctx.query.datafile;
    console.log("got the name of datafile:"+datafile);
    var personID=ctx.params.id;
    // 引用需要的模組
    const fs = require('fs');
    const path=require("path");
    const readline = require('readline');
    // 逐行讀入檔案資料
    //定義輸出串流
    //var writeStream = fs.createWriteStream('out.csv');

    //定義讀入串流 (檔案置於/public目錄下)
    let filepath=path.join(__dirname,"../public/csv/");
    var lineReader = readline.createInterface({
        input: fs.createReadStream(filepath+datafile+'.csv')
    });
    var lineno=0;
    var columnno=7;
    var userrightArray;
    var tempstore=new Array(columnno);
    for (let i=0;i<columnno;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
        return new Promise((resolve,reject)=>{
    //當讀入一行資料時
    lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<columnno;i++){
            tempstore[i][lineno]=values[i].trim();
        }
        lineno++;
        console.log("read line:"+data)
    });//EOF lineReader.on
    resolve();
            })//EOF promise
    })//EOF readfile
    let savedata=(()=>{
        return new Promise((resolve, reject)=>{
        userrightArray=new Array(lineno);

        let saveone=(async new_userright=>{
                await new_userright.save()
                .then(()=>{
                    console.log("Saved document:"+new_userright.a05group)
                    })
                .catch((err)=>{
                    console.log("Userright.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            userrightArray[k]=new Array(columnno);
            for (let m=0;m<columnno;m++){
                userrightArray[k][m]=tempstore[m][k]
                //console.log(userrightArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of userrightArray:"+userrightArray[0][0]);
        console.log("read total lines:"+userrightArray.length);
        let sequence=Promise.resolve();
        userrightArray.forEach(function(userrightj){
            sequence=sequence.then(function(){
                var new_userright = new Userright({
                    a05group:userrightj[0],
                    a10operation:userrightj[1],
                    a15storage:userrightj[2],
                    a20scope:userrightj[3],
                    a25access:userrightj[4],
                    a30dboperate:userrightj[5],
                    a99footnote:userrightj[6]
                });//EOF new userright
                    saveone(new_userright)
                .catch(err=>{
                    console.log(err)
                })
            })//EOF sequence
            })//EOF forEach
            resolve();
        })//EOF promise
        })//EOF savedata
    await readfile()
    .then(()=>{
        setTimeout(savedata,3000)
    })
    .then(async ()=>{
        //console.log("going to list prject....");
        //ctx.redirect("/career/project/?statusreport="+statusreport)
        console.log("go back to datamanage1.ejs");
        statusreport="完成userright批次輸入";
        await ctx.redirect("/career/userright/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("ctx.redirect failed !!")
        console.log(err)
    })
},
//依參數id刪除資料
async destroy(ctx,next){
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Userright.deleteOne({_id: ctx.params.id2})
    .then(()=>{
        console.log("Deleted a userright....");
    statusreport="刪除單筆使用權限後進入本頁";
    //ctx.res.end()
    ctx.redirect("/career/userright/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Userright.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Userright.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newuserright)=>{
        console.log("Saving new_userright....:"+newuserright);
    statusreport="更新單筆使用權限後進入本頁";
    ctx.redirect("/career/userright/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Userright.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
