<template>
  <div
    style="
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding: 10px;
    "
  >
    <div
      style="
        display: flex;
        justify-content: center;
        flex-direction: row;
        margin-bottom: 5px;
      "
    >
      <div style="width: 60px; text-align: right; align-self: center">
        端口：
      </div>
      <SerialPortSelect />
    </div>
    <div
      style="
        display: flex;
        justify-content: center;
        flex-direction: row;
        margin-bottom: 5px;
      "
    >
      <div style="width: 60px; text-align: right; align-self: center">
        波特率：
      </div>
      <BaudRateSelect />
    </div>
    <a-button type="primary" style="margin-bottom: 5px">打开端口</a-button>

    <a-textarea
      placeholder="请输入内容"
      :auto-size="{ minRows: 4, maxRows: 4 }"
      allow-clear
    />

    <a-row style="margin-bottom: 5px">
      <a-col :span="12" style="display: flex; flex-wrap: nowrap">
        <a-checkbox>发送新行</a-checkbox></a-col
      >
      <a-col :span="12"> <a-checkbox>发送HEX</a-checkbox> </a-col>
    </a-row>

    <div style="display: flex; flex-wrap: wrap; justify-content: flex-start">
      <a-button type="primary" @click="sendBtn" style="margin: 5px; flex: 1">
        发送
      </a-button>
      <a-button type="primary" style="margin: 5px; flex: 1"> 重启 </a-button>
      <a-button type="primary" style="margin: 5px; flex: 1"> 清空 </a-button>
      <a-button style="margin: 5px; flex: 1" type="primary"> 绘图 </a-button>
      <a-button type="primary" style="margin: 5px; flex: 1"> 测试1 </a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeMount, ref } from "vue";
import type { SelectProps } from "ant-design-vue";
import { portList } from "../utils/serial";
import SerialPortSelect from "./select/SerialPortSelect.vue";
import BaudRateSelect from "./Select/BaudRateSelect.vue";
import { terminalWrite } from "../utils/bus";
import { terminalStore } from "../utils/store";

let terminalIndex: Number;
const sendBtn = () => {
  // terminalStore().list.map((item) => {
  //   console.info(item.index);
  // });

  console.info(terminalIndex);
};
onMounted(() => {
  terminalIndex = terminalStore().list.at(-1);
  console.log(terminalIndex);
});
</script>
