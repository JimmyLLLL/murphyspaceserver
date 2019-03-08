const Koa = require('koa')
const router = require('./router')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')
const config = require('./config/default.js')
const cors = require('koa2-cors')
const KoaBody = require('koa-body')
const app = new Koa()

const sessionMysqlConfig = {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
}
app.use(require('koa-static')(__dirname + '/public'))
app.use(cors({
  origin:'*'
}))

app.use(KoaBody({
  multipart: true,
  formidable: {
      maxFileSize: 600*1024*1024    // 设置上传文件大小最大限制，默认6M
  }
}));

app.use(bodyParser())

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(8003)
