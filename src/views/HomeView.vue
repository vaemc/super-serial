<template>
  <a-tabs v-model="activeKey" type="editable-card" @edit="onEdit">
    <a-tab-pane
      v-for="pane in panes"
      :key="pane.key"
      :tab="pane.title"
      :closable="pane.closable"
    >
      <Serial />
    </a-tab-pane>
  </a-tabs>
</template>
<script>
//import Serial from "../components/MonacoEditorSerial.vue";
import Serial from "../components/XtermSerial.vue";
export default {
  components: { Serial },
  data() {
    const panes = [{ title: "串口1", key: "1", closable: false }];
    return {
      activeKey: panes[0].key,
      panes,
      newTabIndex: 2,
    };
  },
  methods: {
    callback(key) {
      console.log(key);
    },
    onEdit(targetKey, action) {
      this[action](targetKey);
    },
    add() {
      const panes = this.panes;
      const activeKey = `串口${this.newTabIndex++}`;
      panes.push({ title: activeKey, key: activeKey });
      this.panes = panes;
      this.activeKey = activeKey;
    },
    remove(targetKey) {
      let activeKey = this.activeKey;
      let lastIndex;
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const panes = this.panes.filter((pane) => pane.key !== targetKey);
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key;
        } else {
          activeKey = panes[0].key;
        }
      }
      this.panes = panes;
      this.activeKey = activeKey;
    },
  },
};
</script>
