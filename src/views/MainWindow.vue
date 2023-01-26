<template>
  <div class="main">
    <div class="titlebar">

      <div class="title">SuperSerial</div>

    </div>
    <div class="content">

      <vue-tabs-chrome theme="dark" ref="tab" v-model="tab" :tabs="tabs" @click="handleClick">
        <button slot="after" style="height: 20px line-height: 20px; padding: 0 10px;" @click="addTab">➕</button>
      </vue-tabs-chrome>

      <div style="height:calc( 100% - 48px);">

        <XtermTerminal style="height: 100%;" id="XtermTerminal" xtermTerminalName="pane.title"
          @updateTabSerialPortConnectState="updateTabSerialPortConnectState" />

      </div>

    </div>
  </div>
</template>
<script>
import VueTabsChrome from 'vue-tabs-chrome'
import XtermTerminal from "../components/XtermTerminal.vue";
export default {
  components: { VueTabsChrome, XtermTerminal },
  data() {

    return {
      tab: '串口1',
      tabs: [
        {
          label: '串口1',
          key: '串口1',
          closable: false,
        },
        {
          label: '串口2',
          key: '串口2',
        },
        {
          label: '串口3',
          key: '串口3'
        }
      ]
    };
  },
  mounted() { },
  methods: {
    updateTabSerialPortConnectState(data) {

    },
    addTab() {
      let item = 'tab' + Date.now()
      let newTabs = [
        {
          label: 'New Tab',
          key: item
        }
      ]
      this.$refs.tab.addTab(...newTabs)
      this.tab = item
    },
    handleClick(e, tab, i) {
      console.info(e, tab, i)
    }
  },
};
</script>
<style lang="scss" scoped>
$titleBarHeight: 30px;
$titleBarBg: #333639;

.main {
  height: 100%;
  background-color: $titleBarBg;
  display: flex;
  flex-flow: column;
}

.titlebar {
  height: $titleBarHeight;
  -webkit-app-region: drag;
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  .title {
    display: flex;
    color: #fafafa;
  }
}

.content {
  // background-color: #fafafa;
  flex: 1 1 auto;
}
</style>