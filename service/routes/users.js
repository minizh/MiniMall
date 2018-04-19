var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 登录
router.post('/login', (req, res, next) => {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, (err, userInfo) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (userInfo) {
        res.cookie('userId', userInfo.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie('userName', userInfo.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        // req.session.user = userInfo;
        res.json({
          status: '0',
          msg: '登录成功！',
          result: {
            userName: userInfo.userName,
          }
        })
      } else {
        res.json({
          status: '2',
          msg: '账号或密码有误！'
        })
      }
    }
  });
});

//注销
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: '退出登录成功！',
    result: ''
  });
});

// 登录检测
router.post('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '用户已登录',
      result: req.cookies.userName || ''
    });
  } else {
    res.json({
      status: '1',
      msg: '用户未登录',
      result: ''
    });
  }
});

module.exports = router;
