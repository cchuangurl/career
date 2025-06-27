//載入相對應的model
const Term = require('../models/index').term;
const Knowledge = require('../models/index').knowledge;
const Publish=require('../models/index').publish;

module.exports = {

//到學經歷類別頁
async showresumetype(ctx, next) {
  console.log("進入branch controller的showresumetype");
  var statusreport=ctx.query.statusreport;
  //var personID=ctx.params.id;
  await ctx.render("outerweb/resumetypepage" ,{
      statusreport,
      //personID
  })
},
//到著作類別頁
async showpapertype(ctx, next) {
  console.log("進入branch controller的showpapertype");
  var statusreport=ctx.query.statusreport;
  //var personID=ctx.params.id;
  var knowledgelist,termlist;
  await Knowledge.find({})
    .then(async knowledges=>{
    console.log("type of knowledges:"+typeof(knowledges));
    console.log("type of 1st knowledge:"+typeof(knowledges[0]));
    console.log("1st knowledge:"+knowledges[0])
    console.log("No. of knowledge:"+knowledges.length)
    knowledgelist=encodeURIComponent(JSON.stringify(knowledges));
    console.log("type of knowledgelist:"+typeof(knowledgelist));
    })
    .catch(err=>{
        console.log("Knowledge.find({}) failed !!");
        console.log(err)
    })
  await Term.find({a15model:"knowledge"}).then(async terms=>{
    console.log("type of terms:"+typeof(terms));
    console.log("type of 1st term:"+typeof(terms[0]));
    console.log("1st term:"+terms[0])
    console.log("No. of term:"+terms.length)
    termlist=encodeURIComponent(JSON.stringify(terms));
    console.log("type of termlist:"+typeof(termlist));
    
    await ctx.render("outerweb/papertypepage" ,{
      knowledgelist,
      termlist,
      statusreport,
      //personID
    })
    })
    .catch(err=>{
        console.log("Term.find({a15model:'knowledge'}) failed !!");
        console.log(err)
    })
},
//到某著作類別清單頁
async showsublist(ctx, next) {
  console.log("進入branch controller的showsublist");
  var classby=ctx.query.classby;
  var papertype=ctx.query.papertype;
  console.log("著作類別代碼: "+papertype);
  var typelabel=ctx.query.typelabel;
  var statusreport=ctx.query.statusreport;
  var personID=ctx.params.id;
  var knowledgelist,publishlist;
  /*
  await Term.find({$and:[{a15mode:"knowledge"},{a25code:papertype}]}).then(async term=>{
    typename=term.a30mean
  })
  */
  await Publish.find({}).then(async publishs=>{
    //console.log("found publishs:"+publishs);
    console.log("type of publishs:"+typeof(publishs));
    console.log("type of 1st publish:"+typeof(publishs[0]));
    //console.log("1st publish:"+publishs[0].a20title)
    console.log("No. of publish:"+publishs.length)
    publishlist=encodeURIComponent(JSON.stringify(publishs));
    console.log("type of publishlist:"+typeof(publishlist))
    })
    .catch(err=>{
        console.log("Publish.find({}) failed !!");
        console.log(err)
    })
  await Knowledge.find({$or:[{a30explicit:papertype},{a35category:papertype},{a40course:papertype}]})
    .then(async knowledges=>{
    console.log("type of knowledges:"+typeof(knowledges));
    console.log("type of 1st knowledge:"+typeof(knowledges[0]));
    console.log("1st knowledge:"+knowledges[0])
    console.log("No. of knowledge:"+knowledges.length)
    knowledgelist=encodeURIComponent(JSON.stringify(knowledges));
    console.log("type of knowledgelist:"+typeof(knowledgelist));
    
    await ctx.render("outerweb/papersublistpage" ,{
      publishlist,
      knowledgelist,
      classby,
      papertype,
      typelabel,
      statusreport,
      personID
    })
    })
    .catch(err=>{
        console.log("Knowledge.find({a30explicit:papertype}) failed !!");
        console.log(err)
    })
},
//到免費下載類別頁
async showfreefiletype(ctx, next) {
  console.log("進入branch controller的showfreefiletype");
  var statusreport=ctx.query.statusreport;
  var personID=ctx.params.id;
  var knowledgelist,termlist;
  await Knowledge.find({})
    .then(async knowledges=>{
    console.log("type of knowledges:"+typeof(knowledges));
    console.log("type of 1st knowledge:"+typeof(knowledges[0]));
    console.log("1st knowledge:"+knowledges[0])
    console.log("No. of knowledge:"+knowledges.length)
    knowledgelist=encodeURIComponent(JSON.stringify(knowledges));
    console.log("type of knowledgelist:"+typeof(knowledgelist));
    })
    .catch(err=>{
        console.log("Knowledge.find({}) failed !!");
        console.log(err)
    })
  await Term.find({a15model:"knowledge"}).then(async terms=>{
    console.log("type of terms:"+typeof(terms));
    console.log("type of 1st term:"+typeof(terms[0]));
    console.log("1st term:"+terms[0])
    console.log("No. of term:"+terms.length)
    termlist=encodeURIComponent(JSON.stringify(terms));
    console.log("type of termlist:"+typeof(termlist));
 
      await ctx.render("outerweb/freefiletypepage" ,{
        knowledgelist,
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
//到可下載著作清單頁
async downloadlist(ctx, next) {
  console.log("進入outerweb controller的downloadlist");
  var classby=ctx.query.classby;
  var papertype=ctx.query.papertype;
  console.log("著作類別代碼: "+papertype);
  var typelabel=ctx.query.typelabel;
  var statusreport=ctx.query.statusreport;
  var personID=ctx.params.id;
  var knowledgelist;
  /*
  const storage=new Storage({
    projectId:"deep0-340312",
    keyFilename:"./public/json/deep0-340312-ac0308c9dc4b.json"
    });
  const bucketName='cchuang-deep1';
  const [files] = await storage.bucket(bucketName).getFiles();
  */
    await Knowledge.find({$or:[{a30explicit:papertype},{a35category:papertype},{a40course:papertype}]})
    .then(async knowledges=>{
    console.log("type of knowledges:"+typeof(knowledges));
    console.log("type of 1st knowledge:"+typeof(knowledges[0]));
    console.log("1st knowledge:"+knowledges[0])
    console.log("No. of knowledge:"+knowledges.length)
    knowledgelist=encodeURIComponent(JSON.stringify(knowledges));
    console.log("type of knowledgelist:"+typeof(knowledgelist));
    /*
    let bucketurl="https://storage.cloud.google.com/cchuang-deep1/";
    var temppdfUrls=bucketurl+"2002eco_kno_eco_g21.pdf";
    for(let knowledgex of knowledges){
      let tempFile=files.filter(file=>file.name==knowledgex.a20filename);
      if(tempFile.length>0){
        temppdfUrls.push(bucketurl+tempFile.name)
      }
    }
    const pdfno=temppdfUrls.length;
    const pdfUrls=temppdfUrls;
    */    
    await ctx.render("outerweb/downloadpage" ,{
      //pdfno,
      //pdfUrls,
      knowledgelist,
      classby,
      papertype,
      typelabel,
      statusreport,
      personID
    })
    })
    .catch(err=>{
        console.log("Knowledge.find({a30explicit:papertype}) failed !!");
        console.log(err)
    })
}
}//EOF export
