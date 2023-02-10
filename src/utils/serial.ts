import { SerialPort } from "serialport";

export default SerialPort;

export async function portList() {
  let list = await SerialPort.list();
  return list.map((item) => {
    return { value: item.path, label: (item as any).friendlyName };
  });
}
