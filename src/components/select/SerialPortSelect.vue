<template>
  <a-select
    v-model:value="selectSerialPort"
    @dropdownVisibleChange="selectFocus"
    @focus="selectFocus"
    @change="selectChange"
  >
    <a-select-option
      v-for="item in serialPortList"
      :key="item.value"
      :value="item.value"
    >
      <a-tooltip placement="left">
        <template #title>{{ item.label }}</template>
        {{ item.value }}
      </a-tooltip>
    </a-select-option>
  </a-select>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { portList } from "../../utils/serial";
export default defineComponent({
  setup() {
    const selectSerialPort = ref();
    const serialPortList = ref<any>([]);
    const refreshSerialPortList = async (showDefaultPort = false) => {
      let list = (await portList()) as any;
      serialPortList.value = list;
      if (list.length > 0 && showDefaultPort) {
        selectSerialPort.value = list[0].value;
      }
    };
    const selectFocus = () => {
      refreshSerialPortList();
    };
    const selectChange = (data: any) => {};
    onMounted(() => {
      refreshSerialPortList(true);
    });
    return {
      serialPortList,
      selectSerialPort,
      selectFocus,
      selectChange,
    };
  },
});
</script>
