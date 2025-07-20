var router = require('@koa/router')();
const outerwebController = require('../controllers/index').outerweb;
//到專長領域頁
router.get('/expertise', async (ctx, next)=> {
  await outerwebController.goexpertise(ctx,next)
});
//到著作數量頁
router.get('/paper', async (ctx, next)=> {
  await outerwebController.gopaper(ctx,next)
});

module.exports = router;
