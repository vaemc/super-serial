<template>
  <a-select defaultValue="115200" style="width: 100px"  :options="baudRateList"> </a-select>
</template>
<script setup lang="ts">
import { ref } from "vue";
const number = ["9600", "74880", "115200", "2000000"];

const baudRateList = ref(
  number.map((item) => {
    return { value: item, label: item };
  })
);
</script>
