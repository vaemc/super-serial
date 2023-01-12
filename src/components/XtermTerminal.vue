<template>
  <div>
    <a-modal
      @cancel="plotterVisible = false"
      title="Title"
      :visible="plotterVisible"
    >
      <a-button @click="aaa" type="primary">aaa</a-button>
      <div style="width: 400px;height: 300px;" id="plotterChart"></div>
    </a-modal>

    <a-row type="flex">
      <a-col :span="20">
        <div
          :id="terminalId"
          style="height: calc(100vh - 56px)"
          class="xterm"
        ></div>
      </a-col>
      <a-col :span="4">
        <div style="height: calc(100vh - 56px)">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
            <a-form-item label="端口">
              <a-select
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
            </a-form-item>
            <a-form-item label="波特率">
              <a-select
                defaultValue="115200"
                @change="baudRateSelectChange"
                :disabled="serialPortOpenBtnIsOpen"
              >
                <a-select-option value="9600">9600</a-select-option>
                <a-select-option value="74880">74880</a-select-option>
                <a-select-option value="115200">115200</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
              <a-button
                :type="serialPortOpenBtnType"
                @click="serialPortOpenBtn"
              >
                {{ serialPortOpenBtnText }}
              </a-button>
            </a-form-item>
            <div style="margin: 10px">
              <a-textarea
                placeholder="请输入内容"
                v-model="sendContent"
                :auto-size="{ minRows: 4, maxRows: 4 }"
                allow-clear
                :disabled="!serialPortOpenBtnIsOpen"
              />

              <a-row style="margin-top: 5px">
                <a-col :span="12">
                  <a-checkbox v-model="isSendNewLine"
                    >发送新行</a-checkbox
                  ></a-col
                >
                <a-col :span="12"> <a-checkbox>发送HEX</a-checkbox> </a-col>
              </a-row>

              <a-row style="margin-top: 5px">
                <a-col :span="12">
                  <a-button
                    type="primary"
                    @click="sendBtn"
                    :disabled="!serialPortOpenBtnIsOpen"
                  >
                    发送
                  </a-button>
                </a-col>

                <a-col :span="12">
                  <a-button
                    type="primary"
                    @click="restBtn"
                    :disabled="!serialPortOpenBtnIsOpen"
                  >
                    重启
                  </a-button>
                </a-col>
              </a-row>

              <a-row style="margin-top: 5px">
                <a-col :span="12">
                  <a-button
                    type="primary"
                    @click="clearTerminalContentBtn"
                    style="margin-top: 5px"
                  >
                    清空
                  </a-button>
                </a-col>

                <a-col :span="12">
                  <a-button
                    @click="openPlotterModal"
                    style="margin-top: 5px"
                    type="primary"
                  >
                    绘图
                  </a-button></a-col
                >
              </a-row>

              <a-row style="margin-top: 5px">
                <a-col :span="12">
                  <a-button
                    type="primary"
                    @click="testBtn"
                    style="margin-top: 5px"
                  >
                    测试1
                  </a-button>
                </a-col>

                <a-col :span="12"> </a-col>
              </a-row>

              <div
                style="
                  height: 200px;
                  display: flex;
                  align-content: flex-end;
                  align-items: flex-end;
                "
              >
                <div>
                  <p>TX：{{ sendDataLength }}Bytes</p>
                  <p>RX：{{ receiveDataLength }}Bytes</p>
                </div>
              </div>
            </div>
          </a-form>
        </div>
      </a-col>
    </a-row>
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
export default {
  //  name: "XtermTerminal",
  props: {
    xtermTerminalName: String,
  },
  data() {
    return {
      plotterVisible: false,
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
    aaa() {
      this.drawLine();
    },
    drawLine() {
      var myChart = this.$echarts.init(document.getElementById('plotterChart'));
      
      var option = {
        title: {
          text: '串口绘图',
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['数据1','数据2','数据3','数据4','数据5','数据6']
        },
        yAxis: {},
        series: [{
          name: '数据a',
          type: 'line',
          data: [5,20,36,10,10,20]
        }]
      };
      myChart.setOption(option);
    },
    openPlotterModal() {
      this.plotterVisible = true;
    },
    testBtn() {
      new Function("text", "terminal", "terminal.write(text);")(
        "Hello",
        this.terminal
      );
    },
    clearTerminalContentBtn() {
      this.terminal.clear();
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

      //const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
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

      this.terminal = terminal;

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
