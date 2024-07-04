//載入相對應的model
const Post = require('../models/index').post;
const User = require('../models/index').user;
const Term = require('../models/index').term;
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

//依參數id取得資料
retrieve(req,res){

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
    var columnno=9;
    var postArray;
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
        postArray=new Array(lineno);

        let saveone=(async new_post=>{
                await new_post.save()
                .then(()=>{
                    console.log("Saved document:"+new_post.a30mean)
                    })
                .catch((err)=>{
                    console.log("Post.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            postArray[k]=new Array(columnno);
            for (let m=0;m<columnno;m++){
                postArray[k][m]=tempstore[m][k]
                //console.log(postArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of postArray:"+postArray[0][0]);
        console.log("read total lines:"+postArray.length);
        let sequence=Promise.resolve();
        postArray.forEach(function(postj){
            sequence=sequence.then(function(){
                var new_post = new Post({
                    a05posttype:postj[0],
                    a10poster:postj[1],
                    a15postdate:postj[2],
                    a20posttitle:postj[3],
                    a25postcontent:postj[4],
                    a30reader:postj[5],
                    a35showtype:postj[6],
                    a40datetodown:postj[7],
                    a99footnote:postj[8]
                });//EOF new post
                    saveone(new_post)
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
        statusreport="完成post批次輸入";
        await ctx.redirect("/career/post/"+personID+"?statusreport="+statusreport)
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
