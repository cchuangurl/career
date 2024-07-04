var router = require('@koa/router')();
const userController = require('../controllers/index').user;
const branchController = require('../controllers/index').branch;
//依帳號決定轉頁
router.post('/', async (ctx, next)=> {
	await branchController.dispatch(ctx)
});
//到訪客註冊頁
router.get('/register', async (ctx, next)=> {
  console.log("有讀到register router")
  await userController.registerpage(ctx,next)
});
//檢視使用手冊
router.get('/menu', async (ctx, next)=> {
  console.log("有讀到menu router")
  await branchController.seemenu(ctx,next)
});
//到outerweb
router.get('/goouterweb/:id', async (ctx, next)=> {
  await branchController.outerweb(ctx,next)
});
//到Maintainerweb
router.get('/gomaintainer/:id', async (ctx, next)=> {
  await branchController.maintainer(ctx,next)
});
//到KM
router.get('/goKM/:id', async (ctx, next)=> {
  await branchController.KM(ctx,next)
});
module.exports = router;
