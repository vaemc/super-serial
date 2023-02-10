<template>
  <div style="width: 100%">
    <div :id="terminalId" style="height: calc(100vh - 56px)" class="xterm"></div>
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

const fitAddon = new FitAddon();

const terminal = new Terminal({
  fontSize: 14,
  allowProposedApi: true,
  cursorStyle: "bar",
  theme: {
    background: "#202020",
    magenta: "#e39ef7",
  },
});

emitter.on("terminal", (data: any) => {
  terminal.writeln(data);
});

window.onresize = () => {
  for (let i = 0; i < 30; i++) {
    fitAddon.fit();
  }
};

const terminalId = ref();

onBeforeMount(() => {
  terminalId.value = uid();
});
onMounted(() => {
  terminal.loadAddon(fitAddon);
  const terminalDiv = document.getElementById(terminalId.value)!;
  terminal.open(terminalDiv);
  fitAddon.fit();

  for (let i = 0; i < 200; i++) {
    terminal.writeln("12345");
  }
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
