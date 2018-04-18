let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Goods = require('../models/goods');
let User = require('../models/user');

//链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/local');

mongoose.connection.on('connected', function () {
  console.log('MongoDB connected success');
});

mongoose.connection.on('error', function () {
  console.log('MongoDB connected fail');
});

mongoose.connection.on('disconnected', function () {
  console.log('MongoDB connected disconnected');
});

// 查询商品列表
router.get('/list', function (req, res, next) {
  let page = parseInt(req.param("pageNo"));
  let pageSize = parseInt(req.param("pageSize"));
  let sort = req.param("sort");
  let priceLevel = req.param("priceLevel");
  let priceGt = '',
    priceLte = '';
  let skip = (page - 1) * pageSize;
  let params = {};
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLte = 2000;
        break;
      case '4':
        priceGt = 2000;
        priceLte = 3000;
        break;
      case '5':
        priceGt = 3000;
        priceLte = 4000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({
    'salePrice': sort
  });
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  })
});

// 加入到购物车
router.post('/addCart', (req, res, next) => {
  let userId = '100000077';
  let productId = req.body.productId;
  // 根据用户id查询用户购物车信息
  User.findOne({
    userId: userId
  }, (err1, userInfo) => {
    if (err1) {
      res.json({
        status: '1',
        msg: err1.message
      })
    } else {
      // console.log(`userInfo: ${userInfo}`);
      // 如果有该用户存在，则根据productId先查询该产品信息,再增加产品数量和选中状态，最后保存进购物车列表
      if (userInfo) {
        let goodsItem = '';
        userInfo.cartList.forEach(item => {
          if (item.productId === productId) {
            goodsItem = item;
            item.productNum++;
            // item.checked = 1;
          }
        });
        if (goodsItem) {
          // 相同产品数量+1后重新保存数据
          userInfo.save((err2, cartListInfo) => {
            if (err2) {
              res.json({
                status: '1',
                msg: err2.message
              })
            } else {
              res.json({
                status: '0',
                msg: '添加成功！',
                result: 'success'
              })
            }
          })
        } else {
          Goods.findOne({
            productId: productId
          }, (err3, productInfo) => {
            if (err3) {
              res.json({
                status: '1',
                msg: err3.message
              })
            } else {
              if (productInfo) {
                productInfo.productNum = 1;
                productInfo.checked = 1;
                // 添加购物车信息
                userInfo.cartList.push(productInfo);
                // 保存
                userInfo.save((err4, cartListInfo) => {
                  if (err4) {
                    res.json({
                      status: '1',
                      msg: err4.message
                    })
                  } else {
                    res.json({
                      status: '0',
                      msg: '添加成功！',
                      result: 'success'
                    })
                  }
                })
              }
            }
          });
        }
      }
    }
  });
});

module.exports = router;
