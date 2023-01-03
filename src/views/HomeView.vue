<template>
  <div>
    <a-tabs default-active-key="1" type="editable-card">
      <a-tab-pane key="1" tab="串口1">
        <a-row type="flex">
          <a-col flex="auto">
            <a-tabs tabPosition="right" default-active-key="1">
              <a-tab-pane key="1" tab="文本">
                <div
                  ref="editorContainer"
                  style="height: 72vh; width: 100%"
                ></div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="十六进制" force-render> </a-tab-pane>
              <a-tab-pane key="3" tab="日志">
                <mavon-editor
                  id="logHtml"
                  style="height: 72vh"
                  :subfield="false"
                  defaultOpen="preview"
                  :boxShadow="false"
                  v-model="logHtml"
                  :xssOptions="xssOptions"
                  :toolbarsFlag="false"
                />
              </a-tab-pane>
            </a-tabs>

            <a-row type="flex" align="middle" :gutter="16">
              <a-col flex="auto">
                <a-textarea
                  style="margin: 5px"
                  placeholder="请输入内容"
                  :auto-size="{ minRows: 4, maxRows: 4 }"
                  allow-clear
              /></a-col>
              <a-col flex="200px">
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-content: flex-start;
                  "
                >
                  <a-checkbox> 16进制发送 </a-checkbox>
                  <a-button type="primary"> 发送 </a-button>
                </div>
              </a-col>
            </a-row>
          </a-col>
          <a-col flex="300px">
            <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
              <a-form-item label="端口">
                <a-select
                  @focus="serialPortListSelectFocus"
                  @change="serialPortListSelectChange"
                >
                  <a-select-option
                    v-for="item in serial.portList"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.value }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="波特率">
                <a-select defaultValue="115200" @change="baudRateSelectChange">
                  <a-select-option value="9600">9600</a-select-option>
                  <a-select-option value="74880">74880</a-select-option>
                  <a-select-option value="115200">115200</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                <a-button
                  :type="serialPortOperationBtnType"
                  @click="serialPortOperationBtn"
                >
                  {{ serialPortOperationBtnText }}
                </a-button>
              </a-form-item>
            </a-form>
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
const Convert = require("ansi-to-html");
const convert = new Convert();
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
// import * as monaco from "monaco-editor";
// import loader from "@monaco-editor/loader";
import * as monaco from "monaco-editor";
// loader.config({
//   monaco,
// });

// loader.config({
//   "vs/nls": {
//     availableLanguages: {
//       "*": "zh-cn",
//     },
//   },
// });

export default {
  name: "HomeView",
  data() {
    return {
      xssOptions: {
        whiteList: {
          span: ["style"],
        },
      },
      logHtml: "",
      serialPortListSelectValue: "",
      serialPortOperationBtnText: "打开端口",
      serialPortOperationBtnType: "primary",

      monacoEditor: {},
      serial: {
        portList: [],
        baudRate: "115200",
        serial1: {},
      },
    };
  },
  methods: {
    baudRateSelectChange(value) {
      console.info(value);
      this.serial.baudRate = value;
    },
    serialPortListSelectChange(value) {
      console.info(value);
      this.serialPortListSelectValue = value;
    },
    serialPortOperationBtn() {
      if (this.serialPortListSelectValue === "") {
        this.$message.warn("请选择端口");
        return;
      }

      if (this.serialPortOperationBtnText == "打开端口") {
        this.serial.serial1 = new SerialPort({
          path: this.serialPortListSelectValue,
          baudRate: parseInt(this.serial.baudRate),
        });
        console.info(parseInt(this.serial.baudRate));
        const parser = this.serial.serial1.pipe(
          new ReadlineParser({ delimiter: "\r\n" })
        );
        parser.on("data", (data) => {
          console.info(data);

          this.logHtml += convert.toHtml(data) + "\r\n";

          this.monacoEditor.getModel().applyEdits(
            [
              {
                range: {
                  startColumn: 0,
                  startLineNumber:
                    this.monacoEditor.getModel().getLineCount() + 1,
                  endColumn: 0,
                  endLineNumber:
                    this.monacoEditor.getModel().getLineCount() + 1,
                },
                text: data + "\r\n",
              },
            ],
            true
          );

          if (
            this.monacoEditor.getPosition().lineNumber >=
            this.monacoEditor.getModel().getLineCount()
          ) {
            this.monacoEditor.revealLine(
              this.monacoEditor.getModel().getLineCount()
            );
          }
        });

        this.serialPortOperationBtnText = "关闭端口";
        this.serialPortOperationBtnType = "danger";
      } else if (this.serialPortOperationBtnText == "关闭端口") {
        this.serialPortOperationBtnText = "打开端口";
        this.serialPortOperationBtnType = "primary";

        this.serial.serial1.port.close();
      }
    },
    serialPortListSelectFocus() {
      this.getSerialPortList();
    },
    getSerialPortList() {
      SerialPort.list().then((ports) => {
        let list = ports.map((item) => {
          console.info(item);
          return { value: item.path, label: item.friendlyName };
        });
        this.serial.portList = list;
      });
    },
  },
  mounted() {
    this.getSerialPortList();

    // loader.init().then((monaco) => {
    //   this.monacoEditor = monaco.editor.create(this.$refs.editorContainer, {
    //     theme: "vs-dark",
    //     readOnly: true,
    //     value: "// some comment",
    //     language: "javascript",
    //   });
    // });

    // console.info(monaco.editor);
    this.monacoEditor = monaco.editor.create(this.$refs.editorContainer, {
      value: "",
      // readOnly: true, //只读
      language: "java",
      theme: "vs-dark",
    });

    // this.monacoEditor.setValue("aaaaaaa");
  },
};
</script>
