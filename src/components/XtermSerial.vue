<template>
  <div>
    <a-row type="flex">
      <a-col :span="20">
        <div id="xterm" style="height: 90vh" class="xterm"></div>
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
          </div>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>
<script>
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
  name: "HomeView",
  data() {
    return {
      xssOptions: {
        whiteList: {
          span: ["style"],
        },
      },
      isSendNewLine:false,
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
      sendContent: "",
    };
  },
  methods: {
    sendBtn() {
      console.info(this.sendContent);
      this.serial.port.write(this.sendContent + (this.isSendNewLine?"\r\n":""));
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
    const terminal = new Terminal({
      fontSize: 14,
      allowProposedApi: true,
    });
    const searchAddon = new SearchAddon();
    terminal.loadAddon(searchAddon);
    searchAddon.findNext("foo");

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.loadAddon(new WebLinksAddon());

    terminal.loadAddon(new Unicode11Addon());
    terminal.unicode.activeVersion = "11";

    terminal.open(document.getElementById("xterm"));
    terminal.loadAddon(new WebglAddon());
    terminal.loadAddon(new CanvasAddon());
    terminal.loadAddon(new LigaturesAddon());
    fitAddon.fit();
    terminal.focus();
    this.terminal = terminal;

    // this.terminal.write('这是一个网址 https://www.baidu.com/')
  },
};
</script>
