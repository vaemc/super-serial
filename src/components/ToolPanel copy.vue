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
        :defaultBaudRate="defaultBaudRate"
        @baudRateChange="baudRateChange"
      />
    </div>
    <a-button
      @click="openPortBtn()"
      :type="openBtnType"
      style="margin-bottom: 5px"
      >{{ openBtnText }}</a-button
    >

    <a-textarea
      v-model:value="content"
      placeholder="请输入内容"
      :auto-size="{ minRows: 4, maxRows: 4 }"
      allow-clear
      :disabled="!isOpen"
    />

    <a-row style="margin-bottom: 5px">
      <a-col :span="12" style="display: flex; flex-wrap: nowrap">
        <a-checkbox :disabled="!isOpen" v-model:checked="isSendNewLine"
          >发送新行</a-checkbox
        ></a-col
      >
      <a-col :span="12">
        <a-checkbox v-model:checked="isSendHex" :disabled="!isOpen"
          >发送HEX</a-checkbox
        >
      </a-col>
    </a-row>

    <div style="display: flex; flex-wrap: wrap; justify-content: flex-start">
      <a-button
        type="primary"
        @click="sendBtn"
        style="margin: 5px; flex: 1"
        :disabled="!isOpen"
      >
        发送
      </a-button>
      <a-button
        type="primary"
        @click="rstBtn"
        style="margin: 5px; flex: 1"
        :disabled="!isOpen"
      >
        重启
      </a-button>
      <a-button type="primary" @click="clearBtn" style="margin: 5px; flex: 1">
        清空
      </a-button>
      <a-button style="margin: 5px; flex: 1" type="primary"> 绘图 </a-button>
      <a-button type="primary" style="margin: 5px; flex: 1"> 测试1 </a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { message } from "ant-design-vue";
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
const openBtnType = ref("primary");

const isOpen = ref(false);

const content = ref();

const isSendNewLine = ref(false);
const isSendHex = ref(false);

let serialPort = {} as SerialPort;

let serialPortPage: SerialPortPage = serialPortPageStore().list.find(
  (x) => x.uid === serialPortPageUid.uid
) as SerialPortPage;

const defaultBaudRate = ref(serialPortPage.serial?.baudRate);

const portChange = (data: string) => {
  selectedSerialPort.value = data;
};

const baudRateChange = (data: string) => {
  selectedbaudRate.value = data;
};

const syncState = () => {
  isOpen.value = serialPort.isOpen;
  // this.$emit("updateTabSerialPortConnectState", {
  //   name: this.xtermTerminalName,
  //   state: isOpen,
  // });
  // if (!isOpen) {
  //   this.receiveDataLength = 0;
  //   this.sendDataLength = 0;
  // }
  openBtnText.value = isOpen.value ? "关闭端口" : "打开端口";
  openBtnType.value = isOpen.value ? "danger" : "primary";
};

const openPortBtn = () => {
  console.info(serialPortPageStore().list);

  if (selectedSerialPort.value === "") {
    message.warn("请选择端口");
    return;
  }

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
  console.info(serialPortPageStore().list);

  if (serialPort.isOpen != undefined && serialPort.isOpen != false) {
    serialPort.port?.close();
    syncState();
    return;
  }

  serialPort = new SerialPort({
    path: serialPortPage.serial?.port as string,
    baudRate: parseInt(serialPortPage.serial?.baudRate as string),
    autoOpen: false,
  });

  serialPort.on("close", () => {
    console.info("close");
    syncState();
  });

  serialPort.on("open", () => {
    const parser = serialPort.pipe(new ReadlineParser());
    parser.on("data", (data) => {
      serialPortPage.terminal?.writeln(data);
    });
    syncState();
  });

  serialPort.open((error) => {
    if (error) {
      message.warn("端口无法打开，请查看端口是否被占用！");
    }
  });
};
onMounted(() => {
});

const sendBtn = () => {
  if (isSendHex.value) {
    let hexArray = content.value.split(" ");
    hexArray = hexArray.map((item: string) => {
      return parseInt(item, 16);
    });
    serialPort.port?.write(Buffer.from(hexArray));
  } else {
    serialPort.port?.write(
      Buffer.from(content.value + (isSendNewLine.value ? "\r\n" : ""), "utf8")
    );
  }
};

const clearBtn = () => {
  serialPortPage.terminal?.clear();
};

const rstBtn = () => {
  serialPort.port?.set({ dtr: true, rts: true });
  serialPort.port?.set({ dtr: false, rts: true });
  serialPort.port?.set({ dtr: true, rts: true });
};
</script>
