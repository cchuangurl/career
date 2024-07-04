//載入相對應的model
const Publish = require('../models/index').publish;
const Knowledge = require('../models/index').knowledge;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /career/publish !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Publish.find({}).then(async publishs=>{
        //console.log("found publishs:"+publishs);
        console.log("type of publishs:"+typeof(publishs));
        console.log("type of 1st publish:"+typeof(publishs[0]));
        //console.log("1st publish:"+publishs[0].a20title)
        console.log("No. of publish:"+publishs.length)
        let publishlist=encodeURIComponent(JSON.stringify(publishs));
        console.log("type of publishs:"+typeof(publishlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("publish/listpage",{
        //ctx.response.send({
            publishlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Publish.find({}) failed !!");
        console.log(err)
    })
},


//到新增資料頁
async inputpage(ctx, next) {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    var knowledgelist
	await Knowledge.find({}).then(async knowledges=>{
        //console.log("found s:"+knowledgess);
        console.log("type of knowledges:"+typeof(knowledges));
        console.log("type of 1st knowledge:"+typeof(knowledges[0]));
        console.log("No. of knowledge:"+knowledges.length)
        knowledgelist=encodeURIComponent(JSON.stringify(knowledges));
        console.log("type of knowledgelist:"+typeof(knowledgehlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("publish/inputpage",{
            knowledgelist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Knowledge.find({}) failed !!");
        console.log(err)
    })
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id2);
    console.log("entered publish.findById(ctx.params.id2)!!");
    var personID=ctx.params.id;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    var knowledgelist
	await Knowledge.find({}).then(async knowledges=>{
        //console.log("found s:"+knowledgess);
        console.log("type of knowledges:"+typeof(knowledges));
        console.log("type of 1st knowledge:"+typeof(knowledges[0]));
        console.log("No. of knowledge:"+knowledges.length)
        knowledgelist=encodeURIComponent(JSON.stringify(knowledges));
        console.log("type of knowledgelist:"+typeof(knowledgehlist));
        })
    await Publish.findById(ctx.params.id2)
        .then(async publishx=>{
            console.log("Publishx:"+publishx);
            let publish=encodeURIComponent(JSON.stringify(publishx));
            console.log("publish:"+publish);
            console.log("type of publish:"+typeof(publish));
            await ctx.render("publish/editpage",{
                knowledgelist,
                publish,
                statusreport,
                personID
            })
        })
        .catch(err=>{
            console.log("Publish.findById(ctx.params.id2) failed !!");
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
    var new_publish = new Publish(ctx.request.body);
    console.log("got new_publish:"+new_publish.a20title);
    var personID=ctx.params.id;
    await new_publish.save()
    .then(()=>{
        console.log("Saving new_publish....");
    statusreport="儲存單筆publish資料後進入本頁";
    ctx.redirect("/career/publish/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Publish.save() failed !!")
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
    var columnno=16;
    var publishArray;
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
        publishArray=new Array(lineno);

        let saveone=(async new_publish=>{
                await new_publish.save()
                .then(()=>{
                    console.log("Saved document:"+new_publish.a20title)
                    })
                .catch((err)=>{
                    console.log("Publish.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            publishArray[k]=new Array(columnno);
            for (let m=0;m<columnno;m++){
                publishArray[k][m]=tempstore[m][k]
                //console.log(publishArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of publishArray:"+publishArray[0][0]);
        console.log("read total lines:"+publishArray.length);
        let sequence=Promise.resolve();
        publishArray.forEach(function(publishj){
            sequence=sequence.then(function(){
                var new_publish = new Publish({
                    a05knowledgeID:req.body.a05knowledgeID,
                    a10coauthor:publishj[1],
                    a15year:publishj[2],
                    a20title:publishj[3],
                    a25book:publishj[4],
                    a30collection:publishj[5],
                    a35editor:publishj[6],
                    a40part:publishj[7],
                    a45volumn:publishj[8],
                    a50issue:publishj[9],
                    a55startpage:publishj[10],
                    a60endpage:publishj[11],
                    a65publisher:publishj[12],
                    a70website:publishj[13],
                    a75city:publishj[14],
                    a99footnote:publishj[15]
                });//EOF new publish
                    saveone(new_publish)
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
        statusreport="完成publish批次輸入";
        await ctx.redirect("/career/publish/"+personID+"?statusreport="+statusreport)
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
    await Publish.deleteOne({_id: ctx.params.id2})
    .then(()=>{
        console.log("Deleted a publish....");
    statusreport="刪除單筆發表資訊後進入本頁";
    //ctx.res.end()
    ctx.redirect("/career/publish/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Publish.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Publish.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newpublish)=>{
        console.log("Saving new_publish....:"+newpublish);
    statusreport="更新單筆發表資訊後進入本頁";
    ctx.redirect("/career/publish/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Publish.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
