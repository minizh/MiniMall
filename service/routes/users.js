let express = require('express');
let router = express.Router();
let User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 登录
router.post('/login', (req, res, next) => {
  let param = {
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

// 购物车列表信息
router.get('/cartList', (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({
    userId: userId
  }, (err, data) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: data.cartList
      });
    }
  });
});

// 删除一条购物车商品数据
router.post('/cart/del', (req, res, next) => {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  User.update({
    userId: userId
  }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, (err, data) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.msg,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '删除成功！',
        result: data
      });
    }
  });
});

// 编辑购物车
router.post('/cartEdit', (req, res, next) => {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  let productNum = req.body.productNum;
  let checked = req.body.checked;
  User.update({
    'userId': userId,
    "cartList.productId": productId
  }, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, data) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '修改成功！',
        result: ''
      });
    }
  });
});

// 全选
router.post('/editCheckAll', (req, res, next) => {
  let userId = req.cookies.userId;
  let checkAll = req.body.checkAll ? '1' : '0';
  console.log(checkAll);
  User.findOne({
    userId: userId
  }, (err, userdata) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (userdata) {
        userdata.cartList.forEach((item) => {
          item.checked = checkAll;
        });
        userdata.save((err1, data) => {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '操作成功！',
              result: ''
            });
          }
        });
      }
    }
  });
});

module.exports = router;
