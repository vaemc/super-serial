<template>
  <div>
    <a-tabs default-active-key="1" type="editable-card">
      <a-tab-pane key="1" tab="串口1">
        <a-row type="flex">
          <a-col flex="auto">
            <div ref="editorContainer" style="height: 100vh; width: 100%"></div
          ></a-col>
          <a-col flex="200px">
            <a-button type="primary"> Primary </a-button>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<!-- <script>
require.config({
  paths: { vs: "./node_modules/monaco-editor/min/vs" },
  "vs/nls": { availableLanguages: { "*": "zh-cn" } },
});
require(["vs/editor/editor.main"], function () {
  var editor = monaco.editor.create(document.getElementById("container"), {
    value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
    language: "javascript",
  });
});
</script> -->

<script>



import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
// import * as monaco from "monaco-editor";
import loader from "@monaco-editor/loader";
import * as monaco from "monaco-editor";
const path = require('path');


function ensureFirstBackSlash(str) {
    return str.length > 0 && str.charAt(0) !== '/'
        ? '/' + str
        : str;
}

function uriFromPath(_path) {
    const pathName = path.resolve(_path).replace(/\\/g, '/');
    return encodeURI('file://' + ensureFirstBackSlash(pathName));
}

console.info(__dirname)
loader.config({
  paths: {
    vs: uriFromPath(
      path.join(__dirname, '../node_modules/monaco-editor/min/vs')
    )
  }
});

// loader.config({
//   "vs/nls": {
//     availableLanguages: {
//       "*": "zh-cn",
//     },
//   },
// });

SerialPort.list().then((ports) => {
  let list = ports.map((item) => {
    return { value: item.path, label: item.path };
  });
  console.info(list);
});

export default {
  name: "HomeView",
  data() {
    return {
      monacoEditor: {},
    };
  },
  mounted() {
    loader.init().then((monaco) => {
      monaco.editor.create(this.$refs.editorContainer, {
        theme: "vs-dark",
        readOnly: true,
        value: "// some comment",
        language: "javascript",
      });
    });

    // console.info(monaco.editor);
    // this.monacoEditor = monaco.editor.create(this.$refs.editorContainer, {
    //   value: "内容",
    //   readOnly: true, //只读
    //   language: "java",
    //   theme: "vs-dark",
    // });

    // this.monacoEditor.setValue("aaaaaaa");
  },
};
</script>
