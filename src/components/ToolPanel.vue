<template>
  <div style="
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding: 10px;
    ">
    <div style="
        display: flex;
        justify-content: center;
        flex-direction: row;
        margin-bottom: 5px;
      ">
      <div style="width: 60px; text-align: right; align-self: center">
        端口：
      </div>
      <SerialPortSelect @portChange="portChange" />
    </div>
    <div style="
        display: flex;
        justify-content: center;
        flex-direction: row;
        margin-bottom: 5px;
      ">
      <div style="width: 60px; text-align: right; align-self: center">
        波特率：
      </div>
      <BaudRateSelect :defaultValue="defaultBaudRate" @baudRateChange="baudRateChange" />
    </div>
    <a-button @click="openPortBtn()" type="primary" style="margin-bottom: 5px">打开端口</a-button>

    <a-textarea placeholder="请输入内容" :auto-size="{ minRows: 4, maxRows: 4 }" allow-clear />

    <a-row style="margin-bottom: 5px">
      <a-col :span="12" style="display: flex; flex-wrap: nowrap">
        <a-checkbox>发送新行</a-checkbox></a-col>
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
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import SerialPortSelect from "./select/SerialPortSelect.vue";
import BaudRateSelect from "./Select/BaudRateSelect.vue";
import { terminalWrite } from "../utils/bus";
import { serialPortPageStore } from "../utils/store";
import { SerialPortPage } from "../model/serialPortPage";




const serialPortPageUid = defineProps(['uid'])
const selectedSerialPort = ref();
const selectedbaudRate = ref();

const defaultBaudRate = ref();
let serialPortPage: SerialPortPage = serialPortPageStore().list.find(x => x.uid === serialPortPageUid.uid) as SerialPortPage;
defaultBaudRate.value = serialPortPage.serial?.baudRate


const portChange = (data: string) => {
  selectedSerialPort.value = data;
}

const baudRateChange = (data: string) => {
  selectedbaudRate.value = data;
}
const openPortBtn = () => {
  console.log(selectedSerialPort.value);
  console.log(selectedbaudRate.value);

  serialPortPageStore().list = serialPortPageStore().list.map(item => {
    if (item.uid == serialPortPage.uid) {
      item.serial = {
        port: selectedSerialPort.value,
        baudRate: selectedbaudRate.value
      }
      return item;
    }
    return item;
  })
  // const serialPort = new SerialPort({
  //   path: port,
  //   baudRate: baudRate,
  //   autoOpen: false,
  // });

  // serialPort.on("close", () => { });

  // serialPort.on("open", () => {
  //   const parser = serialPort.pipe(new ReadlineParser());
  //   parser.on("data", (data) => {
  //     //console.info(data);
  //     // this.terminal.writeln(data);
  //     emitter.emit(uid);
  //   });
  //   // this.syncSerialPortConnectState();
  //   emitter.emit(uid);
  // });

  // serialPort.open((error) => {
  //   if (error) {
  //     //端口无法打开
  //     emitter.emit(uid);
  //   }
  // });
}
onMounted(() => {

});

const sendBtn = () => {
  // serialPortPageStore().list.map((item) => {
  //   console.info(item.key);
  // });

  //  console.info(serialPortPage);

  terminalWrite(serialPortPage.uid, "111111111");

  serialPortPageStore().list = [];
};
</script>
