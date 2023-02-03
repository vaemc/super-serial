<template>
  <div>
    <a-modal
      @cancel="plotterModalVisible = false"
      title="串口绘图"
      :visible="plotterModalVisible"
      width="70vw"
      okText="帮助"
      cancelText="关闭"
      @ok="plotterModalOkBtn"
    >
      <Plotter />
    </a-modal>
    <div style="display: flex; ">
      <div style="flex: 1">
        <div :id="terminalId" style="height: 93vh;"  class="xterm"></div>
        <!-- <div style="width: 100%; padding-left: 10px; background-color: #007acc">
          <span style="color: white; margin-right: 10px"
            >TX：{{ sendDataLength }}Bytes</span
          >
          <span style="color: white; margin-right: 10px"
            >RX：{{ receiveDataLength }}Bytes</span
          >
        </div> -->
      </div>
      <div
        style="
          padding-left: 10px;
          padding-right: 10px;
          display: flex;
          flex-direction: column;
          width: 200px;
        "
      >
        <div style="display: flex; flex-direction: row; margin-bottom: 5px">
          <div style="width: 60px; text-align: right; align-self: center">
            端口：
          </div>
          <a-select
            style="width: 100px"
            v-model="serialPortListSelectDefaultPath"
            @dropdownVisibleChange="serialPortListSelectFocus"
            @focus="serialPortListSelectFocus"
            @change="serialPortListSelectChange"
            :disabled="serialPortOpenBtnIsOpen"
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
        </div>
        <div style="display: flex; flex-direction: row; margin-bottom: 5px">
          <div style="width: 60px; text-align: right; align-self: center">
            波特率：
          </div>
          <a-select
            style="width: 100px"
            defaultValue="115200"
            @change="baudRateSelectChange"
            :disabled="serialPortOpenBtnIsOpen"
          >
            <a-select-option value="9600">9600</a-select-option>
            <a-select-option value="74880">74880</a-select-option>
            <a-select-option value="115200">115200</a-select-option>
            <a-select-option value="2000000">2000000</a-select-option>
          </a-select>
        </div>
        <a-button
          style="margin-bottom: 5px"
          :type="serialPortOpenBtnType"
          @click="serialPortOpenBtn"
        >
          {{ serialPortOpenBtnText }}
        </a-button>

        <a-textarea
          placeholder="请输入内容"
          v-model="sendContent"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          allow-clear
          :disabled="!serialPortOpenBtnIsOpen"
        />

        <a-row style="margin-bottom: 5px">
          <a-col :span="12" style="display: flex; flex-wrap: nowrap">
            <a-checkbox v-model="isSendNewLine">发送新行</a-checkbox></a-col
          >
          <a-col :span="12"> <a-checkbox>发送HEX</a-checkbox> </a-col>
        </a-row>
        <div
          style="display: flex; flex-wrap: wrap; justify-content: flex-start"
        >
          <a-button
            type="primary"
            @click="sendBtn"
            :disabled="!serialPortOpenBtnIsOpen"
            style="margin: 5px; flex: 1"
          >
            发送
          </a-button>
          <a-button
            type="primary"
            @click="restBtn"
            :disabled="!serialPortOpenBtnIsOpen"
            style="margin: 5px; flex: 1"
          >
            重启
          </a-button>
          <a-button
            type="primary"
            @click="clearTerminalContentBtn"
            style="margin: 5px; flex: 1"
          >
            清空
          </a-button>
          <a-button
            @click="openPlotterModal"
            style="margin: 5px; flex: 1"
            type="primary"
          >
            绘图
          </a-button>
          <a-button
            type="primary"
            @click="testBtn"
            style="margin: 5px; flex: 1"
          >
            测试1
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// const pty = require("node-pty");
// const os = require("os");
import { uid } from "uid";

import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { ByteLengthParser } from "@serialport/parser-byte-length";

import "xterm/css/xterm.css";
import "xterm/lib/xterm.js";
import { Terminal } from "xterm";
import { SearchAddon } from "xterm-addon-search";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import { WebglAddon } from "xterm-addon-webgl";
import { CanvasAddon } from "xterm-addon-canvas";
import { LigaturesAddon } from "xterm-addon-ligatures";
import { Unicode11Addon } from "xterm-addon-unicode11";

import Plotter from "../components/Plotter.vue";

export default {
  //  name: "XtermTerminal",
  components: { Plotter },
  props: {
    xtermTerminalName: String,
  },
  data() {
    return {
      plotterModalVisible: false,
      receiveDataLength: 0,
      sendDataLength: 0,
      terminalId: "",
      xssOptions: {
        whiteList: {
          span: ["style"],
        },
      },
      historyInputData: ["AT+GMR", "AT+KKK"],
      isSendNewLine: false,
      serialPortListSelectDefaultPath: "",
      serialPortListSelectValue: "",
      serialPortOpenBtnText: "打开端口",
      serialPortOpenBtnType: "primary",
      serialPortOpenBtnIsOpen: false,
      monacoEditor: {},
      serial: {
        portList: [],
        baudRate: "115200",
        port: {},
      },
      sendContent: "AT+GMR",
    };
  },
  beforeDestroy() {
    if (
      this.serial.port.isOpen != undefined &&
      this.serial.port.isOpen != false
    ) {
      this.serial.port.port.close();
      this.serial.port = null;
    }
  },
  methods: {
    plotterModalOkBtn() {
      this.$notification.open({
        message: "串口数据格式",
        duration: 6,
        description: `  Serial.println(sensorValue); \n
  Serial.print(" ");`,
        icon: <a-icon type="question-circle" style="color: #108ee9" />,
      });
    },
    drawLine() {},
    openPlotterModal() {
      this.plotterModalVisible = true;
    },
    testBtn() {
      new Function("text", "terminal", "terminal.write(text);")(
        "Hello",
        this.terminal
      );
    },
    clearTerminalContentBtn() {
      this.terminal.clear();
      this.receiveDataLength = 0;
      this.sendDataLength = 0;
    },
    sendBtn() {
      console.info(this.sendContent);
      this.serial.port.write(
        this.sendContent + (this.isSendNewLine ? "\r\n" : "")
      );

      this.sendDataLength += this.sendContent.length;
    },
    restBtn() {
      this.serial.port.port.set({ dtr: true, rts: true });
      this.serial.port.port.set({ dtr: false, rts: true });
      this.serial.port.port.set({ dtr: true, rts: true });
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
    serialPortOpenBtn() {
      if (this.serialPortListSelectValue === "") {
        this.$message.warn("请选择端口");
        return;
      }
      if (this.serialPortOpenBtnIsOpen) {
        this.serial.port.port.close();
        this.syncSerialPortConnectState();
      } else if (!this.serialPortOpenBtnIsOpen) {
        this.serial.port = new SerialPort({
          path: this.serialPortListSelectValue,
          baudRate: parseInt(this.serial.baudRate),
          autoOpen: false,
        });

        this.serial.port.on("error", (err) => {
          console.info("error", err);
        });

        this.serial.port.on("close", () => {
          this.syncSerialPortConnectState();
          this.serial.port = null;
          //this.getSerialPortList(true);
        });

        this.serial.port.on("open", () => {
          const parser = this.serial.port.pipe(new ReadlineParser());
          parser.on("data", (data) => {
            //console.info(data);
            this.terminal.writeln(data);

            this.receiveDataLength += data.length;
          });
          this.syncSerialPortConnectState();
        });

        this.serial.port.open((error) => {
          if (error) {
            this.$message.error("端口无法打开，请检查端口是否被占用！");
            return;
          }
        });
      }
    },
    serialPortListSelectFocus() {
      this.getSerialPortList();
    },
    getSerialPortList(isShowDefaultPath = false) {
      SerialPort.list().then((ports) => {
        let list = ports.map((item) => {
          console.info(item);
          return { value: item.path, label: item.friendlyName };
        });
        this.serial.portList = list;

        if (list.length > 0 && isShowDefaultPath) {
          this.serialPortListSelectDefaultPath = list[0].value;
          this.serialPortListSelectValue = list[0].value;
        }
      });
    },
    syncSerialPortConnectState() {
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
    },
    initTerminal() {
      this.getSerialPortList(true);

      // const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
      // const ptyProcess = pty.spawn(shell, [], {
      //   name: "xterm-color",
      //   cols: 80,
      //   rows: 30,
      //   cwd: process.cwd(),
      //   env: process.env,
      // });

      const terminal = new Terminal({
        rendererType: "canvas",
        fontSize: 14,
        allowProposedApi: true,
        disableStdin: false,
        cursorStyle: "underline",
        cursorBlink: true,
        theme: {
          background: "#1e1e1e",
          cursor: "help",
          magenta: "#e39ef7",
        },
      });
      const searchAddon = new SearchAddon();
      terminal.loadAddon(searchAddon);
      searchAddon.findNext("foo");

      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);

      terminal.loadAddon(new WebLinksAddon());

      terminal.loadAddon(new Unicode11Addon());
      terminal.unicode.activeVersion = "11";
      terminal.open(document.getElementById(this.terminalId));
      terminal.loadAddon(new WebglAddon());
      terminal.loadAddon(new CanvasAddon());
      terminal.loadAddon(new LigaturesAddon());
      fitAddon.fit();
      terminal.focus();

      terminal.onData((key) => {
        terminal.write(key);
      });
      this.terminal = terminal;
      // terminal.onKey((e) => {
      //   console.info(e);

      //   const printable =
      //     !e.domEvent.altKey &&
      //     !e.domEvent.altGraphKey &&
      //     !e.domEvent.ctrlKey &&
      //     !e.domEvent.metaKey;
      //   if (e.domEvent.code === "Enter") {
      //     console.info("回车");
      //   } else if (e.domEvent.code === "Backspace") {
      //     terminal.write("\b \b");
      //   } else if (printable) {
      //     terminal.write(e.key);
      //   }
      // });

      // terminal.onLineFeed(() => {
      //   console.info("回车");
      // });

      // terminal.writeln("Welcome to super serial");
      // terminal.prompt();

      //this.terminal.write('这是一个网址 https://www.baidu.com/')
    },
  },
  beforeMount() {
    this.terminalId = uid();
  },
  mounted() {
    this.initTerminal();
  },
};
</script>
