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
            <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':sortFlag}">
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
                <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==='all'}" v-on:click="choosePrice('all')">All</a>
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
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="javascript:;"><img v-lazy="'static/'+item.productImage" v-bind:alt="item.productName"></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice | currency('$ ')}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" v-on:click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-show="hasMore" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                <img src="../../static/loading-svg/loading-spinning-bubbles.svg" alt='加载中...'>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="isShowOverlay" v-on:click="hideFilter"></div>
    <!-- 登录拦截 -->
    <modal v-bind:mdShow='mdShow' v-on:close="closeModal">
      <p slot="message">请先登录，否则无法加入到购物车中！</p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="mdShow=false">关闭</a>
      </div>
    </modal>
    <!-- 加入购物车成功 -->
    <modal v-bind:mdShow='mdShowCart' v-on:close="closeModal">
      <p slot="message">
        <svg class="icon icon-status-ok">
          <use xlink:href="#icon-status-ok" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
        </svg>
        加入购物车中成功！
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn--m" href='javascript:;' to="/cart">去购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>

<script type="text/ecmascript-6">
// import "../assets/css/base.css";
import "../assets/css/product.css";
import NavHeader from "@/components/Header";
import NavFooter from "@/components/Footer";
import Bread from "@/components/Bread";
import Modal from "@/components/Modal";
import axios from "axios";
export default {
  data() {
    return {
      priceFilter: [
        //价格过滤器渲染
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
      goodsList: [], //商品列表对象数组
      priceChecked: "all", //默认价格过滤器all为选择
      isShowFilter: false, //移动选控制价格过滤的显示与隐藏
      isShowOverlay: false, //移动选控制遮罩层的显示与隐藏
      sortFlag: true, //商品列表按照数据库默认排序
      pageNo: 1, //分页起始页
      pageSize: 8, //每页数量
      busy: false, //控制下拉加载是否有效，默认false为有效
      hasMore: false, //控制加载更多的显示与隐藏
      priceLevel: "all", //价格过滤条件，默认为all，对应下标为0
      mdShow: false, //传递到子组件Modal，控制模态框的显示与隐藏，用户未登录
      mdShowCart: false //添加到购物车成功提交模态框
    };
  },
  components: {
    NavHeader,
    NavFooter,
    Bread,
    Modal
  },
  mounted() {
    // vue实例过载后请求商品列表数据
    this.getGoodsList(false);
  },
  methods: {
    // 请求商品列表数据
    getGoodsList(flag) {
      var data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1, // 默认升序，否则降序
        priceLevel: this.priceLevel
      };
      this.hasMore = true;
      axios.get("/goods/list", { params: data }).then(res => {
        this.hasMore = false;
        var r = res.data;
        // 加载成功
        if (r.status == "0") {
          // flag=true,分页查询，flag=false 只加载第一页
          if (flag) {
            this.goodsList = this.goodsList.concat(r.result.list);
            // 如果没数据了，禁用加载，隐藏加载更多
            if (r.result.count == 0) {
              this.busy = true;
              // this.hasMore = false;
            } else {
              this.busy = false;
            }
          } else {
            this.goodsList = r.result.list;
            this.busy = false;
          }
        } else {
          // 加载失败
          this.goodsList = [];
        }
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
      this.priceLevel = i;
      this.pageNo = 1;
      this.getGoodsList(false);
      // this.loadMore(true);
    },
    // 列表页排序功能 默认/价格
    sortGoods() {
      this.sortFlag = !this.sortFlag; //排序状态取反
      this.pageNo = 1; //重置页码
      this.getGoodsList(false); //重新请求数据
    },
    // 分页下拉加载
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.pageNo++;
        this.getGoodsList(true);
      }, 500);
    },
    // 添加到购物车
    addCart(productId) {
      axios.post("/goods/addCart", { productId: productId }).then(res => {
        // alert(JSON.stringify(res));
        let r = res.data;
        if (r.status === "0") {
          this.mdShowCart = true; //添加成功
        } else {
          this.mdShow = true; //显示未登录模态框
          // alert(res.data.msg);
        }
      });
    },
    //关闭模态框
    closeModal() {
      this.mdShow = false;
      this.mdShowCart = false;
    }
  }
};
</script>

