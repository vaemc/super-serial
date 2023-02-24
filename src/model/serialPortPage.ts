import { Terminal } from "xterm";
export interface SerialPortPage {
  title: string;
  closable?: boolean;
  uid: string;
  terminal?:Terminal;
  serial?: {
    baudRate?: string;
    port?: string;
  };
}
