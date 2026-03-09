//載入相對應的model
const Set_info = require('../models/index').set_info;
const Publish = require('../models/index').publish;
const Term = require('../models/index').term;
const {Storage}=require('@google-cloud/storage')
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const axios = require('axios')
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /career/set_info !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Set_info.find({}).then(async set_infos=>{
        //console.log("found set_infos:"+set_infos);
        console.log("type of set_infos:"+typeof(set_infos));
        console.log("type of 1st set_info:"+typeof(set_infos[0]));
        //console.log("1st set_info:"+set_infos[0].a15describe)
        console.log("No. of set_info:"+set_infos.length)
        let set_infolist=encodeURIComponent(JSON.stringify(set_infos));
        console.log("type of set_infos:"+typeof(set_infolist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("set_info/listpage",{
        //ctx.response.send({
            set_infolist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Set_info.find({}) failed !!");
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
        await ctx.render("set_info/inputpage",{
        //ctx.response.send({
            personID,
            statusreport
        })    
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id2);
    console.log("entered set_info.findById(ctx.params.id2)!!");
    var personID=ctx.params.id;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    var termlist,publishlist;
    await Term.find({a15model:"set_info"}).then(async terms=>{
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
    await Set_info.findById(ctx.params.id2)
        .then(async set_infox=>{
            console.log("Set_infox:"+set_infox);
            let set_info=encodeURIComponent(JSON.stringify(set_infox));
            console.log("set_info:"+set_info);
            console.log("type of set_info:"+typeof(set_info));
            await ctx.render("set_info/editpage",{
                set_info,
                termlist,
                publishlist,
                statusreport,
                personID
            })
        })
        .catch(err=>{
            console.log("Set_info.findById(ctx.params.id2) failed !!");
            console.log(err)
        })
},

//依參數id取得資料
retrieve(req,res){

},
//依參數no取得一筆資料
findByNo(req,res){

},

//寫入一筆set_info資料
async create(ctx,next){
    const ts = new Date().toLocaleString('sv-SE', { hour12: false }) .replace(/[- :]/g, '') .slice(0,14);   
    const datestring = ts.substring(0,8);
    const timestring = ts.substring(8);
    var old_set_info = ctx.request.body;
    old_set_info.a45date_of_get=datestring;
    old_set_info.a55preventer=timestring;
    var new_set_info = new Set_info(old_set_info);
    console.log("got new_set_info:"+new_set_info.a40describe);
    var personID=ctx.params.id;
    await new_set_info.save()
    .then(()=>{
        console.log("Saving new_set_info....");
    statusreport="儲存單筆set_info資料後進入本頁";
    ctx.redirect("/career/set_info/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Set_info.save() failed !!")
        console.log(err)
    })
},
//依一個set_info資料取回相應的Opendata
async getopendata(ctx,next){
    var statusreport=ctx.request.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    try {    
    await Set_info.findById(ctx.params.id2)
        .then(async set_infox=>{
      // 1) 取參數（支援 query 或 body）
      
      const archive_url = (set_infox.a05archive_url || '').trim();
      const unitID = (set_infox.a10unitID || '').trim();

      // 這些通常是數字
      const data_volume = set_infox.a15data_volume !== undefined ? Number(set_infox.a15data_volume) : undefined;
      const skip = set_infox.a20skip !== undefined ? Number(set_infox.a20skip) : undefined;

      // filter / order 可能是字串或 JSON（前端可能送物件）
      const filter = set_infox.a25filter;
      const order = set_infox.a30order;
      const datestring = set_infox.a45date_of_get;
      const filekeyword = set_infox.a50filename_part;
      const timestring = set_infox.a55preventer;
      /*
      // 2) 基本檢核
      if (!archive_url) ctx.throw(400, 'archive_url is required');
      if (!unitID) ctx.throw(400, 'unitID is required');
      if (!Number.isFinite(data_volume) || data_volume <= 0) ctx.throw(400, 'data_volume must be a positive number');
      if (!Number.isFinite(skip) || skip < 0) ctx.throw(400, 'skip must be a non-negative number');
      
      // 3) 組 URL（用 URL + searchParams 最穩）
      //    注意：政府平台 API 的參數命名可能不同（limit/offset 或 $top/$skip 等）
      //    你既然已經前端會送 filter/order，這裡採「原樣帶上」並加上 data_volume/skip
      const urlObj = new URL(archive_url);
    
      // 常見分頁參數：limit/offset（你也可改成 $top/$skip 等）
      urlObj.searchParams.set('$top', String(data_volume));
      urlObj.searchParams.set('$skip', String(skip));

      // 你的欄位：unitID / filter / order
      // unitID 有些 API 可能叫 resource_id/datasetId…，你若確定參數名不同，改這裡即可
      urlObj.searchParams.set('UnitId', unitID);
    
      
      if (filter !== undefined && filter !== null && filter !== '') {
        // 若 filter 是物件，轉成 JSON 字串；若已是字串就直接帶
        const filterValue = typeof filter === 'string' ? filter : JSON.stringify(filter);
        //urlObj.searchParams.set('$filter', filterValue);
      }
    
      if (order !== undefined && order !== null && order !== '') {
        const orderValue = typeof order === 'string' ? order : JSON.stringify(order);
        urlObj.searchParams.set('$order', orderValue);
      }
    */
      const finalUrl =archive_url+"?"+filter;

      // 4) 後端用 axios 去抓（後端打第三方不會有 browser CORS 問題）
      const res = await axios.get(finalUrl, {
        timeout: 60_000,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'koa2-opendata-fetcher/1.0',
        },
        // axios 會自動 parse JSON（前提是 content-type 看起來像 json）
        responseType: 'json',
        validateStatus: (s) => s >= 200 && s < 300,
      });

      const data = res.data;

      // 5) 存到 GCS（建議用時間戳 + skip 做版本）
      const storage=new Storage();
      const bucketName='cchuang_deep1';
      const bucket = storage.bucket(bucketName);
      //const ts = new Date().toISOString().replace(/[:.]/g, '-'); // 2026-02-15T01-02-03-456Z
      const filename=datestring+filekeyword+timestring+".json";
      const objectPath = `opendata/${filename}`;

      const file = bucket.file(objectPath);

      // 將 JSON stringify 存檔（若資料很大可改用 stream）
      const body = JSON.stringify(
        {
          fetched_at: new Date().toISOString(),
          request: {
            archive_url,
            unitID,
            data_volume,
            skip,
            filter,
            order,
            finalUrl,
          },
          data,
        },
        null,
        2
      );

      await file.save(body, {
        contentType: 'application/json; charset=utf-8',
        resumable: true,
        metadata: {
          cacheControl: 'no-store',
        },
      });

      // 6) 回前端結果
      ctx.status = 200;
      /*
      ctx.body = {
        ok: true,
        message: 'Fetched JSON and saved to GCS.',
        gcs: {
          bucket: bucketName,
          object: objectPath,
        },
        request: {
          finalUrl,
        },
        // 如果資料很大，不建議把 data 整包回前端；可以只回筆數或摘要
        // data_preview: data,
      };
      */
     console.log("取回的首筆資料:"+data[0]);
     console.log("取回的末筆資料:"+data[data.length-1]);
    statusreport=filekeyword+"取回存到gcs後進入本頁";
    ctx.redirect("/career/set_info/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Set_info.findById() failed !!")
        console.log(err)
    })
    } catch (err) {
      // axios 失敗時，把對方回應帶出來方便除錯
      const status = err.response?.status;
      const detail = err.response?.data;

      ctx.status = status || 500;
      ctx.body = {
        ok: false,
        error: err.message,
        status,
        detail,
      };
    }
},
//批次新增set_info資料
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
        await Set_info.insertMany(
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
        console.error('寫入set_info錯誤:', error);
        ctx.throw(500, '資料庫寫入失敗');
    }
    await ctx.redirect("/career/set_info/"+personID+"?statusreport="+statusreport)
},
//批次更新資料
async batchupdate(ctx, next){
    var statusreport=ctx.query.statusreport;
    var personID=ctx.params.id;
    //await Set_info.updateMany({a60is4download:true},{$set:{a60is4download:false}})
    await Set_info.updateMany({a20filename:/2025/i},{$set:{a60is4download:true}})
    .then(()=>{
        console.log("Updating new_set_info....");
    statusreport="更新n筆set_info資料後進入本頁";
    ctx.redirect("/career/set_info/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Set_info.updateMany() failed !!")
        console.log(err)
    });
},

//依參數id刪除資料
async destroy(ctx,next){
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Set_info.deleteOne({_id: ctx.params.id2})
    .then(()=>{
        console.log("Deleted a set_info....");
    statusreport="刪除單筆知識訊息後進入本頁";
    //ctx.res.end()
    ctx.redirect("/career/set_info/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Set_info.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Set_info.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newset_info)=>{
        console.log("Saving new_set_info....:"+newset_info);
    statusreport="更新單筆知識訊息後進入本頁";
    ctx.redirect("/career/set_info/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Set_info.findOneAndUpdate() failed !!")
        console.log(err)
    })
},
//依參數id下戴一個檔案
async downloadone(ctx,next){
    console.log("進入set_info controller的downloadone");
  /*var classby=ctx.query.classby;
  var papertype=ctx.query.papertype;
  console.log("著作類別代碼: "+papertype);
  var typelabel=ctx.query.typelabel;
  var statusreport=ctx.query.statusreport;
  var personID=ctx.params.id;
  var set_infoID=ctx.params.id2;
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