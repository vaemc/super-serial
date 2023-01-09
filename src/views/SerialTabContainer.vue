<template>
  <div>
    <a-modal
      v-model="editTabRemarkModalVisible"
      title="串口备注"
      @ok="editTabRemarkModalOk"
    >
      <a-input v-model="editTabRemark" placeholder="请输入串口备注名称" />
    </a-modal>
    <a-tabs v-model="activeKey" type="editable-card" @edit="onEdit">
      <a-tab-pane
        v-for="pane in panes"
        :key="pane.key"
        :closable="pane.closable"
      >
        <span slot="tab" @click="editTabRemarkBtn(pane.key)">
          <a-icon type="api" theme="twoTone" two-tone-color="gray" />
          <a-icon
            v-if="false"
            type="thunderbolt"
            theme="twoTone"
            two-tone-color="#52c41a"
          />
          {{ pane.remark == null ? pane.title : pane.remark }}
        </span>
        <Serial />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
//import Serial from "../components/MonacoEditorSerial.vue";
import Serial from "../components/XtermTerminal.vue";
export default {
  components: { Serial },
  data() {
    const panes = [{ title: "串口1", key: "串口1", closable: false }];
    return {
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
    editTabRemarkModalOk() {
      if (this.editTabRemark == "") {
        this.$message.warn("备注不能为空");
        return;
      }
      this.editTabRemarkModalVisible = false;
      this.panes.forEach((ele) => {
        console.info(ele);
        if (ele.key === this.currentSelectTab) {
          ele.remark = this.editTabRemark;
        }
      });
      this.editTabRemark == ""
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
