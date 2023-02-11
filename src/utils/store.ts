import { defineStore } from "pinia";
export const portStore = defineStore("portStore", {
  state: () => ({
    port: "",
  }),
});

export const lastBaudRateStore = defineStore("portStore", {
  state: () => ({
    value: "115200",
  }),
  persist: true,
});
export const terminalStore = defineStore("terminalStore", {
  state: () => ({
    list: [{ key: 1 }] as any[],
  }),
});
