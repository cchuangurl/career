//載入相對應的model
const Term = require('../models/index').term;
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /career/term !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Term.find({}).then(async terms=>{
        //console.log("found terms:"+terms);
        console.log("type of terms:"+typeof(terms));
        console.log("type of 1st term:"+typeof(terms[0]));
        //console.log("1st term:"+terms[0].a30mean)
        console.log("No. of term:"+terms.length)
        let termlist=encodeURIComponent(JSON.stringify(terms));
        console.log("type of terms:"+typeof(termlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("term/listpage",{
        //ctx.response.send({
            termlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Term.find({}) failed !!");
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
	await ctx.render("term/inputpage",{
		statusreport,
        personID
	})
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id2);
    console.log("entered term.findById(ctx.params.id2)!!");
    var personID=ctx.params.id;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Term.findById(ctx.params.id2)
        .then(async termx=>{
            console.log("Termx:"+termx);
            let term=encodeURIComponent(JSON.stringify(termx));
            console.log("term:"+term);
            console.log("type of term:"+typeof(term));
            await ctx.render("term/editpage",{
                term,
                statusreport,
                personID
            })
        })
        .catch(err=>{
            console.log("Term.findById(ctx.params.id2) failed !!");
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
    var new_term = new Term(ctx.request.body);
    console.log("got new_term:"+new_term.a30mean);
    var personID=ctx.params.id;
    await new_term.save()
    .then(()=>{
        console.log("Saving new_term....");
    statusreport="儲存單筆term資料後進入本頁";
    ctx.redirect("/career/term/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Term.save() failed !!")
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
            console.log("type of results:"+typeof(results));
            console.log("value type of results:"+typeof(results.valueOf()));
            console.log("value of 1st results:"+results[0].code);
            console.log("value of 2nd results:"+results[1].mean);
            resolve();
        })
        .on('error', reject);
    });
            // 批次儲存到 MongoDB
    try {
        await Term.insertMany(
        results.map(item => ({
            a05project:item.project,
            a10database:item.database,
            a15model:item.model,
            a20field:item.field,
            a25code:item.code,
            a30mean:item.mean,       
            a99footnote:item.footnote
        }))
        );
    } catch (error) {
        console.error('寫入term錯誤:', error);
        ctx.throw(500, '資料庫寫入失敗');
    }
    await ctx.redirect("/career/term/"+personID+"?statusreport="+statusreport)
},
//依參數id刪除資料
async destroy(ctx,next){
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Term.deleteOne({_id: ctx.params.id2})
    .then(()=>{
        console.log("Deleted a term....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/career/term/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Term.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Term.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newterm)=>{
        console.log("Saving new_term....:"+newterm);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/career/term/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Term.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
