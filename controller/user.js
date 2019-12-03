const mysql = require("../mysql/mysql.js");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const {
  ERROR_500,
  ERROR_404,
  ERROR_401,
  EXPIRE_401
} = require("../constant/status_message");
const { SECREKEY } = require("../constant/jwt_key");
const { replaceEmpty, createAssetName } = require("../utils");

module.exports = {
  async handleBlogDelete(ctx) {
    const { id } = ctx.request.body;
    const token = ctx.request.headers.authorization;
    try {
      jwt.verify(token, SECREKEY);
      try {
        await mysql.deletePost(id);
        ctx.body = {
          status: 200,
          id
        };
      } catch (e) {
        console.log(e);
        ctx.body = {
          status: 500,
          error_msg: ERROR_500
        };
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 401,
        error_msg: EXPIRE_401
      };
    }
  },
  async findDataByName(ctx) {
    const { name } = ctx.request.body;
    try {
      const data = await mysql.findDataByName(name);
      ctx.body = {
        status: 200,
        data
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 500,
        error_msg: ERROR_500
      };
    }
  },
  async personalGetBlog(ctx) {
    const { page, account } = ctx.request.body;
    try {
      const data = await mysql.findPostByUserPage(account, page);
      ctx.body = {
        status: 200,
        data
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 500,
        error_msg: ERROR_500
      };
    }
  },

  async deleteComment(ctx) {
    const { id, postid } = ctx.request.body;
    const token = ctx.request.headers.authorization;
    try {
      jwt.verify(token, SECREKEY);
      try {
        await mysql.deleteComment(id);
        const returnInfo = await mysql.getAllComment(postid);
        ctx.body = {
          status: 200,
          returnInfo
        };
      } catch (e) {
        ctx.body = {
          status: 500,
          error_msg: ERROR_500
        };
      }
    } catch {
      ctx.body = {
        status: 401,
        error_msg: EXPIRE_401
      };
    }
  },

  async getComment(ctx) {
    const index = ctx.request.body.id;
    let returnInfo;
    try {
      returnInfo = await mysql.getAllComment(index);
      ctx.body = {
        status: 200,
        data: returnInfo
      };
    } catch {
      ctx.body = {
        status: 500,
        error_msg: ERROR_500
      };
    }
  },

  async sendComment(ctx) {
    const token = ctx.request.headers.authorization;
    try {
      const payload = jwt.verify(token, SECREKEY);
      const account = payload.account;
      const { postid, content } = ctx.request.body;
      let moment = new Date();
      moment = moment.toLocaleString();

      try {
        const userdata = await mysql.findUserData(account);
        const { nickname, avator } = userdata[0];
        await mysql.insertComment([
          account,
          nickname,
          content,
          moment,
          postid,
          avator
        ]);
        const returnInfo = await mysql.getAllComment(postid);
        ctx.body = {
          status: 200,
          data: returnInfo
        };
      } catch (e) {
        console.log(e);
        ctx.body = {
          status: 500,
          error_msg: ERROR_500
        };
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 401,
        error_msg: EXPIRE_401
      };
    }
  },
  async checkExistAccount(ctx) {
    const account = ctx.request.body.account;
    try {
      let data = await mysql.getExistAccount(account);
      data = data[0].name;
      if (!data) {
        ctx.body = {
          status: 200,
          message: false
        };
      } else {
        ctx.body = {
          status: 200,
          message: true
        };
      }
    } catch (e) {
      ctx.body = {
        status: 500,
        error_msg: ERROR_500
      };
    }
  },

  async getNewAvator(ctx) {
    const account = ctx.request.body.account;
    try {
      let avator = await mysql.getNewAvator(account);
      avator = avator[0].avator;
      ctx.body = {
        status: 200,
        avator
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 500,
        error_msg: ERROR_500
      };
    }
  },

  async uploadAvatorValid(ctx) {
    const token = ctx.request.headers.authorization;
    try {
      const payload = jwt.verify(token, SECREKEY);
      const account = payload.account;
      ctx.body = {
        status: 200,
        account
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 401,
        error_msg: EXPIRE_401
      };
    }
  },
  //上传头像图片
  async uploadAvator(ctx) {
    const account = ctx.request.body.account;
    const isHavePhoto = ctx.request.files.file.size;
    if (!isHavePhoto) {
      return;
    }

    //取出数据库上次存的图片
    let lastAvator;
    try {
      lastAvator = await mysql.findUserAvator(account);
    } catch (e) {
      ctx.body = {
        status: 404,
        error_msg: ERROR_404
      };
      return;
    }

    //删除上次的图片

    try {
      const deleteFilePath =
        path.join(__dirname, "../public/uploads/avator") +
        "/" +
        lastAvator[0].avator;
      fs.unlink(deleteFilePath, function(error) {
        if (error) {
          throw Error(error);
        }
      });
    } catch (error) {
      ctx.body = {
        status: 500,
        error_msg: ERROR_500
      };
      console.log(error);
      return;
    }

    try {
      const file = ctx.request.files.file; // 获取上传文件
      // 创建可读流
      const reader = fs.createReadStream(file.path);
      //构建文件名
      const { filePath, name } = createAssetName(file.name, account);

      // 创建可写流
      const upStream = fs.createWriteStream(filePath);
      // 可读流通过管道写入可写流
      reader.pipe(upStream);

      await mysql.PersonalAvatorChange(name, account);
      await mysql.CommentAvatorChange(name, account);

      ctx.body = {
        status: 200
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 500,
        error_msg: ERROR_500
      };
    }
  },
  //发文章
  async sendEdit(ctx) {
    const token = ctx.request.headers.authorization;
    try {
      const payload = jwt.verify(token, SECREKEY);
      const { title, nickname } = ctx.request.body;
      let { content } = ctx.request.body;
      content = replaceEmpty(content);
      const account = payload.account;
      let time = new Date();
      time = time.toLocaleString();
      try {
        await mysql.insertPost([nickname, title, content, account, time, ""]);
        ctx.body = {
          status: 200
        };
      } catch (e) {
        console.log(e);
        ctx.body = {
          status: 500,
          error_msg: ERROR_500
        };
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 401,
        error_msg: EXPIRE_401
      };
    }
  },
  //个人信息修改
  async PersonalInfoChange(ctx) {
    const token = ctx.request.headers.authorization;
    const { word, nickname } = ctx.request.body;
    try {
      const payload = jwt.verify(token, SECREKEY);
      const account = payload.account;
      try {
        await mysql.PersonalInfoChange([nickname, word], account);
        ctx.body = {
          status: 200,
          newInfo: {
            word,
            nickname
          }
        };
      } catch (e) {
        ctx.body = {
          status: 500,
          error_msg: ERROR_500
        };
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 401,
        code: EXPIRE_401
      };
    }
  },
  //从标题进入博客内容
  async enterBlog(ctx) {
    const id = ctx.request.body.id;
    try {
      const data = await mysql.findDataById(id);
      ctx.body = {
        status: 200,
        data
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 404,
        error_msg: ERROR_404
      };
    }
  },
  //获得博客标题列表
  async getBlog(ctx) {
    const page = ctx.request.body.page;
    try {
      const data = await mysql.findPostByPage(page);
      ctx.body = {
        status: 200,
        data
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 500,
        error_msg: ERROR_500
      };
    }
  },

  //注册账户
  async register(ctx) {
    const { account, password } = ctx.request.body;
    let time = new Date();
    time = time.toLocaleString();
    try {
      await mysql.insertData([account, password, "", time]);
      ctx.body = {
        status: 200
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 500,
        error_msg: ERROR_500
      };
    }
  },
  //一进入网页自动登录
  async memoryLogin(ctx) {
    const token = ctx.request.headers.authorization;
    try {
      const payload = jwt.verify(token, SECREKEY);
      const { account, password } = payload;
      const content = { account, password };
      const newToken = jwt.sign(content, SECREKEY, {
        expiresIn: "1h"
      });
      try {
        const returnInfo = await mysql.loginFunction([account, password]);
        const { account, nickname, word, avator } = returnInfo[0];
        ctx.body = {
          status: 200,
          returnInfo: returnInfo[0],
          token: newToken,
          account,
          nickname,
          word,
          avator
        };
      } catch (e) {
        console.log(e);
        ctx.body = {
          error_msg: ERROR_404,
          status: 404
        };
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 401,
        error_msg: EXPIRE_401
      };
    }
  },
  //登陆账户
  async login(ctx) {
    const { account, password } = ctx.request.body;
    try {
      const returnInfo = await mysql.loginFunction([account, password]);
      if (returnInfo[0].pass.trim() === password.trim()) {
        const content = { account, password };
        const token = jwt.sign(content, SECREKEY, {
          expiresIn: "1h" // 1小时过期
        });
        const { nickname, word, avator } = returnInfo[0];
        ctx.body = {
          status: 200,
          token,
          account,
          word,
          nickname,
          avator
        };
      } else {
        ctx.body = {
          status: 401,
          error_msg: ERROR_401
        };
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: 500,
        error_msg: ERROR_500
      };
    }
  }
};
