import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import * as echarts from 'echarts'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts
Vue.use(VueAxios, axios)
Vue.use(Antd);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
