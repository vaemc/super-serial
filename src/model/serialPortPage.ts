export interface SerialPortPage {
  title: string;
  closable?: boolean;
  uid: string;
  serial?: {
    baudRate?: string;
    port?: string;
  };
}
