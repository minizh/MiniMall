<template>
    <div>
        <nav-header></nav-header>
        <bread>
            <span>/OrderSuccess</span>
        </bread>
        <div>
            <div class="container">
                <div class="page-title-normal">
                    <h2 class="page-title-h2">
                        <span>check out</span>
                    </h2>
                </div>
                <!-- 进度条 -->
                <div class="check-step">
                    <ul>
                        <li class="cur">
                            <span>Confirm</span> address</li>
                        <li class="cur">
                            <span>View your</span> order</li>
                        <li class="cur">
                            <span>Make</span> payment</li>
                        <li class="cur">
                            <span>Order</span> confirmation</li>
                    </ul>
                </div>

                <div class="order-create">
                    <div class="order-create-pic"><img src="./../../static/ok-2.png" alt=""></div>
                    <div class="order-create-main">
                        <h3>Congratulations! <br>Your order is under processing!</h3>
                        <p>
                            <span>Order ID：{{orderId}}</span>
                            <span>Order total：{{orderTotal | currency('$')}}</span>
                        </p>
                        <div class="order-create-btn-wrap">
                            <div class="btn-l-wrap">
                                <router-link class="btn brn--m" to="/cart">Cart List</router-link>
                            </div>
                            <div class="btn-r-wrap">
                                <router-link class="btn brn--m" to="/list">Goods List</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nav-footer></nav-footer>
    </div>
</template>
<script>
import NavHeader from "./../components/Header";
import NavFooter from "./../components/Footer";
import Bread from "./../components/Bread";
import Modal from "./../components/Modal";
import axios from "axios";
export default {
  data() {
    return {
      orderId: "",
      orderTotal: 0
    };
  },
  mounted() {
    this.init();
  },
  components: {
    NavHeader,
    NavFooter,
    Bread,
    Modal
  },
  methods: {
    init() {
      let orderId = this.$route.query.orderId;
      if (!orderId) return;
      axios
        .get("/users/orderDetail", {
          params: {
            orderId: orderId
          }
        })
        .then(res => {
          let r = res.data;
          if (r.status === "0") {
            this.orderTotal = r.result.orderTotal;
            this.orderId = r.result.orderId;
          } else if (r.status === "1001") {
            this.$store.commit("loginState", true);
          }
        });
    }
  }
};
</script>

