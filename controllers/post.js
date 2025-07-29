//載入相對應的model
const Post = require('../models/index').post;
const User = require('../models/index').user;
const Term = require('../models/index').term;
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /career/post !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Post.find({}).then(async posts=>{
        //console.log("found posts:"+posts);
        console.log("type of posts:"+typeof(posts));
        console.log("type of 1st post:"+typeof(posts[0]));
        //console.log("1st post:"+posts[0].a20posttitle)
        console.log("No. of post:"+posts.length)
        let postlist=encodeURIComponent(JSON.stringify(posts));
        console.log("type of posts:"+typeof(postlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("post/listpage",{
        //ctx.response.send({
            postlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Post.find({}) failed !!");
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
    var termlist,userlist;
    await Term.find({a15model:"post"}).then(async terms=>{
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
    await User.find({}).then(async users=>{
        //console.log("found users:"+users);
        console.log("type of users:"+typeof(users));
        console.log("type of 1st user:"+typeof(users[0]));
        //console.log("1st user:"+users[0].a10stage)
        console.log("No. of user:"+users.length)
        userlist=encodeURIComponent(JSON.stringify(users));
        console.log("type of users:"+typeof(userlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("post/inputpage",{
        //ctx.response.send({
            userlist,
            termlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("User.find({}) failed !!");
        console.log(err)
    })	
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("postID:"+ctx.params.id2);
    console.log("entered post.findById(ctx.params.id2)!!");
    var personID=ctx.params.id;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    var termlist,userlist;
    await Term.find({a15model:"post"}).then(async terms=>{
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
    await User.find({}).then(async users=>{
        //console.log("found users:"+users);
        console.log("type of users:"+typeof(users));
        console.log("type of 1st user:"+typeof(users[0]));
        //console.log("1st user:"+users[0].a10stage)
        console.log("No. of user:"+users.length)
        userlist=encodeURIComponent(JSON.stringify(users));
        console.log("type of users:"+typeof(userlist));        
    })
    .catch(err=>{
        console.log("User.find({}) failed !!");
        console.log(err)
    })
    await Post.findById(ctx.params.id2)
        .then(async postx=>{
            console.log("Postx:"+postx);
            let post=encodeURIComponent(JSON.stringify(postx));
            console.log("post:"+post);
            console.log("type of post:"+typeof(post));
            await ctx.render("post/editpage",{
                post,
                termlist,
                userlist,
                statusreport,
                personID
            })
        })
        .catch(err=>{
            console.log("Post.findById(ctx.params.id2) failed !!");
            console.log(err)
        })
},

//依參數id檢視1筆資料
async lookone(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("postID:"+ctx.params.id2);
    console.log("entered post.findById(ctx.params.id2)!!");
    var personID=ctx.params.id;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    var termlist;
    await Term.find({a15model:"post"}).then(async terms=>{
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
    await Post.findById(ctx.params.id2)
        .then(async postx=>{
            console.log("Postx:"+postx);
            let post=encodeURIComponent(JSON.stringify(postx));
            console.log("post:"+post);
            console.log("type of post:"+typeof(post));
            await ctx.render("post/lookpage",{
                termlist,
                post,
                statusreport,
                personID
            })
        })
        .catch(err=>{
            console.log("Post.findById(ctx.params.id2) failed !!");
            console.log(err)
        })
},
//依參數no取得一筆資料
findByNo(req,res){

},

//寫入一筆資料
async create(ctx,next){
    var new_post = new Post(ctx.request.body);
    console.log("got new_post:"+new_post.a20posttitle);
    var personID=ctx.params.id;
    await new_post.save()
    .then(()=>{
        console.log("Saving new_post....");
    statusreport="儲存單筆post資料後進入本頁";
    ctx.redirect("/career/post/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Post.save() failed !!")
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
            console.log("value of data:"+data.reader);
            results.push(data)})
        .on('end',()=>{
            console.log("length of results:"+results.length);
            console.log("value of results:"+results[0].title);
            console.log("type of results:"+typeof(results));
            console.log("value type of results:"+typeof(results.valueOf()));
            console.log("value of 1st results:"+results[0].reader);
            console.log("value of 2nd results:"+results[1].date);
            console.log("the csvdata before parse:"+results)
            console.log("the csvdata after parse:"+results);
            resolve();
        })
        .on('error', reject);
    });
            // 批次儲存到 MongoDB
    try {
        await Post.insertMany(
        results.map(item => ({
            a05posttype:item.type,
            a10poster:item.poster,
            a15postdate:Date(item.date),
            a20posttitle:item.title,
            a25postcontent:item.content,
            a30reader:item.reader,
            a35showtype:item.showtype,
            a40datetodown:Date(item.datetodown),             
            a99footnote:item.footnote
        }))
        );
    } catch (error) {
        console.error('寫入post錯誤:', error);
        ctx.throw(500, '資料庫寫入失敗');
    }
    await ctx.redirect("/career/post/"+personID+"?statusreport="+statusreport)
},
//依參數id刪除資料
async destroy(ctx,next){
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Post.deleteOne({_id: ctx.params.id2})
    .then(()=>{
        console.log("Deleted a post....");
    statusreport="刪除單筆公告資料後進入本頁";
    //ctx.res.end()
    ctx.redirect("/career/post/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Post.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Post.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newpost)=>{
        console.log("Saving new_post....:"+newpost);
    statusreport="更新單筆公告資料後進入本頁";
    ctx.redirect("/career/post/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Post.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
