let express = require('express');
let router = express.Router();
let User = require('../models/user');
require('./../util/util');


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
          maxAge: 1000 * 5
        });
        res.cookie('userName', userInfo.userName, {
          path: '/',
          maxAge: 1000 * 5
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

// 获取地址列表
router.get('/addressList', (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({
    userId: userId
  }, (err, data) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result
      });
    } else {
      if (data) {
        res.json({
          status: '0',
          msg: '请求成功',
          result: data.addressList
        });
      }
    }
  });
});

// 设置默认地址
router.post('/setDefault', (req, res, next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: "addressId is null",
      result: ''
    });
  } else {
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
          let addressList = userdata.addressList;
          addressList.forEach((item, i, arr) => {
            if (item.addressId === addressId) {
              item.isDefault = true;
              arr.splice(i, 1); //将默认地址从原数组中删除，再插入到第一位显示
              arr.unshift(item);
            } else {
              item.isDefault = false;
            }
          });

          userdata.save((err1, data) => {
            if (err1) {
              res.json({
                status: '1',
                msg: err1.message,
                result: ''
              });
            } else {
              if (data) {
                res.json({
                  status: '0',
                  msg: '设置成功！',
                  result: ''
                });
              }
            }
          });
        }
      }
    });
  }
});

//删除地址
router.post('/delAddress', (req, res, next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  User.update({
    userId: userId
  }, {
    $pull: {
      'addressList': {
        addressId: addressId
      }
    }
  }, (err, data) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else if (data) {
      res.json({
        status: '0',
        msg: '删除成功！',
        result: ''
      });
    }
  });
});

// 生成支付订单
router.post('/payMent', (req, res, next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  let orderTotal = req.body.orderTotal;
  User.findOne({
    userId: userId
  }, (err1, userdata) => {
    if (err1) {
      res.json({
        status: '1',
        msg: err1.message,
        result: ''
      });
    } else if (userdata) {
      let address = '';
      let goodsList = [];
      // 获取用户地址信息
      userdata.addressList.forEach(item => {
        if (item.addressId = addressId)
          address = item;
      });
      //获取用户购买信息
      userdata.cartList.filter(item => {
        if (item.checked === '1')
          goodsList.push(item);
      });
      // 生成订单号及下单时间
      let platform = '89757';
      let r1 = Math.floor(Math.random() * 10);
      let r2 = Math.floor(Math.random() * 10);
      let sysDate = new Date().Format('yyyyMMddhhmmss');
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      let orderId = platform + r1 + sysDate + r2;
      // 订单信息
      let order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      };
      // 插入数据库
      userdata.orderList.push(order);
      userdata.save((err2, data2) => {
        if (err2) {
          res.json({
            status: '0',
            msg: err2.message,
            result: ''
          });
        } else if (data2) {
          res.json({
            status: '0',
            msg: '添加订单成功！',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          });
          // 删除购物车数据
          let arr = [];
          userdata.cartList.forEach((item, i) => {
            if (item.checked === '0') {
              arr.push(item);
            }
          });
          userdata.cartList = arr;

          userdata.save((err3, data3) => {
            // 此处不能再继续用res.json返回，否则将报错Can't set headers after they are sent.
            // if (err3) {
            //   res.json({
            //     status: '1',
            //     msg: err3.message,
            //     result: ''
            //   });
            // } else {
            //   res.json({
            //     status: '0',
            //     msg: '购物车信息已删除',
            //     result: ''
            //   });
            // }
          });
        }
      });
    }
  });
});

// 根据订单id查询订单详情信息
router.get('/orderDetail', (req, res, next) => {
  let userId = req.cookies.userId;
  let orderId = req.param('orderId');
  if (!orderId) {
    res.json({
      status: '12003',
      msg: '订单号为空',
      result: ''
    });
  } else {
    User.findOne({
      userId: userId
    }, (err, userInfo) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else if (userInfo) {
        let orderList = userInfo.orderList;
        if (orderList.length > 0) {
          let orderTotal = 0;
          let flag = false;
          for (item of orderList) {
            if (item.orderId === orderId) {
              orderTotal = item.orderTotal;
              flag = true;
              res.json({
                status: '0',
                msg: '获取成功',
                result: {
                  orderId: orderId,
                  orderTotal: orderTotal
                }
              });
              return
            } else {
              flag = false;
            }
          }
          //注意此处不能用forEach，否则无法return跳出循环,可用for...of 或者every return false 替代
          // orderList.every(item => {

          // });
          if (!flag) {
            res.json({
              status: '12002',
              msg: '无此订单号',
              result: ''
            });
          }
        } else {
          res.json({
            status: '12000',
            msg: '该用户暂无订单',
            result: ''
          });
        }

      }
    });
  }
});

// 查询购物车商品数量
router.get('/getCartCount', (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    User.findOne({
      userId: userId
    }, (err, userInfo) => {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        });
      } else if (userInfo) {
        let cartList = userInfo.cartList;
        let cartCount = 0;
        cartList.map(item => {
          cartCount += parseInt(item.productNum);
        });
        res.json({
          status: '0',
          msg: '获取购物车数量成功！',
          result: cartCount
        });
      }
    });
  } else {
    res.json({
      status: "11000",
      msg: "当前用户不存在",
      result: ''
    });
  }
});


module.exports = router;
