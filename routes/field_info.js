var router = require('@koa/router')();

const field_infoController = require('../controllers/index').field_info;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await field_infoController.list(ctx)
});
//到新增資料頁
router.get('/inputpage/:id', async (ctx, next)=> {
    await field_infoController.inputpage(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id/:id2', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id2)
    await field_infoController.editpage(ctx,next)
});
//依參數id2取得資料
router.get('/lookone/:id/:id2', async(ctx, next)=> {
	await field_infoController.lookone(ctx)
});
//批次新增資料
router.get('/inputbatch/:id', async (ctx, next)=> {
    await field_infoController.batchinput(ctx,next)
});
//依參數no取得一筆資料
router.get('/find/:id/:no', async(ctx, next)=> {
	await field_infoController.findByNo(ctx)
});
//寫入一筆資料
router.post('/add/:id', async (ctx, next)=> {
	console.log(ctx.request.body);
	await field_infoController.create(ctx)
});
//依參數id刪除資料
router.get('/delete/:id/:id2', async (ctx, next)=> {
	await field_infoController.destroy(ctx)
});
//存回修正資料
router.post('/update/:id', async (ctx, next)=> {
	await field_infoController.update(ctx)
});
module.exports = router