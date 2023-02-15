import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import i18n from './locals'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
createApp(App)
  .use(pinia)
  .use(Antd)
  .use(i18n)
  .mount("#app")
  .$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });
