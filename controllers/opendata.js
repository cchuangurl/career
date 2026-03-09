//載入相對應的model

module.exports = {
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
//到gonorthgate
async gonorthgate(ctx, next) {
  console.log("進入branch controller的gonorthgate");
  statusreport="由資料維管首頁進入本頁";
  var personID=ctx.params.id;
  const set_infolist=await Set_info.find({}).lean();
  await ctx.render("opendata/northgatepage" ,{
      statusreport,
      personID,
      set_infolist
  })
}
}//EOF export