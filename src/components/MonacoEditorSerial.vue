<template>
  <div>
    <a-row type="flex">
      <a-col :span="20">
        <!-- <a-tabs tabPosition="right" default-active-key="1">
          <a-tab-pane key="1" tab="文本">
            <div ref="editorContainer" style="height: 100vh; width: 100%"></div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="十六进制" force-render> </a-tab-pane>
          <a-tab-pane key="3" tab="日志">
            <mavon-editor
              id="logHtml"
              style="height: 100vh"
              :subfield="false"
              defaultOpen="preview"
              :boxShadow="false"
              v-model="logHtml"
              :xssOptions="xssOptions"
              :toolbarsFlag="false"
            />
          </a-tab-pane>
        </a-tabs> -->
        <div ref="editorContainer" style="height: 100vh; width: 100%"></div>
      </a-col>
      <a-col :span="4">
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
                <a-tooltip placement="left">
                  <template slot="title">
                    {{ item.label }}
                  </template>
                  {{ item.value }}
                </a-tooltip>
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
          <div style="margin: 10px">
            <a-textarea
              placeholder="请输入内容"
              :auto-size="{ minRows: 4, maxRows: 4 }"
              allow-clear
            />
            <a-checkbox> 16进制发送 </a-checkbox>
            <a-button type="primary" @click="ddddd"> 发送 </a-button>
          </div>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>
<script>
//const Convert = require("ansi-to-html");
// const convert = new Convert();
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { ByteLengthParser } from "@serialport/parser-byte-length";
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
function getCode() {
  return [
    "[Sun Mar 7 16:02:00 2004] [notice] Apache/1.3.29 (Unix) configured -- resuming normal operations",
    "[Sun Mar 7 16:02:00 2004] [info] Server built: Feb 27 2004 13:56:37",
    "[Sun Mar 7 16:02:00 2004] [notice] Accept mutex: sysvsem (Default: sysvsem)",
    "[Sun Mar 7 16:05:49 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 16:45:56 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 17:13:50 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 17:21:44 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 17:23:53 2004] statistics: Use of uninitialized value in concatenation (.) or string at /home/httpd/twiki/lib/TWiki.pm line 528.",
    "[Sun Mar 7 17:23:53 2004] statistics: Can't create file /home/httpd/twiki/data/Main/WebStatistics.txt - Permission denied",
    "[Sun Mar 7 17:27:37 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 17:31:39 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 17:58:00 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 18:00:09 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 18:10:09 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 18:19:01 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 18:42:29 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 18:52:30 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 18:58:52 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 19:03:58 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 19:08:55 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 20:04:35 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 20:11:33 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 20:12:55 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 20:25:31 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 20:44:48 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 20:58:27 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 21:16:17 2004] [error] [client xx.xx.xx.xx] File does not exist: /home/httpd/twiki/view/Main/WebHome",
    "[Sun Mar 7 21:20:14 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 21:31:12 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 21:39:55 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Sun Mar 7 21:44:10 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 01:35:13 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 01:47:06 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 01:59:13 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 02:12:24 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 02:54:54 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 03:46:27 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 03:48:18 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 03:52:17 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 03:55:09 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 04:22:55 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 04:24:47 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 04:40:32 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 04:55:40 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 04:59:13 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 05:22:57 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 05:24:29 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "[Mon Mar 8 05:31:47 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed",
    "<11>httpd[31628]: [error] [client xx.xx.xx.xx] File does not exist: /usr/local/installed/apache/htdocs/squirrelmail/_vti_inf.html in 29-Mar 15:18:20.50 from xx.xx.xx.xx",
    "<11>httpd[25859]: [error] [client xx.xx.xx.xx] File does not exist: /usr/local/installed/apache/htdocs/squirrelmail/_vti_bin/shtml.exe/_vti_rpc in 29-Mar 15:18:20.54 from xx.xx.xx.xx",
  ].join("\n");
}

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
    ddddd() {
      this.monacoEditor.revealLine(this.monacoEditor.getModel().getLineCount());
    },
    baudRateSelectChange(value) {
      console.info(value);
      this.serial.baudRate = value;
    },
    serialPortListSelectChange(value) {
      console.info(value);
      this.serialPortListSelectValue = value;
      this.serialPortListSelectValueInfo = value;
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
        // const parser = this.serial.serial1.pipe(
        //   new ByteLengthParser({ length: 8 })
        // );
        parser.on("data", (data) => {
          console.info(data);

        //  this.logHtml += convert.toHtml(data) + "\r\n";

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

    // Register a new language
    monaco.languages.register({ id: "mySpecialLanguage" });

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider("mySpecialLanguage", {
      tokenizer: {
        root: [
          [/\[0;31mI (.*?)\[0m/, "custom-31"],
          [/\[0;32mI (.*?)\[0m/, "custom-32"],
          [/\[0;37mI (.*?)\[0m/, "custom-37"],
        ],
      },
    });

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme("myCoolTheme", {
      base: "vs",
      inherit: false,
      rules: [
        { token: "custom-31", foreground: "FF0000" },
        { token: "custom-32", foreground: "008000" },
        { token: "custom-37", foreground: "FFFFFF" },
      ],
      colors: {
        "editor.foreground": "#000000",
      },
    });

    // Register a completion item provider for the new language
    monaco.languages.registerCompletionItemProvider("mySpecialLanguage", {
      provideCompletionItems: () => {
        var suggestions = [
          {
            label: "simpleText",
            kind: monaco.languages.CompletionItemKind.Text,
            insertText: "simpleText",
          },
          {
            label: "testing",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "testing(${1:condition})",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "ifelse",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              "if (${1:condition}) {",
              "\t$0",
              "} else {",
              "\t",
              "}",
            ].join("\n"),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "If-Else Statement",
          },
        ];
        return { suggestions: suggestions };
      },
    });

    this.monacoEditor = monaco.editor.create(this.$refs.editorContainer, {
      value: "",
      // readOnly: true, //只读
      language: "java",
      //   theme: "vs-dark",
      theme: "myCoolTheme",
      language: "mySpecialLanguage",
    });
    this.monacoEditor.addAction({
      id: "menuClear",
      label: "清空",
      precondition: null,
      contextMenuGroupId: "navigation",
      run: (editor, args) => {
        this.monacoEditor.setValue("");
      },
    });
    this.monacoEditor.addAction({
      id: "resetMenu",
      label: "重启",
      precondition: null,
      contextMenuGroupId: "navigation",
      run: (editor, args) => {
        this.serial.serial1.port.set({ dtr: true, rts: true });
        this.serial.serial1.port.set({ dtr: false, rts: true });
        this.serial.serial1.port.set({ dtr: true, rts: true });
      },
    });
    this.monacoEditor.addAction({
      id: "hexMenu",
      label: "十六进制显示",
      precondition: null,
      contextMenuGroupId: "navigation",
      run: (editor, args) => {
      
      },
    });
    // this.monacoEditor.setValue("aaaaaaa");
  },
};
</script>
