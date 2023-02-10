<template>
  <a-tabs v-model:activeKey="activeKey" type="editable-card" @edit="onEdit">
    <a-tab-pane
      v-for="pane in panes"
      :key="pane.key"
      :tab="pane.title"
      :closable="pane.closable"
    >
      <div style="display: flex; flex-direction: row">
        <div style="flex: 1">
          <Terminal />
        </div>
        <div style="flex: 0 0 200px">
          <ToolPanel />
        </div>
      </div>
    </a-tab-pane>
  </a-tabs>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import ToolPanel from "./ToolPanel.vue";
import Terminal from "./Terminal.vue";
import { terminalStore } from "../utils/store";

export default defineComponent({
  components: {
    Terminal,
    ToolPanel,
  },
  setup() {
    const panes = ref<{ title: string; key: string; closable?: boolean }[]>([
      {
        title: "串口1",
        key: "1",
        closable: false,
      },
    ]);

    const activeKey = ref(panes.value[0].key);

    const newTabIndex = ref(1);

    const add = () => {
      activeKey.value = `${++newTabIndex.value}`;
      panes.value.push({
        title: "串口" + activeKey.value,
        key: activeKey.value,
      });

      terminalStore().list.push({ index: activeKey.value });
    };

    const remove = (targetKey: string) => {
      let lastIndex = 0;
      panes.value.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      panes.value = panes.value.filter((pane) => pane.key !== targetKey);
      if (panes.value.length && activeKey.value === targetKey) {
        if (lastIndex >= 0) {
          activeKey.value = panes.value[lastIndex].key;
        } else {
          activeKey.value = panes.value[0].key;
        }
      }
      const list = terminalStore().list.filter((x) => x.index !== targetKey);
      terminalStore().list = list;
    };

    const onEdit = (targetKey: string | MouseEvent, action: string) => {
      if (action === "add") {
        add();
      } else {
        remove(targetKey as string);
      }
    };

    return {
      panes,
      activeKey,
      onEdit,
    };
  },
});
</script>
