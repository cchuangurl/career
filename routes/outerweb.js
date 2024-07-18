var router = require('@koa/router')();
const outerwebController = require('../controllers/index').outerweb;
//到學經歷類別頁
router.get('/resumetype/:id', async (ctx, next)=> {
  await outerwebController.showresumetype(ctx,next)
});
//到著作類別頁
router.get('/papertype/:id', async (ctx, next)=> {
  await outerwebController.showpapertype(ctx,next)
});
//到免費下載類別頁
router.get('/freefiletype/:id', async (ctx, next)=> {
  await outerwebController.showfreefiletype(ctx,next)
});



module.exports = router;
