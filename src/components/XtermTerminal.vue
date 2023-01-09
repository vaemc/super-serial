<template>
  <div>
    <a-row type="flex">
      <a-col :span="20">
        <div :id="terminalId" style="height: 90vh" class="xterm"></div>
      </a-col>
      <a-col :span="4">
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
            <a-select defaultValue="115200" @change="baudRateSelectChange" :disabled="serialPortOpenBtnIsOpen">
              <a-select-option value="9600">9600</a-select-option>
              <a-select-option value="74880">74880</a-select-option>
              <a-select-option value="115200">115200</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button :type="serialPortOpenBtnType" @click="serialPortOpenBtn">
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

            <a-checkbox v-model="isSendNewLine">发送新行</a-checkbox>
            <a-checkbox>16进制发送</a-checkbox>
            <a-button
              type="primary"
              @click="sendBtn"
              :disabled="!serialPortOpenBtnIsOpen"
            >
              发送
            </a-button>
            <a-button
              type="primary"
              @click="restBtn"
              :disabled="!serialPortOpenBtnIsOpen"
            >
              重启
            </a-button>
            <a-button
              type="primary"
              @click="clearTerminalBtn"
              style="margin-top: 5px"
            >
              清空
            </a-button>
          </div>
        </a-form>
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
  // name: "XtermTerminal",
  data() {
    return {
      terminalId: "",
      xssOptions: {
        whiteList: {
          span: ["style"],
        },
      },
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
    clearTerminalBtn() {
      this.terminal.clear();
    },
    sendBtn() {
      console.info(this.sendContent);
      this.serial.port.write(
        this.sendContent + (this.isSendNewLine ? "\r\n" : "")
      );
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
        this.serialPortOpenBtnIsOpen = false;
        this.serialPortOpenBtnText = "打开端口";
        this.serialPortOpenBtnType = "primary";
        this.serial.port.port.close();
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
          this.serial.port = null;
          this.serialPortOpenBtnIsOpen = false;
          this.serialPortOpenBtnText = "打开端口";
          this.serialPortOpenBtnType = "primary";
        });

        this.serial.port.on("open", () => {
          const parser = this.serial.port.pipe(
            new ReadlineParser({ delimiter: "\r\n" })
          );
          parser.on("data", (data) => {
            //console.info(data);
            this.terminal.write(data + "\r\n");
          });
          this.serialPortOpenBtnText = "关闭端口";
          this.serialPortOpenBtnType = "danger";
          this.serialPortOpenBtnIsOpen = true;
        });

        this.serial.port.open((error) => {
          if (error) {
            this.$message.error("端口无法打开，请查看端口是否被占用！");
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
