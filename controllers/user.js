//載入相對應的model
const User = require('../models/index').user;
const Person = require('../models/index').person;
const Term = require('../models/index').term;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /career/user !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await User.find({}).then(async users=>{
        //console.log("found users:"+users);
        console.log("type of users:"+typeof(users));
        console.log("type of 1st user:"+typeof(users[0]));
        //console.log("1st user:"+users[0].a15account)
        console.log("No. of user:"+users.length)
        let userlist=encodeURIComponent(JSON.stringify(users));
        console.log("type of users:"+typeof(userlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("user/listpage",{
        //ctx.response.send({
            userlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("User.find({}) failed !!");
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
    var termlist,personlist;
    await Term.find({a15model:"user"}).then(async terms=>{
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
    await Person.find({}).then(async persons=>{
        //console.log("found persons:"+persons);
        console.log("type of persons:"+typeof(persons));
        console.log("type of 1st person:"+typeof(persons[0]));
        //console.log("1st person:"+persons[0].a10stage)
        console.log("No. of person:"+persons.length)
        personlist=encodeURIComponent(JSON.stringify(persons));
        console.log("type of persons:"+typeof(personlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("user/inputpage",{
        //ctx.response.send({
            personlist,
            termlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Person.find({}) failed !!");
        console.log(err)
    })
  },
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id2);
    console.log("entered user.findById(ctx.params.id2)!!");
    var personID=ctx.params.id;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    var termlist,personlist;
    await Term.find({a15model:"user"}).then(async terms=>{
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
    await Person.find({}).then(async persons=>{
        //console.log("found persons:"+persons);
        console.log("type of persons:"+typeof(persons));
        console.log("type of 1st person:"+typeof(persons[0]));
        //console.log("1st person:"+persons[0].a10stage)
        console.log("No. of person:"+persons.length)
        personlist=encodeURIComponent(JSON.stringify(persons));
        console.log("type of persons:"+typeof(personlist));        
    })
    .catch(err=>{
        console.log("Person.find({}) failed !!");
        console.log(err)
    })
    await User.findById(ctx.params.id2)
        .then(async userx=>{
            console.log("Userx:"+userx);
            let user=encodeURIComponent(JSON.stringify(userx));
            console.log("user:"+user);
            console.log("type of user:"+typeof(user));
            await ctx.render("user/editpage",{
                personlist,
                termlist, 
                user,
                statusreport,
                personID
            })
        })
        .catch(err=>{
            console.log("User.findById(ctx.params.id2) failed !!");
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
    var new_user = new User(ctx.request.body);
    console.log("got new_user:"+new_user.a15account);
    var personID=ctx.params.id;
    await new_user.save()
    .then(()=>{
        console.log("Saving new_user....");
    statusreport="儲存單筆user資料後進入本頁";
    ctx.redirect("/career/user/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("User.save() failed !!")
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
    var columnno=6;
    var userArray;
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
        userArray=new Array(lineno);

        let saveone=(async new_user=>{
                await new_user.save()
                .then(()=>{
                    console.log("Saved document:"+new_user.a15account)
                    })
                .catch((err)=>{
                    console.log("User.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            userArray[k]=new Array(columnno);
            for (let m=0;m<columnno;m++){
                userArray[k][m]=tempstore[m][k]
                //console.log(userArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of userArray:"+userArray[0][0]);
        console.log("read total lines:"+userArray.length);
        let sequence=Promise.resolve();
        userArray.forEach(function(userj){
            sequence=sequence.then(function(){
                var new_user = new User({
                    a05status:userj[0],
                    a10personID:userj[1],
                    a15account:userj[2],
                    a20password:userj[3],
                    a25group:userj[4],
                    a99footnote:userj[5]
                });//EOF new user
                    saveone(new_user)
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
        statusreport="完成user批次輸入";
        await ctx.redirect("/career/user/"+personID+"?statusreport="+statusreport)
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
    await User.deleteOne({_id: ctx.params.id2})
    .then(()=>{
        console.log("Deleted a user....");
    statusreport="刪除單筆用戶帳號後進入本頁";
    //ctx.res.end()
    ctx.redirect("/career/user/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("User.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await User.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newuser)=>{
        console.log("Saving new_user....:"+newuser);
    statusreport="更新單筆用戶帳號後進入本頁";
    ctx.redirect("/career/user/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("User.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
