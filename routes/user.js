var router = require('@koa/router')();

const userController = require('../controllers/index').user;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await userController.list(ctx)
});
//到新增資料頁
router.get('/inputpage/:id', async (ctx, next)=> {
    await userController.inputpage(ctx,next)
});
//寫入設定註冊帳號
router.post('/trans2user', async (ctx, next)=> {
	console.log(ctx.request.body);
	await userController.trans2user(ctx)
});
//到修正單筆資料頁
router.get('/editpage/:id/:id2', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id2)
    await userController.editpage(ctx,next)
});
//批次新增資料
router.get('/inputbatch/:id', async (ctx, next)=> {
    await userController.batchinput(ctx,next)
});
//依參數no取得一筆資料
router.get('/find/:id/:no', async(ctx, next)=> {
	await userController.findByNo(ctx)
});
//寫入一筆資料
router.post('/add/:id', async (ctx, next)=> {
	console.log(ctx.request.body);
	await userController.create(ctx)
});
//依參數id2刪除資料
router.get('/delete/:id/:id2', async (ctx, next)=> {
	await userController.destroy(ctx)
});
//存回修正資料
router.post('/update/:id', async (ctx, next)=> {
	await userController.update(ctx)
});
module.exports = router;
