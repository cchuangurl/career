var router = require('@koa/router')();
const innerwebController = require('../controllers/index').innerweb;
//到學經歷類別頁
router.get('/resumetype', async (ctx, next)=> {
  await innerwebController.showresumetype(ctx,next)
});
//到著作類別頁
router.get('/gopaper/:id', async (ctx, next)=> {
  await innerwebController.showpapertype(ctx,next)
});
//到某著作類別清單頁
router.get('/paper/gosublist/:id', async (ctx, next)=> {
  await innerwebController.showsublist(ctx,next)
});
//到免費下載類別頁
router.get('/share/:id', async (ctx, next)=> {
  await innerwebController.showfreefiletype(ctx,next)
});
//到可下載著作清單頁
router.get('/paper/godownload/:id', async (ctx, next)=> {
  await innerwebController.downloadlist(ctx,next)
});



module.exports = router;
