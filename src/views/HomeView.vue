<template>
  <div>
    <div ref="editorContainer" style="height: 100vh; width: 100%"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

import * as monaco from "monaco-editor";
SerialPort.list().then((ports) => {
  let list = ports.map((item) => {
    return { value: item.path, label: item.path };
  });
  console.info(list);
});
export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
  data(){
    return{
      monacoEditor: { }
    }
  },
  mounted() {
    this.monacoEditor = monaco.editor.create(this.$refs.editorContainer, {
      value: "内容",
      readOnly: true,
      language: "java",
      theme: "vs-dark",
    });

    this.monacoEditor.setValue("aaaaaaa");
  },
};
</script>
