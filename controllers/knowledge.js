//載入相對應的model
const Knowledge = require('../models/index').knowledge;
const Publish = require('../models/index').publish;
const Term = require('../models/index').term;
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
    var columnno=11;
    var knowledgeArray;
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
        knowledgeArray=new Array(lineno);

        let saveone=(async new_knowledge=>{
                await new_knowledge.save()
                .then(()=>{
                    console.log("Saved document:"+new_knowledge.a15describe)
                    })
                .catch((err)=>{
                    console.log("Knowledge.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            knowledgeArray[k]=new Array(columnno);
            for (let m=0;m<columnno;m++){
                knowledgeArray[k][m]=tempstore[m][k]
                //console.log(knowledgeArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of knowledgeArray:"+knowledgeArray[0][0]);
        console.log("read total lines:"+knowledgeArray.length);
        let sequence=Promise.resolve();
        knowledgeArray.forEach(function(knowledgej){
            sequence=sequence.then(function(){
                var new_knowledge = new Knowledge({
                    a05domain:knowledgej[0],
                    a15describe:knowledgej[1],
                    a20filename:knowledgej[2],
                    a25alias:knowledgej[3],
                    a30explicit:knowledgej[4],
                    a35category:knowledgej[5],
                    a40course:knowledgej[6],
                    a50date:knowledgej[7],
                    a55reveal:knowledgej[8],
                    a60is4download:knowledgej[9],
                    a99footnote:knowledgej[10]
                });//EOF new knowledge
                    saveone(new_knowledge)
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
        statusreport="完成knowledge批次輸入";
        await ctx.redirect("/career/knowledge/"+personID+"?statusreport="+statusreport)
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
}
}//EOF export
