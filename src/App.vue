<template>
  <a-config-provider :locale="locale">
    <MainWindow/>
  </a-config-provider>
</template>
<script setup lang="ts">
import MainWindow from "./views/MainWindow.vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");


const locale = zhCN;

</script>
