//載入相對應的model
const Person = require('../models/index').person;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /career/person !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Person.find({}).then(async persons=>{
        //console.log("found persons:"+persons);
        console.log("type of persons:"+typeof(persons));
        console.log("type of 1st person:"+typeof(persons[0]));
        //console.log("1st person:"+persons[0].a10visitor)
        console.log("No. of person:"+persons.length)
        let personlist=encodeURIComponent(JSON.stringify(persons));
        console.log("type of persons:"+typeof(personlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("person/listpage",{
        //ctx.response.send({
            personlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Person.find({}) failed !!");
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
	await ctx.render("person/inputpage",{
		statusreport,
        personID
	})
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id2);
    console.log("entered person.findById(ctx.params.id2)!!");
    var personID=ctx.params.id;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Person.findById(ctx.params.id2)
        .then(async personx=>{
            console.log("personx:"+personx);
            let person=encodeURIComponent(JSON.stringify(personx));
            console.log("person:"+person);
            console.log("type of person:"+typeof(person));
            await ctx.render("person/editpage",{
                person,
                statusreport,
                personID
            })
        })
        .catch(err=>{
            console.log("Person.findById(ctx.params.id2) failed !!");
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
    var new_person = new Person(ctx.request.body);
    console.log("got new_person:"+new_person.a10visitor);
    var personID=ctx.params.id;
    await new_person.save()
    .then(()=>{
        console.log("Saving new_person....");
    statusreport="儲存單筆person資料後進入本頁";
    ctx.redirect("/career/person/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("person.save() failed !!")
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
    var personArray;
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
        personArray=new Array(lineno);

        let saveone=(async new_person=>{
                await new_person.save()
                .then(()=>{
                    console.log("Saved document:"+new_person.a10visitor)
                    })
                .catch((err)=>{
                    console.log("Person.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            personArray[k]=new Array(columnno);
            for (let m=0;m<columnno;m++){
                personArray[k][m]=tempstore[m][k]
                //console.log(personArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of personArray:"+personArray[0][0]);
        console.log("read total lines:"+personArray.length);
        let sequence=Promise.resolve();
        personArray.forEach(function(personj){
            sequence=sequence.then(function(){
                var new_person = new Person({
                    a05ipofvisitor:personj[0],
                    a10visitor:personj[1],
                    a15dateofreg:personj[2],
                    a20phoneno:personj[3],
                    a25email:personj[4],
                    a30address:personj[5],
                    a35business:personj[6],
                    a40extra:personj[7],
                    a99footnote:personj[8]
                });//EOF new person
                    saveone(new_person)
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
        statusreport="完成person批次輸入";
        await ctx.redirect("/career/person/"+personID+"?statusreport="+statusreport)
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
    await Person.deleteOne({_id: ctx.params.id2})
    .then(()=>{
        console.log("Deleted a person....");
    statusreport="刪除單筆用戶個資後進入本頁";
    //ctx.res.end()
    ctx.redirect("/career/person/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Person.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Person.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newperson)=>{
        console.log("Saving new_person....:"+newperson);
    statusreport="更新單筆用戶個資後進入本頁";
    ctx.redirect("/career/person/"+personID+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Person.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
