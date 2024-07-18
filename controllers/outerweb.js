//載入相對應的model
const Term = require('../models/index').term;
const Knowledge = require('../models/index').knowledge;
const Publish=require('../models/index').publish;
module.exports = {

//到學經歷類別頁
async showresumetype(ctx, next) {
  console.log("進入branch controller的showresumetype");
  var statusreport=ctx.query.statusreport;
  var personID=ctx.params.id;
  await ctx.render("outerweb/resumetypepage" ,{
      statusreport,
      personID
  })
},
//到著作類別頁
async showpapertype(ctx, next) {
  console.log("進入branch controller的showpapertype");
  var statusreport=ctx.query.statusreport;
  var personID=ctx.params.id;
  var termlist;
  await Term.find({a15model:"knowledge"}).then(async terms=>{
    console.log("type of terms:"+typeof(terms));
    console.log("type of 1st term:"+typeof(terms[0]));
    console.log("1st term:"+terms[0])
    console.log("No. of term:"+terms.length)
    termlist=encodeURIComponent(JSON.stringify(terms));
    console.log("type of termlist:"+typeof(termlist));
    
    await ctx.render("outerweb/papertypepage" ,{
      termlist,
      statusreport,
      personID
    })
    })
    .catch(err=>{
        console.log("Term.find({a15model:'knowledge'}) failed !!");
        console.log(err)
    })
},

//到免費下載類別頁
async showfreefiletype(ctx, next) {
  console.log("進入branch controller的showfreefiletype");
  var statusreport=ctx.query.statusreport;
  var personID=ctx.params.id;
  await ctx.render("outerweb/freefiletypepage" ,{
      statusreport,
      personID
  })
}
}//EOF export
