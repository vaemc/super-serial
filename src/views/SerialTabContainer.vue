<template>
  <div>
    <a-modal
      v-model="editTabRemarkModalVisible"
      title="串口备注"
      @ok="editTabRemarkModalOk"
    >
      <a-input
        v-model="editTabRemark"
        placeholder="请输入串口备注名称"
        allow-clear
      />

      <div style="margin-top: 10px">
        <span>常用标签:&emsp;</span>
        <a-tag
          style="margin-top: 5px"
          v-for="item in generalRemarkTagList"
          @click="generalRemarkTagClick(item.text)"
          :key="item.text"
          >{{ item.text }}</a-tag
        >
      </div>
    </a-modal>
    <a-tabs v-model="activeKey" type="editable-card" @edit="onEdit">
      <a-tab-pane
        v-for="pane in panes"
        :key="pane.key"
        :closable="pane.closable"
      >
        <span slot="tab" @click="editTabRemarkBtn(pane.key)">
          <a-icon
            v-if="pane.connectState"
            type="thunderbolt"
            theme="twoTone"
            two-tone-color="#52c41a"
          />
          <a-icon v-else type="api" theme="twoTone" two-tone-color="gray" />
          {{ pane.remark == null ? pane.title : pane.remark }}
        </span>
        <XtermTerminal
          :xtermTerminalName="pane.title"
          @updateTabSerialPortConnectState="updateTabSerialPortConnectState"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import XtermTerminal from "../components/XtermTerminal.vue";
export default {
  components: { XtermTerminal },
  data() {
    const panes = [
      { title: "串口1", key: "串口1", connectState: false, closable: false },
    ];
    return {
      generalRemarkTagList: [
        {
          color: "#2db7f5",
          text: "ESP8266",
        },
        {
          color: "#f50",
          text: "ESP32",
        },
        {
          color: "#87d068",
          text: "C2",
        },
        {
          color: "#108ee9",
          text: "C3",
        },
        {
          color: "#108ee9",
          text: "C6",
        },
        {
          color: "#108ee9",
          text: "S2",
        },
        {
          color: "#108ee9",
          text: "S3",
        },
      ],
      editTabRemark: "",
      currentSelectTab: "",
      editTabRemarkModalVisible: false,
      activeKey: panes[0].key,
      panes,
      newTabIndex: 2,
    };
  },
  mounted() {},
  methods: {
    generalRemarkTagClick(text) {
      this.editTabRemark += text;
    },
    updateTabSerialPortConnectState(data) {
      this.panes.forEach((ele) => {
        if (ele.key === data.name) {
          ele.connectState = data.state;
        }
      });
    },
    editTabRemarkModalOk() {
      if (this.editTabRemark == "") {
        this.$message.warn("备注不能为空");
        return;
      }
      this.editTabRemarkModalVisible = false;
      this.panes.forEach((ele) => {
        if (ele.key === this.currentSelectTab) {
          ele.remark = this.editTabRemark;
        }
      });
      this.editTabRemark = "";
    },
    editTabRemarkBtn(name) {
      if (this.activeKey == name) {
        this.editTabRemarkModalVisible = true;
        this.currentSelectTab = name;
      }
    },
    callback(key) {
      console.log(key);
    },
    onEdit(targetKey, action) {
      this[action](targetKey);
    },
    add() {
      const panes = this.panes;
      const activeKey = `串口${this.newTabIndex++}`;
      panes.push({ title: activeKey, key: activeKey, connectState: false });
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
