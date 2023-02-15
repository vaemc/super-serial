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
      <SerialPortSelect @portChange="portChange" />
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
      <BaudRateSelect
        :defaultValue="defaultBaudRate"
        @baudRateChange="baudRateChange"
      />
    </div>
    <a-button
      @click="openPortBtn()"
      type="primary"
      style="margin-bottom: 5px"
      >{{ openBtnText }}</a-button
    >

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
import { onMounted, ref } from "vue";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import SerialPortSelect from "./select/SerialPortSelect.vue";
import BaudRateSelect from "./Select/BaudRateSelect.vue";
import { terminalWrite } from "../utils/bus";
import { serialPortPageStore } from "../utils/store";
import { SerialPortPage } from "../model/serialPortPage";
import emitter from "../utils/bus";
const serialPortPageUid = defineProps(["uid"]);
const selectedSerialPort = ref<string>();
const selectedbaudRate = ref<string>();
const openBtnText = ref("打开端口");
const defaultBaudRate = ref();
let serialPortPage: SerialPortPage = serialPortPageStore().list.find(
  (x) => x.uid === serialPortPageUid.uid
) as SerialPortPage;
defaultBaudRate.value = serialPortPage.serial?.baudRate;

const portChange = (data: string) => {
  selectedSerialPort.value = data;
  console.info(data);
};

const baudRateChange = (data: string) => {
  selectedbaudRate.value = data;
};

const syncSerialPortConnectState = () => {
  let isOpen = this.serial.port.isOpen;
  this.$emit("updateTabSerialPortConnectState", {
    name: this.xtermTerminalName,
    state: isOpen,
  });
  if (!isOpen) {
    this.receiveDataLength = 0;
    this.sendDataLength = 0;
  }
  this.serialPortOpenBtnText = isOpen ? "关闭端口" : "打开端口";
  this.serialPortOpenBtnType = isOpen ? "danger" : "primary";
  this.serialPortOpenBtnIsOpen = isOpen;
};

const openPortBtn = () => {
  serialPortPageStore().list = serialPortPageStore().list.map((item) => {
    if (item.uid == serialPortPage.uid) {
      item.serial = {
        port: selectedSerialPort.value,
        baudRate: selectedbaudRate.value,
      };
      return item;
    }
    return item;
  });

  const serialPort = new SerialPort({
    path: selectedSerialPort.value as any,
    baudRate: parseInt(selectedbaudRate.value as any),
    autoOpen: false,
  });

  serialPort.on("close", () => {});

  serialPort.on("open", () => {
    const parser = serialPort.pipe(new ReadlineParser());
    parser.on("data", (data) => {
      //console.info(data);
      // this.terminal.writeln(data);
      emitter.emit(serialPortPage.uid, data);
    });
    // this.syncSerialPortConnectState();
    //   emitter.emit(serialPortPage.uid);
  });

  serialPort.open((error) => {
    if (error) {
      //端口无法打开
      // emitter.emit(serialPortPage.uid);
    }
  });
};
onMounted(() => {});

const sendBtn = () => {
  // serialPortPageStore().list.map((item) => {
  //   console.info(item.key);
  // });

  //  console.info(serialPortPage);

  terminalWrite(serialPortPage.uid, "111111111");

  serialPortPageStore().list = [];
};
</script>
