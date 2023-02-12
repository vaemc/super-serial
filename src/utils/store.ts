import { defineStore } from "pinia";
import { SerialPortPage } from "../model/serialPortPage";

export const portStore = defineStore("portStore", {
  state: () => ({
    port: "",
  }),
});

// export const lastBaudRateStore = defineStore("portStore", {
//   state: () => ({
//     value: "115200",
//   }),
//   persist: true,
// });

export const serialPortPageStore = defineStore("serialPortPageStore", {
  state: () => ({
    list: [] as SerialPortPage[],
  }),
  persist: true,
});

