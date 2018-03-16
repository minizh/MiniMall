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
                    <a href="javascript:void(0)" class="price">Price
                        <svg class="icon icon-arrow-short">
                            <use xlink:href="#icon-arrow-short"></use>
                        </svg>
                    </a>
                    <a href="javascript:void(0)" 
                       class="filterby stopPop"
                       @click="showFilter">Filter by</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop" v-bind:class="{'filterby-show':isShowFilter}" id="filter">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd>
                                <a href="javascript:void(0)" 
                                v-bind:class="{'cur':priceChecked==='all'}"
                                v-on:click="priceChecked='all'">All</a>
                            </dd>
                            <dd v-for="(price,i) in priceFilter">
                                <a href="javascript:void(0)"
                                v-bind:class="{'cur':priceChecked===i}"
                                @click="choosePrice(i)"
                                >{{price.startPrice}}-{{price.endPrice}}</a>
                            </dd>
                        </dl>
                    </div>
                    <!-- goodslist -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="item in goodslist">
                                    <div class="pic">
                                        <a href="javascript:;"><img v-lazy="'static/'+item.productImg" alt=""></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">￥{{item.productPrice}}.00</div>
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
        <div class="md-overlay"
             v-show="isShowOverlay"
             v-on:click="hideFilter"></div>
        <nav-footer></nav-footer>
    </div>
</template>

<script type="text/ecmascript-6">
import "../assets/css/base.css";
import "../assets/css/product.css";
import "../assets/css/login.css";
import NavHeader from "@/components/Header";
import NavFooter from "@/components/Footer";
import Bread from "@/components/Bread";
import axios from "axios";
export default {
  data() {
    return {
      goodslist: [],
      priceFilter:[
          {
              startPrice:'0.00',
              endPrice:'100.00'
          },
          {
              startPrice:'100.00',
              endPrice:'500.00'
          },{
              startPrice:'500.00',
              endPrice:'1000.00'
          },
          {
              startPrice:'1000.00',
              endPrice:'2000.00'
          },
      ],
      priceChecked:'all',
      isShowFilter:false,
      isShowOverlay:false
    };
  },
  components: {
    NavHeader,
    NavFooter,
    Bread
  },
  mounted() {
      this.getGoodsList();
  },
  methods: {
    getGoodsList() {
      axios.get("/goods").then((res) => {
        var r = res.data;
        this.goodslist = r.result;
      });
    },
    showFilter(){
        this.isShowFilter=true;
        this.isShowOverlay=true;
    },
    hideFilter(){
        this.isShowFilter=false;
        this.isShowOverlay=false;
    },
    choosePrice(i){
        this.priceChecked=i;
        this.hideFilter();
    }
  }
};
</script>

<style scoped lang="stylus">
</style>
