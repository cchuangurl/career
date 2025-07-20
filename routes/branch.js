var router = require('@koa/router')();
const personController = require('../controllers/index').person;
const branchController = require('../controllers/index').branch;
//到訪客登入或申請頁
router.get('/signin', async (ctx, next)=> {
  console.log("有讀到register router")
  await branchController.signpage(ctx,next)
});
//singin後依帳號決定轉頁
router.post('/', async (ctx, next)=> {
	await branchController.dispatch(ctx)
});
//到訪客註冊頁
router.get('/signup', async (ctx, next)=> {
  console.log("有讀到signup router")
  await personController.goselfinput(ctx,next)
});
//到好友登出
router.get('/logout', async (ctx, next)=> {
  console.log("有讀到logout router")
  await branchController.ending(ctx,next)
});
//檢視使用手冊
router.get('/menu', async (ctx, next)=> {
  console.log("有讀到menu router")
  await branchController.seemenu(ctx,next)
});
//到innerweb(內部首頁含個人基本資料)
router.get('/goinnerweb/:id', async (ctx, next)=> {
  await branchController.innerweb(ctx,next)
});

//到outerweb2
router.get('/goouterweb2', async (ctx, next)=> {
  await branchController.outerweb2(ctx,next)
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
