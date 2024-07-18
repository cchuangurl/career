//載入相對應的model
const User = require('../models/index').user;
const Post = require('../models/index').post;
module.exports = {
//依帳號決定轉頁
async dispatch(ctx, next) {
  console.log("進入branch controller的dispatch");
  statusreport="由系統的暫用統一入口進入本頁";
  var {account}=ctx.request.body;
  var group;
  var pwaroute, personID;
  console.log("the account :"+account)
  await User.findOne({a15account:account}).then(async userx=>{
      console.log("userx:"+userx.a15account);
      console.log("group:"+userx.a25group);
      group=userx.a25group;
      personID=userx.a10personID;
      switch(group){
        case "admin":pwaroute="/career/branch/gomaintainer";break;
        case "developer":pwaroute="/career/branch/gomaintainer";break;
        case "management":pwaroute="/career/branch/gomaintainer";break;
        case "guest":pwaroute="/career/branch/goouterweb";break;
        default:pwarouter="/career/branch/goouterweb";personID="6689df70a49fa62c3249b7db";
      }
      await ctx.redirect(pwaroute+"/"+personID)
  })
  .catch(err=>{
      console.log("User.findOne() failed !!");
      console.log(err)
  })
},
//送出使用手冊檔案供下載
async seemenu(ctx, next) {
  const name ="20240606careermenu.pdf";
  // 引用需要的模組
  //const path=require("path");
  let folderpath="public/pdf/";
  let filepath=folderpath+name;
  console.log("going to download menu..."+filepath);
  ctx.attachment(decodeURI(filepath));
  await ctx.send(ctx, filepath)
},
//到outerweb
async outerweb(ctx, next) {
  console.log("進入branch controller的outerweb");
  statusreport="歡迎蒞臨瀏覽";
  var personID=ctx.params.id;
  var postlist;
  await Post.find({})    
    .then(async posts=>{;
        console.log("1st post:"+posts[0])
        console.log("No. of post:"+posts.length)
        let postchosen=new Array();
        for(let post of posts){
            //if(post.a35reader=="guest"||post.a35reader=="all"){
                postchosen.push(post)
            //}
        }
        console.log("No. of postchosen:"+postchosen.length);
        postlist=encodeURIComponent(JSON.stringify(postchosen));
        console.log("type of postlist:"+typeof(postlist));
    })
    .catch(err=>{
        console.log("Post.find({}) failed !!");
        console.log(err)
    })
  await ctx.render("branch/homepage" ,{
      statusreport,
      personID,
      postlist
  })
},
//到outerweb2
async outerweb2(ctx, next) {
  console.log("進入branch controller的outerweb");
  statusreport==ctx.query.statusreport;
  var personID="";
  var postlist;
  await Post.find({})    
    .then(async posts=>{;
        console.log("1st post:"+posts[0])
        console.log("No. of post:"+posts.length)
        let postchosen=new Array();
        for(let post of posts){
            //if(post.a35reader=="guest"||post.a35reader=="all"){
                postchosen.push(post)
            //}
        }
        console.log("No. of postchosen:"+postchosen.length);
        postlist=encodeURIComponent(JSON.stringify(postchosen));
        console.log("type of postlist:"+typeof(postlist));
    })
    .catch(err=>{
        console.log("Post.find({}) failed !!");
        console.log(err)
    })
  await ctx.render("branch/homepage" ,{
      statusreport,
      personID,
      postlist
  })
},
//到maintainertweb
async maintainer(ctx, next) {
  console.log("進入branch controller的maintainer");
  statusreport="以資料管理權限進入本頁";
  var personID=ctx.params.id;
  await ctx.render("branch/datamanage" ,{
      statusreport,
      personID
  })
}
}//EOF export
