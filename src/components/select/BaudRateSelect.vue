<template>
  <a-select :defaultValue="defaultBaudRate" style="width: 100px" @change="selectedChange" :options="baudRateList">
  </a-select>
</template>
<script  lang="ts">
import { defineComponent, ref, toRefs, onMounted } from "vue";
const number = ["9600", "74880", "115200", "2000000"];

export default defineComponent({
  props: {
    defaultBaudRate: String
  },
  setup(props, { emit }) {


    const { defaultBaudRate } = toRefs(props);


    onMounted(() => {
      emit("baudRateChange", defaultBaudRate.value);
    })
    const selectedChange = (data: string) => {
      emit("baudRateChange", data)
    };
    const baudRateList = ref(
      number.map((item) => {
        return { value: item, label: item };
      })
    );
    return {
      baudRateList,
      selectedChange,
      defaultBaudRate
    }
  }
})



</script>
