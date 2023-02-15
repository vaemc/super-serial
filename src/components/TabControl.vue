<template>
  <a-modal v-model:visible="modalVisible" title="串口备注" @ok="modalOk">
    <a-input
      v-model:value="inputTabName"
      placeholder="请输入串口名称"
      allow-clear
    />

    <div style="margin-top: 10px">
      <span>常用标签:&emsp;</span>
      <a-tag
        style="margin-top: 5px"
        v-for="item in generalTagList"
        @click="generalTagClick(item.text)"
        :key="item.text"
        >{{ item.text }}</a-tag
      >
    </div>
  </a-modal>
  <a-tabs v-model:activeKey="activeKey" type="editable-card" @edit="onEdit">
    <a-tab-pane v-for="pane in panes" :key="pane.uid" :closable="pane.closable">
      <template #tab>
        <span @click="editTabNameBtn(pane)">
          <api-two-tone two-tone-color="gray" />
          {{ pane.title }}
        </span>
      </template>
      <!-- thunderbolt-two-tone -->
      <div style="display: flex; flex-direction: row">
        <div style="flex: 1">
          <component
            :is="panelComponents.get('Terminal')"
            :uid="pane.uid"
            :key="pane.uid"
          ></component>
        </div>
        <div style="flex: 0 0 200px">
          <component
            :is="panelComponents.get('ToolPanel')"
            :uid="pane.uid"
            :key="pane.uid"
          ></component>
        </div>
      </div>
    </a-tab-pane>
  </a-tabs>
</template>
<script lang="ts">
import { message } from "ant-design-vue";
import { defineAsyncComponent, markRaw, defineComponent, ref } from "vue";
import { serialPortPageStore } from "../utils/store";
import { SerialPortPage } from "../model/serialPortPage";
import { generalTagList } from "../utils/config";
import {
  ThunderboltTwoTone,
  ApiTwoTone,
  AppleOutlined,
} from "@ant-design/icons-vue";
import { uid } from "uid";
export default defineComponent({
  components: {
    ThunderboltTwoTone,
    ApiTwoTone,
    AppleOutlined,
  },
  setup() {
    console.info(serialPortPageStore().list);
    const panelComponents = ref(new Map<string, any>());
    panelComponents.value.set(
      "ToolPanel",
      markRaw(defineAsyncComponent(() => import("./ToolPanel.vue")))
    );
    panelComponents.value.set(
      "Terminal",
      markRaw(defineAsyncComponent(() => import("./Terminal.vue")))
    );

    const uuid = uid();
    const firstTab = {
      title: "串口1",
      key: uuid,
      closable: false,
      uid: uuid,
      serial: {
        baudRate: "115200",
      },
    };

    const panes = ref<SerialPortPage[]>(serialPortPageStore().list);
    if (serialPortPageStore().list.length == 0) {
      serialPortPageStore().list.push(firstTab);
    }
    const activeKey = ref(panes.value[0].uid);
    const add = () => {
      const uuid = uid();
      activeKey.value = uuid;
      const tab = {
        title: "串口" + (panes.value.length + 1),
        uid: uuid,
        serial: {
          baudRate: "115200",
        },
      } as SerialPortPage;
      // panes.value.push(tab);

      serialPortPageStore().list.push(tab);
    };

    const remove = (targetKey: string) => {
      let lastIndex = 0;
      panes.value.forEach((pane, i) => {
        if (pane.uid === targetKey) {
          lastIndex = i - 1;
        }
      });
      panes.value = panes.value.filter((pane) => pane.uid !== targetKey);
      if (panes.value.length && activeKey.value === targetKey) {
        if (lastIndex >= 0) {
          activeKey.value = panes.value[lastIndex].uid;
        } else {
          activeKey.value = panes.value[0].uid;
        }
      }
      const list = serialPortPageStore().list.filter(
        (x) => x.uid !== targetKey
      );
      serialPortPageStore().list = list;
    };

    const onEdit = (targetKey: string | MouseEvent, action: string) => {
      if (action === "add") {
        add();
      } else {
        remove(targetKey as string);
      }
    };

    const inputTabName = ref("");
    const modalVisible = ref(false);
    const modalOk = () => {
      if (inputTabName.value == "") {
        message.warn("备注不能为空");
        return;
      }

      modalVisible.value = false;
      panes.value.forEach((item) => {
        if (item.uid === activeKey.value) {
          item.title = inputTabName.value;
        }
      });
      inputTabName.value = "";
    };
    const generalTagClick = (text: string) => {
      inputTabName.value += text;
    };
    const editTabNameBtn = (data: any) => {
      if (activeKey.value == data.uid) {
        modalVisible.value = true;
        inputTabName.value = data.title;
      }
    };

    return {
      panelComponents,
      generalTagList,
      inputTabName,
      generalTagClick,
      modalOk,
      modalVisible,
      editTabNameBtn,
      panes,
      activeKey,
      onEdit,
    };
  },
});
</script>

<style>
  .ant-tabs-nav {
    margin-bottom: 13px !important;
  }
</style>