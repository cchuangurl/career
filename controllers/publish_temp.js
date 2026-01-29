//載入相對應的model
const Publish = require('../models/index').publish;
const Knowledge = require('../models/index').knowledge;
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
module.exports = {
//批次新增資料
async batchinput(ctx, next){
    var datafile=ctx.query.datafile;
    console.log("got the name of datafile:"+datafile);
    var knowledgelist
    await Knowledge.find({}).then(async knowledges=>{
        //console.log("found knowledges:"+knowledges);
        console.log("type of knowledges:"+typeof(knowledges));
        console.log("type of 1st knowledge:"+typeof(knowledges[0]));
        console.log("ID of 1st knowledge:"+knowledges[0]._id)
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
                a15year:item.year,
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
        await ctx.redirect("/career/publish/")
}
}//EOF export