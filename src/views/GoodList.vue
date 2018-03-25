<template>
    <div class="page">
        <nav-header></nav-header>
        <bread>
            <span>Goods</span>
        </bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:void(0)" class="default cur">Default</a>
                    <a v-on:click="sortGoods" href="javascript:void(0)" class="price">
                        Price
                        <svg class="icon icon-arrow-short">
                            <use xlink:href="#icon-arrow-short"></use>
                        </svg>
                    </a>
                    <a href="javascript:void(0)" class="filterby stopPop" @click="showFilter">Filter by</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop" v-bind:class="{'filterby-show':isShowFilter}" id="filter">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd>
                                <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==='all'}" v-on:click="priceChecked='all'">All</a>
                            </dd>
                            <dd v-for="(price,i) in priceFilter">
                                <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked===i}" @click="choosePrice(i)">{{price.startPrice}}-{{price.endPrice}}</a>
                            </dd>
                        </dl>
                    </div>
                    <!-- goodslist -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="item in goodslist">
                                    <div class="pic">
                                        <a href="javascript:;"><img v-lazy="'static/'+item.productImage" alt=""></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">￥{{item.salePrice}}.00</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="isShowOverlay" v-on:click="hideFilter"></div>
        <nav-footer></nav-footer>
    </div>
</template>

<script type="text/ecmascript-6">
import "../assets/css/base.css";
import "../assets/css/product.css";
import "../assets/css/login.css";
import "../assets/svg.svg";
import NavHeader from "@/components/Header";
import NavFooter from "@/components/Footer";
import Bread from "@/components/Bread";
import axios from "axios";
export default {
  data() {
    return {
      goodslist: [],//商品列表对象数组
      priceFilter: [//价格过滤器渲染
        {
          startPrice: "0",
          endPrice: "100"
        },
        {
          startPrice: "100",
          endPrice: "500"
        },
        {
          startPrice: "500",
          endPrice: "1000"
        },
        {
          startPrice: "1000",
          endPrice: "2000"
        },
        {
          startPrice: "2000",
          endPrice: "3000"
        },
        {
          startPrice: "3000",
          endPrice: "4000"
        }
      ],
      priceChecked: "all",//默认价格过滤器all为选择
      isShowFilter: false,//移动选控制价格过滤的显示与隐藏
      isShowOverlay: false,//移动选控制遮罩层的显示与隐藏
      sortFlag:true,//商品列表按照数据库默认排序
      pageNo:1,//分页起始页
      pageSize:20,//每页数量
    };
  },
  components: {
    NavHeader,
    NavFooter,
    Bread
  },
  mounted() {
    // vue实例过载后请求商品列表数据
    this.getGoodsList();
  },
  methods: {
    // 请求商品列表数据
    getGoodsList() {
        var data={
            pageNo:this.pageNo,
            pageSize:this.pageSize,
            sort:this.sortFlag ? 1 : -1 // 默认升序，否则降序
        };
      axios.get("/goods",{
          params:data
      }).then(res => {
        var r = res.data;
        this.goodslist = r.result.list;
      });
    },
    // 移动选显示/隐藏价格过滤器
    showFilter() {
      this.isShowFilter = true;
      this.isShowOverlay = true;
    },
    hideFilter() {
      this.isShowFilter = false;
      this.isShowOverlay = false;
    },
    // 价格过滤器切换过滤条件，更新选中样式
    choosePrice(i) {
      this.priceChecked = i;
      this.hideFilter();
    },
    // 列表页排序功能 默认/价格
    sortGoods(){
        this.sortFlag=!this.sortFlag;//排序状态取反
        this.pageNo=1;//重置页码
        this.getGoodsList();//重新请求数据
    }
  }
};
</script>

<style scoped lang="stylus">
</style>
