//載入相對應的model
const Message = require('../models/index').message;
const User = require('../models/index').user;
const Term = require('../models/index').term;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /career/message !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Message.find({}).then(async messages=>{
        //console.log("found messages:"+messages);
        console.log("type of messages:"+typeof(messages));
        console.log("type of 1st message:"+typeof(messages[0]));
        //console.log("1st message:"+messages[0].a20titleofmsg)
        console.log("No. of message:"+messages.length)
        let messagelist=encodeURIComponent(JSON.stringify(messages));
        console.log("type of messages:"+typeof(messagelist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("message/listpage",{
        //ctx.response.send({
            messagelist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Message.find({}) failed !!");
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
	var termlist,userlist,messagelist;
    await Message.find({}).then(async messages=>{
        console.log("type of messages:"+typeof(messages));
        console.log("type of 1st message:"+typeof(messages[0]));
        console.log("1st message:"+messages[0])
        console.log("No. of message:"+messages.length)
        messagelist=encodeURIComponent(JSON.stringify(messages));
        console.log("type of messagelist:"+typeof(messagelist));
        })
        .catch(err=>{
            console.log("Message.find({}) failed !!");
            console.log(err)
        })
    await Term.find({a15model:"message"}).then(async terms=>{
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
        await ctx.render("message/inputpage",{
        //ctx.response.send({
            messagelist,
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
    console.log("ID:"+ctx.params.id2);
    console.log("entered message.findById(ctx.params.id2)!!");
    var personID=ctx.params.id;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    var termlist,userlist,messagelist;
    await Message.find({}).then(async messages=>{
        console.log("type of messages:"+typeof(messages));
        console.log("type of 1st message:"+typeof(messages[0]));
        console.log("1st message:"+messages[0])
        console.log("No. of message:"+messages.length)
        messagelist=encodeURIComponent(JSON.stringify(messages));
        console.log("type of messagelist:"+typeof(messagelist));
        })
        .catch(err=>{
            console.log("Message.find({}) failed !!");
            console.log(err)
        })
    await Term.find({a15model:"message"}).then(async terms=>{
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
    await Message.findById(ctx.params.id2)
        .then(async messagex=>{
            console.log("Messagex:"+messagex);
            let message=encodeURIComponent(JSON.stringify(messagex));
            console.log("message:"+message);
            console.log("type of message:"+typeof(message));
            await ctx.render("message/editpage",{
                message,
                messagelist,
                termlist,
                userlist,
                statusreport,
                personID
            })
        })
        .catch(err=>{
            console.log("Message.findById(ctx.params.id2) failed !!");
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
    var new_message = new Message(ctx.request.body);
    console.log("got new_message:"+new_message.a20titleofmsg);
    var personID=ctx.params.id;
    await new_message.save()
    .then(()=>{
        console.log("Saving new_message....");
    statusreport="儲存單筆message資料後進入本頁";
    ctx.redirect("/career/message/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Message.save() failed !!")
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
    var messageArray;
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
        messageArray=new Array(lineno);

        let saveone=(async new_message=>{
                await new_message.save()
                .then(()=>{
                    console.log("Saved document:"+new_message.a20titleofmsg)
                    })
                .catch((err)=>{
                    console.log("Message.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            messageArray[k]=new Array(columnno);
            for (let m=0;m<columnno;m++){
                messageArray[k][m]=tempstore[m][k]
                //console.log(messageArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of messageArray:"+messageArray[0][0]);
        console.log("read total lines:"+messageArray.length);
        let sequence=Promise.resolve();
        messageArray.forEach(function(messagej){
            sequence=sequence.then(function(){
                var new_message = new Message({
                    a05ipofwriter:messagej[0],
                    a10writer:messagej[1],
                    a15dateofmsg:messagej[2],
                    a20titleofmsg:messagej[3],
                    a25message:messagej[4],
                    a30codelast:messagej[5],
                    a35codethis:messagej[6],
                    a40responsor:messagej[7],
                    a45response:messagej[8],
                    a50followact:messagej[9],
                    a99footnote:messagej[10]
                });//EOF new message
                    saveone(new_message)
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
        statusreport="完成message批次輸入";
        await ctx.redirect("/career/message/"+personID+"?statusreport="+statusreport)
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
    await Message.deleteOne({_id: ctx.params.id2})
    .then(()=>{
        console.log("Deleted a message....");
    statusreport="刪除單筆訪客留言後進入本頁";
    //ctx.res.end()
    ctx.redirect("/career/message/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Message.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Message.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newmessage)=>{
        console.log("Saving new_message....:"+newmessage);
    statusreport="更新單筆訪客留言後進入本頁";
    ctx.redirect("/career/message/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Message.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
