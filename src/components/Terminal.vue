<template>
  <div style="width: 100%">
    <!-- <div>
      <a-input-group compact>
        <a-input style="width: calc(100% - 200px)" />
        <a-button type="primary">上一个</a-button>
        <a-button type="primary">下一个</a-button>
      </a-input-group>
    </div> -->
    <div
      :id="terminalId"
      style="height: calc(100vh - 53px)"
      class="xterm"
    ></div>
  </div>
</template>
<script setup lang="ts">
import emitter from "../utils/bus";
import "xterm/css/xterm.css";
import "xterm/lib/xterm.js";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { onMounted, onBeforeMount, ref } from "vue";
import { uid } from "uid";
import { serialPortPageStore } from "../utils/store";
import { SerialPortPage } from "../model/serialPortPage";
import { ipcRenderer } from "electron";

const fitAddon = new FitAddon();
const terminalId = ref();
const serialPortPageUid = defineProps(["uid"]);
let serialPortPage: SerialPortPage = serialPortPageStore().list.find(
  (x) => x.uid === serialPortPageUid.uid
) as SerialPortPage;

ipcRenderer.on("fit", () => {
  for (let i = 0; i < 30; i++) {
    fitAddon.fit();
  }
});

const terminal = new Terminal({
  fontSize: 14,
  allowProposedApi: true,
  cursorStyle: "bar",
  theme: {
    background: "#202020",
    magenta: "#e39ef7",
  },
});

serialPortPageStore().list = serialPortPageStore().list.map((item) => {
  if (serialPortPage.uid === item.uid) {
    item.terminal = terminal;
  }
  return item;
});

window.onresize = () => {
  for (let i = 0; i < 30; i++) {
    fitAddon.fit();
  }
};

// emitter.on(serialPortPage.uid, (data: any) => {
//   terminal.writeln(data);
// });

onBeforeMount(() => {
  terminalId.value = uid();
});

onMounted(() => {
  terminal.loadAddon(fitAddon);
  const terminalDiv = document.getElementById(terminalId.value)!;
  terminal.open(terminalDiv);
  fitAddon.fit();
 
});
</script>
<style>
.xterm-viewport::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #141414;
}

.xterm-viewport::-webkit-scrollbar {
  width: 10px;
  background-color: #141414;
}

.xterm-viewport::-webkit-scrollbar-thumb {
  background-color: #000000;
  border: 2px solid #555555;
}
</style>
