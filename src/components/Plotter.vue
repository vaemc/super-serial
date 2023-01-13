<template>
  <div>
    <div style="margin: 10px;">
      <a-checkbox v-for="item in countries" :checked="true"> {{item}} </a-checkbox>
    </div>
    <div id="echarts1" style="height: 500px; width: 100%"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      countries: [
        "channel3",
        "channel2",
        "channel1",
        "亮度",
        "温度",
        "湿度",
        "adc1",
        "房间温度",
      ]
    };
  },
  mounted() {
    //  this.run();

    this.axios.get("data.json").then((res) => {
      console.info(res.data);

      this.run(res.data);
    });
  },
  methods: {
    run(_rawData) {
      var chartDom = document.getElementById("echarts1");
      var myChart = this.$echarts.init(chartDom);
      var option;

      // var countries = ['Australia', 'Canada', 'China', 'Cuba', 'channel3', 'France', 'Germany', 'Iceland', 'India', 'Japan', 'North Korea', 'South Korea', 'New Zealand', 'Norway', 'Poland', 'Russia', 'Turkey', 'United Kingdom', 'United States'];

      const datasetWithFilters = [];
      const seriesList = [];
      this.$echarts.util.each(this.countries, function (country) {
        var datasetId = "dataset_" + country;
        datasetWithFilters.push({
          id: datasetId,
          fromDatasetId: "dataset_raw",
          transform: {
            type: "filter",
            config: {
              and: [
                { dimension: "Year", gte: 1950 },
                { dimension: "Country", "=": country },
              ],
            },
          },
        });
        seriesList.push({
          type: "line",
          datasetId: datasetId,
          showSymbol: false,
          name: country,
          endLabel: {
            show: true,
            formatter: function (params) {
              return params.value[3] + ": " + params.value[0];
            },
          },
          labelLayout: {
            moveOverlap: "shiftY",
          },
          emphasis: {
            focus: "series",
          },
          encode: {
            x: "Year",
            y: "Income",
            label: ["Country", "Income"],
            itemName: "Year",
            tooltip: ["Income"],
          },
        });
      });
      option = {
        dataZoom: [
          {
            realtime: true,
            type: "slider",
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100,
          },
        ],
        animationDuration: 10000,
        dataset: [
          {
            id: "dataset_raw",
            source: _rawData,
          },
          ...datasetWithFilters,
        ],
        title: {
          text: "COM25",
        },
        tooltip: {
          order: "valueDesc",
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          nameLocation: "middle",
        },
        yAxis: {
          name: "Income",
        },
        grid: {
          right: 140,
        },
        series: seriesList,
      };
      myChart.setOption(option);
    },
  },
};
</script>
