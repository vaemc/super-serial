import mitt from "mitt";
const emitter = mitt();
export default emitter;

export function terminalWrite(uid: string, data: string) {
  emitter.emit(uid, data);
}
