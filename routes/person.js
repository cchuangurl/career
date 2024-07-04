var router = require('@koa/router')();

const personController = require('../controllers/index').person;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await personController.list(ctx)
});
//到新增資料頁
router.get('/inputpage/:id', async (ctx, next)=> {
    await personController.inputpage(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id/:id2', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id2)
    await personController.editpage(ctx,next)
});
//批次新增資料
router.get('/inputbatch/:id', async (ctx, next)=> {
    await personController.batchinput(ctx,next)
});
//依參數id2取得資料
router.get('/:id/:id2', async(ctx, next)=> {
	await personController.retrieve(ctx)
});
//依參數no取得一筆資料
router.get('/find/:id/:no', async(ctx, next)=> {
	await personController.findByNo(ctx)
});
//寫入一筆資料
router.post('/add/:id', async (ctx, next)=> {
	console.log(ctx.request.body);
	await personController.create(ctx)
});
//依參數id刪除資料
router.get('/delete/:id/:id2', async (ctx, next)=> {
	await personController.destroy(ctx)
});
//依參數id更新資料
router.post('/update/:id', async (ctx, next)=> {
	await personController.update(ctx)
});
module.exports = router;
