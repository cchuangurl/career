var router = require('@koa/router')();
const outerwebController = require('../controllers/index').outerweb;
//到學經歷類別頁
router.get('/resumetype', async (ctx, next)=> {
  await outerwebController.showresumetype(ctx,next)
});
//到著作類別頁
router.get('/papertype', async (ctx, next)=> {
  await outerwebController.showpapertype(ctx,next)
});
//到某著作類別清單頁
router.get('/paper/gosublist/:id', async (ctx, next)=> {
  await outerwebController.showsublist(ctx,next)
});
//到免費下載類別頁
router.get('/freefiletype/:id', async (ctx, next)=> {
  await outerwebController.showfreefiletype(ctx,next)
});
//到可下載著作清單頁
router.get('/paper/godownload/:id', async (ctx, next)=> {
  await outerwebController.downloadlist(ctx,next)
});



module.exports = router;
