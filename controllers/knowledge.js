//載入相對應的model
const Knowledge = require('../models/index').knowledge;
const Publish = require('../models/index').publish;
const Term = require('../models/index').term;
const {Storage}=require('@google-cloud/storage')
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /career/knowledge !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Knowledge.find({}).then(async knowledges=>{
        //console.log("found knowledges:"+knowledges);
        console.log("type of knowledges:"+typeof(knowledges));
        console.log("type of 1st knowledge:"+typeof(knowledges[0]));
        //console.log("1st knowledge:"+knowledges[0].a15describe)
        console.log("No. of knowledge:"+knowledges.length)
        let knowledgelist=encodeURIComponent(JSON.stringify(knowledges));
        console.log("type of knowledges:"+typeof(knowledgelist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("knowledge/listpage",{
        //ctx.response.send({
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


//到新增資料頁
async inputpage(ctx, next) {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	var termlist,publishlist;
    await Term.find({a15model:"knowledge"}).then(async terms=>{
      console.log("type of terms:"+typeof(terms));
      console.log("type of 1st term:"+typeof(terms[0]));
      console.log("1st term:"+terms[0])
      console.log("No. of term:"+terms.length)
      termlist=encodeURIComponent(JSON.stringify(terms));
      console.log("type of termlist:"+typeof(termlist));
      })
      .catch(err=>{
          console.log("Term.find({}) failed !!");
          console.log(err)
      })
    await Publish.find({}).then(async publishs=>{
        //console.log("found publishs:"+publishs);
        console.log("type of publishs:"+typeof(publishs));
        console.log("type of 1st publish:"+typeof(publishs[0]));
        //console.log("1st publish:"+publishs[0].a10stage)
        console.log("No. of publish:"+publishs.length)
        publishlist=encodeURIComponent(JSON.stringify(publishs));
        console.log("type of publishs:"+typeof(publishlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("knowledge/inputpage",{
        //ctx.response.send({
            publishlist,
            termlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Publish.find({}) failed !!");
        console.log(err)
    })
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id2);
    console.log("entered knowledge.findById(ctx.params.id2)!!");
    var personID=ctx.params.id;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    var termlist,publishlist;
    await Term.find({a15model:"knowledge"}).then(async terms=>{
      console.log("type of terms:"+typeof(terms));
      console.log("type of 1st term:"+typeof(terms[0]));
      console.log("1st term:"+terms[0])
      console.log("No. of term:"+terms.length)
      termlist=encodeURIComponent(JSON.stringify(terms));
      console.log("type of termlist:"+typeof(termlist));
      })
      .catch(err=>{
          console.log("Term.find({}) failed !!");
          console.log(err)
      })
    await Publish.find({}).then(async publishs=>{
        //console.log("found publishs:"+publishs);
        console.log("type of publishs:"+typeof(publishs));
        console.log("type of 1st publish:"+typeof(publishs[0]));
        //console.log("1st publish:"+publishs[0].a10stage)
        console.log("No. of publish:"+publishs.length)
        publishlist=encodeURIComponent(JSON.stringify(publishs));
        console.log("type of publishs:"+typeof(publishlist));        
    })
    .catch(err=>{
        console.log("Publish.find({}) failed !!");
        console.log(err)
    })
    await Knowledge.findById(ctx.params.id2)
        .then(async knowledgex=>{
            console.log("Knowledgex:"+knowledgex);
            let knowledge=encodeURIComponent(JSON.stringify(knowledgex));
            console.log("knowledge:"+knowledge);
            console.log("type of knowledge:"+typeof(knowledge));
            await ctx.render("knowledge/editpage",{
                knowledge,
                termlist,
                publishlist,
                statusreport,
                personID
            })
        })
        .catch(err=>{
            console.log("Knowledge.findById(ctx.params.id2) failed !!");
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
    var new_knowledge = new Knowledge(ctx.request.body);
    console.log("got new_knowledge:"+new_knowledge.a15describe);
    var personID=ctx.params.id;
    await new_knowledge.save()
    .then(()=>{
        console.log("Saving new_knowledge....");
    statusreport="儲存單筆knowledge資料後進入本頁";
    ctx.redirect("/career/knowledge/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Knowledge.save() failed !!")
        console.log(err)
    })
},
//批次新增資料
async batchinput(ctx, next){
    var statusreport=ctx.query.statusreport;
    var datafile=ctx.query.datafile;
    console.log("got the name of datafile:"+datafile);
    var personID=ctx.params.id;
    let filepath=path.join(__dirname,"../public/csv/",datafile+'.csv');
    const results = [];
            // 讀取並解析 CSV 檔案
    await new Promise((resolve, reject) => {
        fs.createReadStream(filepath)
        .pipe(csv())
        .on('data', (data) => {
            console.log("value of data:"+data.describe);
            results.push(data)})
        .on('end',()=>{
            console.log("length of results:"+results.length);
            console.log("value of results:"+results[0].describe);
            console.log("type of results:"+typeof(results));
            console.log("value type of results:"+typeof(results.valueOf()));
            console.log("value of 1st results:"+results[0].describe);
            console.log("value of 2nd results:"+results[1].date);
            console.log("the csvdata before parse:"+results)
            console.log("the csvdata after parse:"+results);
            resolve();
        })
        .on('error', reject);
    });
            // 批次儲存到 MongoDB
    try {
        await Knowledge.insertMany(
        results.map(item => ({
            a05domain:item.domain,
            a15describe:item.describe,
            a20filename:item.filename,
            a25alias:item.alias,
            a30explicit:item.explicit,
            a35category:item.category,
            a40course:item.course,
            a50date:item.date,
            a55reveal:item.reveal,
            a60is4download:Boolean(item.is4download),        
            a99footnote:item.footnote
        }))
        );
    } catch (error) {
        console.error('寫入knowledge錯誤:', error);
        ctx.throw(500, '資料庫寫入失敗');
    }
    await ctx.redirect("/career/knowledge/"+personID+"?statusreport="+statusreport)
},
//批次更新資料
async batchupdate(ctx, next){
    var statusreport=ctx.query.statusreport;
    var personID=ctx.params.id;
    //await Knowledge.updateMany({a60is4download:true},{$set:{a60is4download:false}})
    await Knowledge.updateMany({a20filename:/2025/i},{$set:{a60is4download:true}})
    .then(()=>{
        console.log("Updating new_knowledge....");
    statusreport="更新n筆knowledge資料後進入本頁";
    ctx.redirect("/career/knowledge/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Knowledge.updateMany() failed !!")
        console.log(err)
    });
},

//依參數id刪除資料
async destroy(ctx,next){
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Knowledge.deleteOne({_id: ctx.params.id2})
    .then(()=>{
        console.log("Deleted a knowledge....");
    statusreport="刪除單筆知識訊息後進入本頁";
    //ctx.res.end()
    ctx.redirect("/career/knowledge/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Knowledge.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Knowledge.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newknowledge)=>{
        console.log("Saving new_knowledge....:"+newknowledge);
    statusreport="更新單筆知識訊息後進入本頁";
    ctx.redirect("/career/knowledge/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Knowledge.findOneAndUpdate() failed !!")
        console.log(err)
    })
},
//依參數id下戴一個檔案
async downloadone(ctx,next){
    console.log("進入knowledge controller的downloadone");
  /*var classby=ctx.query.classby;
  var papertype=ctx.query.papertype;
  console.log("著作類別代碼: "+papertype);
  var typelabel=ctx.query.typelabel;
  var statusreport=ctx.query.statusreport;
  var personID=ctx.params.id;
  var knowledgeID=ctx.params.id2;
  */
  var filename=ctx.params.id2+".pdf";
  console.log("filename:"+filename);
  // GCS 中的完整路徑 (注意：不要以 / 開頭)
    const gcsFilePath = `pdf4download/${filename}`;
  const storage=new Storage();
  const bucketName='cchuang_deep1';
const bucket = storage.bucket(bucketName);
    const file = bucket.file(gcsFilePath);

    // 1. 檢查檔案是否存在 (選配，增加穩定性)
    const [exists] = await file.exists();
    if (!exists) {
      ctx.status = 404;
      ctx.body = "檔案不存在";
      return;
    }

    // 2. 設定 Header
    ctx.set('Content-Type', 'application/pdf');
    // attachment 會強制瀏覽器下載而非預覽
    ctx.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);

    // 3. 串流處理
    // 直接將 GCS 的 ReadStream 丟給 ctx.body
    ctx.body = file.createReadStream();

    // 錯誤處理
    ctx.body.on('error', (err) => {
      console.error('GCS stream error:', err);
      ctx.status = 500;
    });
  }
}//EOF export
