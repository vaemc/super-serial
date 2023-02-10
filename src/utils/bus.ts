import mitt from "mitt";
const emitter = mitt();
export default emitter;

export function terminalWrite(data: string) {
  emitter.emit("terminal", data);
}
