//載入相對應的model
const Publish = require('../models/index').publish;
const Knowledge = require('../models/index').knowledge;
const Term = require('../models/index').term;
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
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
        console.log("type of knowledgelist:"+typeof(knowledgelist));
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
//依參數id檢視1筆資料
async lookone(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var classby=ctx.query.classby;
    var papertype=ctx.query.papertype;
    console.log("著作類別代碼: "+papertype);
    var typelabel=ctx.query.typelabel;
    console.log("publishID:"+ctx.params.id2);
    console.log("entered Publish.findById(ctx.params.id2)!!");
    var personID=ctx.params.id;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    var termlist;
    await Term.find({a15model:"publish"}).then(async terms=>{
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
    await Publish.findById(ctx.params.id2)
        .then(async publishx=>{
            console.log("publishx:"+publishx);
            let publish=encodeURIComponent(JSON.stringify(publishx));
            console.log("publish:"+publish);
            console.log("type of publish:"+typeof(publish));
            await ctx.render("publish/look1page",{
                termlist,
                publish,
                classby,
                papertype,
                typelabel,
                statusreport,
                personID
            })
        })
        .catch(err=>{
            console.log("Post.findById(ctx.params.id2) failed !!");
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
    var knowledgelist
    await Knowledge.find({}).then(async knowledges=>{
        //console.log("found knowledges:"+knowledges);
        console.log("type of knowledges:"+typeof(knowledges));
        console.log("type of 1st knowledge:"+typeof(knowledges[0]));
        //console.log("1st knowledge:"+knowledges[0].a15describe)
        console.log("No. of knowledge:"+knowledges.length)
        knowledgelist=knowledges;
        console.log("type of knowledges:"+typeof(knowledgelist));
    })
    .catch(err=>{
        console.log("Knowledge.find({}) failed !!");
        console.log(err)
    });
    
        let filepath=path.join(__dirname,"../public/csv/",datafile+'.csv');
        const results = [];
                // 讀取並解析 CSV 檔案
        await new Promise((resolve, reject) => {
            fs.createReadStream(filepath)
            .pipe(csv())
            .on('data', (data) => {
                //console.log("value of data:"+data.title);
                results.push(data)})
            .on('end',()=>{
                console.log("length of results:"+results.length);
                console.log("type of results:"+typeof(results));
                console.log("value type of results:"+typeof(results.valueOf()));
                console.log("value of 1st results:"+results[0].title);
                console.log("value of 2nd results:"+results[1].year);
                resolve();
            })
            .on('error', reject);
        });
                // 批次儲存到 MongoDB
        try {
            await Publish.insertMany(
            results.map(item => ({                
                a05knowledgeID:knowledgelist.find(ele=>ele.a15describe==item.title)._id,
                a10coauthor:item.coauthor,
                a15year:Date(item.year),
                a20title:item.title,
                a25book:item.book,
                a30collection:item.collection,
                a35editor:item.editor,
                a40part:item.part,
                a45volumn:item.volumn,
                a50issue:item.issue,
                a55startpage:Number(item.startpage),
                a60endpage:Number(item.endpage),
                a65publisher:item.publisher,
                a70website:item.website,
                a75city:item.city,       
                a99footnote:item.footnote
            }))
            );
        } catch (error) {
            console.error('寫入publish錯誤:', error);
            ctx.throw(500, '資料庫寫入失敗');
        }
        await ctx.redirect("/career/publish/"+personID+"?statusreport="+statusreport)
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
