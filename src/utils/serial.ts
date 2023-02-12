import mitt from "mitt";
const emitter = mitt();
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

export async function portList() {
  let list = await SerialPort.list();
  return list.map((item) => {
    return { value: item.path, label: (item as any).friendlyName };
  });
}

// export function openSerialPort(uid: string, port: string, baudRate: number) {
//   const serialPort = new SerialPort({
//     path: port,
//     baudRate: baudRate,
//     autoOpen: false,
//   });

//   serialPort.on("close", () => {});

//   serialPort.on("open", () => {
//     const parser = serialPort.pipe(new ReadlineParser());
//     parser.on("data", (data) => {
//       //console.info(data);
//       // this.terminal.writeln(data);
//       emitter.emit(uid);
//     });
//     // this.syncSerialPortConnectState();
//     emitter.emit(uid);
//   });

//   serialPort.open((error) => {
//     if (error) {
//       //端口无法打开
//       emitter.emit(uid);
//     }
//   });
// }

// serialPortOpenBtn() {
//   if (this.serialPortListSelectValue === "") {
//     this.$message.warn("请选择端口");
//     return;
//   }
//   if (this.serialPortOpenBtnIsOpen) {
//     this.serial.port.port.close();
//     this.syncSerialPortConnectState();
//   } else if (!this.serialPortOpenBtnIsOpen) {
//     this.serial.port = new SerialPort({
//       path: this.serialPortListSelectValue,
//       baudRate: parseInt(this.serial.baudRate),
//       autoOpen: false,
//     });

//     this.serial.port.on("error", (err) => {
//       console.info("error", err);
//     });

//     this.serial.port.on("close", () => {
//       this.syncSerialPortConnectState();
//       this.serial.port = null;
//       //this.getSerialPortList(true);
//     });

//     this.serial.port.on("open", () => {
//       const parser = this.serial.port.pipe(new ReadlineParser());
//       parser.on("data", (data) => {
//         //console.info(data);
//         this.terminal.writeln(data);

//         this.receiveDataLength += data.length;
//       });
//       this.syncSerialPortConnectState();
//     });

//     this.serial.port.open((error) => {
//       if (error) {
//         this.$message.error("端口无法打开，请检查端口是否被占用！");
//         return;
//       }
//     });
//   }
// },
