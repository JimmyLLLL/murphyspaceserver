const Router = require("koa-router");
const router = new Router();
const user = require("./controller");

router.post("/api/blog/register", user.register);
router.post("/api/blog/login", user.login);
router.post("/api/blog/sendEdit", user.sendEdit);
router.post("/api/blog/getBlog", user.getBlog);
router.post("/api/blog/enterBlog", user.enterBlog);
router.patch("/api/blog/PersonalInfoChange", user.PersonalInfoChange);
router.post("/api/blog/memoryLogin", user.memoryLogin);
router.post("/api/blog/uploadAvator", user.uploadAvator);
router.post("/api/blog/uploadAvatorValid", user.uploadAvatorValid);
router.post("/api/blog/getNewAvator", user.getNewAvator);
router.post("/api/blog/checkExistAccount", user.checkExistAccount);
router.post("/api/blog/sendComment", user.sendComment);
router.post("/api/blog/getComment", user.getComment);
router.delete("/api/blog/deleteComment", user.deleteComment);
router.post("/api/blog/personalGetBlog", user.personalGetBlog);
router.post("/api/blog/findDataByName", user.findDataByName);
router.post("/api/blog/handleBlogDelete", user.handleBlogDelete);

module.exports = router;
