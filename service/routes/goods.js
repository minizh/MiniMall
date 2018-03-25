var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

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

router.get('/', function (req, res, next) {
  let page = parseInt(req.param("pageNo"));
  let pageSize = parseInt(req.param("pageSize"));
  let sort = req.param("sort");
  // let priceLevel = req.param("priceLevel");
  let skip = (page-1)*pageSize;
  let params = {};
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function (err,doc) {
      if(err){
          res.json({
            status:'1',
            msg:err.message
          });
      }else{
          res.json({
              status:'0',
              msg:'',
              result:{
                  count:doc.length,
                  list:doc
              }
          });
      }
  })
});

module.exports = router;
