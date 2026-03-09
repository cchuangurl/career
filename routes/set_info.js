var router = require('@koa/router')();

const set_infoController = require('../controllers/index').set_info;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await set_infoController.list(ctx)
});
//到新增資料頁
router.get('/inputpage/:id', async (ctx, next)=> {
    await set_infoController.inputpage(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id/:id2', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id2)
    await set_infoController.editpage(ctx,next)
});
//依參數id2取得資料
router.get('/lookone/:id/:id2', async(ctx, next)=> {
	await set_infoController.lookone(ctx)
});
//批次新增資料
router.get('/inputbatch/:id', async (ctx, next)=> {
    await set_infoController.batchinput(ctx,next)
});
//依參數no取得一筆資料
router.get('/find/:id/:no', async(ctx, next)=> {
	await set_infoController.findByNo(ctx)
});
//寫入一筆資料
router.post('/add/:id', async (ctx, next)=> {
	console.log(ctx.request.body);
	await set_infoController.create(ctx)
});
//依參數id刪除資料
router.get('/delete/:id/:id2', async (ctx, next)=> {
	await set_infoController.destroy(ctx)
});
//存回修正資料
router.post('/update/:id', async (ctx, next)=> {
	await set_infoController.update(ctx)
});
//依一個id2的set_info資料取回相應的Opendata
router.get('/getdata/:id/:id2', async (ctx, next)=> {
	await set_infoController.getopendata(ctx)
});






module.exports = router