<template>
  <div id="panel">
    <div ref="container" id="com-container"></div>
  </div>
</template>
<script>
import CustomComponent from "../lib";
import "../lib/customNode.js"; // 导入自定义节点定义文件

// import CustomComponent from '../dist/index'

export default {
  name: "App",
  data() {
    return {
      container: null,
      com: null,
      tabRawData: {
        nodes: [
          {
            key: "loadBalancer",
            text: "负载均衡",
            status: "normal",
            combo: "",
            detail: [
              {
                name: "负载均衡利用",
                value: "20%",
              },
              {
                name: "负载均衡内存",
                value: "45%",
              },
            ],
          },
          {
            key: "33.114.5.53",
            text: "33.114.5.53",
            status: "normal",
            combo: "820",
            source: "",
            detail: [
              {
                name: "CPU使用率",
                value: 6.233294,
              },
              {
                name: "物理内存已用量)",
                value: 49804173312,
              },
              {
                name: "磁盘空间使用率",
                value: 18.92779,
              },
              {
                name: "网卡入流量",
                value: 500942,
              },
              {
                name: "网卡出流量",
                value: 439913,
              },
              {
                name: "I/O使用率",
                value: 0.00296,
              },
              {
                name: "5分钟平均负载)",
                value: 2.63,
              },
            ],
            listdetail: {
              name: "33.114.5.53",
              systemResourceLayer: [
                {
                  name: "CPU使用率",
                  value: 6.233294,
                },
                {
                  name: "物理内存已用量)",
                  value: 49804173312,
                },
                {
                  name: "磁盘空间使用率",
                  value: 18.92779,
                },
                {
                  name: "网卡入流量",
                  value: 500942,
                },
                {
                  name: "网卡出流量",
                  value: 439913,
                },
                {
                  name: "I/O使用率",
                  value: 0.00296,
                },
                {
                  name: "5分钟平均负载)",
                  value: 2.63,
                },
                {
                  name: "CPU核心数",
                  value: 32,
                },
                {
                  name: "CPU型号",
                  value: "INTEL(R) XEON(R) GOLD 5520+",
                },
                {
                  name: "内存总量",
                  value: 48023,
                },
                {
                  name: "操作系统",
                  value: "linux suse",
                },
                {
                  name: "磁盘总量",
                  value: 286,
                },
              ],
              applicationSoftwareLayer: [
                {
                  label: "outexception关键字异常",
                  value: 1,
                },
                {
                  label: "17356端口状态",
                  value: 5,
                },
                {
                  label: "告警数量",
                  value: 0,
                },
              ],
              businessServiceLayer: [
                {
                  label: "请求数",
                  value: "1500次/分钟",
                },
                {
                  label: "交易量",
                  value: "1500次/分钟",
                },
                {
                  label: "失败数",
                  value: "5笔/分钟",
                },
                {
                  label: "响应时间",
                  value: "200ms",
                },
              ],
            },
          },
          {
            key: "33.114.5.54",
            text: "33.114.5.54",
            status: "normal",
            combo: "821",
            source: "",
            detail: [
              {
                name: "CPU使用率",
                value: 4.088693,
              },
              {
                name: "物理内存已用量)",
                value: 49829715968,
              },
              {
                name: "磁盘空间使用率",
                value: 17.793992,
              },
              {
                name: "网卡入流量",
                value: 279176,
              },
              {
                name: "网卡出流量",
                value: 253829,
              },
              {
                name: "I/O使用率",
                value: 0.000373,
              },
              {
                name: "5分钟平均负载)",
                value: 1.35,
              },
            ],
            listdetail: {
              name: "33.114.5.54",
              systemResourceLayer: [
                {
                  name: "CPU使用率",
                  value: 4.088693,
                },
                {
                  name: "物理内存已用量)",
                  value: 49829715968,
                },
                {
                  name: "磁盘空间使用率",
                  value: 17.793992,
                },
                {
                  name: "网卡入流量",
                  value: 279176,
                },
                {
                  name: "网卡出流量",
                  value: 253829,
                },
                {
                  name: "I/O使用率",
                  value: 0.000373,
                },
                {
                  name: "5分钟平均负载)",
                  value: 1.35,
                },
                {
                  name: "CPU核心数",
                  value: 32,
                },
                {
                  name: "CPU型号",
                  value: "INTEL(R) XEON(R) GOLD 5520+",
                },
                {
                  name: "内存总量",
                  value: 48023,
                },
                {
                  name: "操作系统",
                  value: "linux suse",
                },
                {
                  name: "磁盘总量",
                  value: 286,
                },
              ],
              applicationSoftwareLayer: [
                {
                  label: "outexception关键字异常",
                  value: 1,
                },
                {
                  label: "告警数量",
                  value: 0,
                },
              ],
              businessServiceLayer: [
                {
                  label: "请求数",
                  value: "1500次/分钟",
                },
                {
                  label: "交易量",
                  value: "1500次/分钟",
                },
                {
                  label: "失败数",
                  value: "5笔/分钟",
                },
                {
                  label: "响应时间",
                  value: "200ms",
                },
              ],
            },
          },
          {
            key: "32.114.72.6",
            text: "32.114.72.6",
            status: "normal",
            combo: "818",
            source: "",
            detail: [],
            listdetail: {
              name: "32.114.72.6",
              systemResourceLayer: [
                {
                  name: "CPU核心数",
                  value: null,
                },
                {
                  name: "CPU型号",
                  value: "",
                },
                {
                  name: "内存总量",
                  value: null,
                },
                {
                  name: "操作系统",
                  value: "",
                },
                {
                  name: "磁盘总量",
                  value: null,
                },
              ],
              applicationSoftwareLayer: [
                {
                  label: "告警数量",
                  value: 0,
                },
              ],
              businessServiceLayer: [
                {
                  label: "请求数",
                  value: "1500次/分钟",
                },
                {
                  label: "交易量",
                  value: "1500次/分钟",
                },
                {
                  label: "失败数",
                  value: "5笔/分钟",
                },
                {
                  label: "响应时间",
                  value: "200ms",
                },
              ],
            },
          },
          {
            key: "35.114.2.167",
            text: "35.114.2.167",
            status: "normal",
            combo: "818",
            source: "",
            detail: [],
            listdetail: {
              name: "35.114.2.167",
              systemResourceLayer: [
                {
                  name: "CPU核心数",
                  value: null,
                },
                {
                  name: "CPU型号",
                  value: "",
                },
                {
                  name: "内存总量",
                  value: null,
                },
                {
                  name: "操作系统",
                  value: "",
                },
                {
                  name: "磁盘总量",
                  value: null,
                },
              ],
              applicationSoftwareLayer: [
                {
                  label: "outexception关键字异常",
                  value: 1,
                },
                {
                  label: "告警数量",
                  value: 5,
                },
              ],
              businessServiceLayer: [
                {
                  label: "请求数",
                  value: "1500次/分钟",
                },
                {
                  label: "交易量",
                  value: "1500次/分钟",
                },
                {
                  label: "失败数",
                  value: "5笔/分钟",
                },
                {
                  label: "响应时间",
                  value: "200ms",
                },
              ],
            },
          },
          {
            key: "172.34.2.177",
            text: "172.34.2.177",
            status: "normal",
            combo: "818",
            source: "",
            detail: [],
            listdetail: {
              name: "172.34.2.177",
              systemResourceLayer: [
                {
                  name: "CPU核心数",
                  value: null,
                },
                {
                  name: "CPU型号",
                  value: "",
                },
                {
                  name: "内存总量",
                  value: null,
                },
                {
                  name: "操作系统",
                  value: "",
                },
                {
                  name: "磁盘总量",
                  value: null,
                },
              ],
              applicationSoftwareLayer: [
                {
                  label: "outexception关键字异常",
                  value: 1,
                },
                {
                  label: "告警数量",
                  value: 1,
                },
              ],
              businessServiceLayer: [
                {
                  label: "请求数",
                  value: "1500次/分钟",
                },
                {
                  label: "交易量",
                  value: "1500次/分钟",
                },
                {
                  label: "失败数",
                  value: "5笔/分钟",
                },
                {
                  label: "响应时间",
                  value: "200ms",
                },
              ],
            },
          },
          {
            key: "37.114.2.166",
            text: "37.114.2.166",
            status: "normal",
            combo: "819",
            source: "",
            detail: [
              {
                name: "CPU使用率",
                value: 0.468955,
              },
              {
                name: "物理内存已用量)",
                value: 46421598208,
              },
              {
                name: "磁盘空间使用率",
                value: 13.873251,
              },
              {
                name: "网卡入流量",
                value: 51613,
              },
              {
                name: "网卡出流量",
                value: 60798,
              },
              {
                name: "I/O使用率",
                value: 0.000107,
              },
              {
                name: "5分钟平均负载)",
                value: 0.38,
              },
            ],
            listdetail: {
              name: "37.114.2.166",
              systemResourceLayer: [
                {
                  name: "CPU使用率",
                  value: 0.468955,
                },
                {
                  name: "物理内存已用量)",
                  value: 46421598208,
                },
                {
                  name: "磁盘空间使用率",
                  value: 13.873251,
                },
                {
                  name: "网卡入流量",
                  value: 51613,
                },
                {
                  name: "网卡出流量",
                  value: 60798,
                },
                {
                  name: "I/O使用率",
                  value: 0.000107,
                },
                {
                  name: "5分钟平均负载)",
                  value: 0.38,
                },
                {
                  name: "CPU核心数",
                  value: 32,
                },
                {
                  name: "CPU型号",
                  value: "INTEL(R) XEON(R) GOLD 5520+",
                },
                {
                  name: "内存总量",
                  value: 48024,
                },
                {
                  name: "操作系统",
                  value: "linux suse",
                },
                {
                  name: "磁盘总量",
                  value: 286,
                },
              ],
              applicationSoftwareLayer: [
                {
                  label: "告警数量",
                  value: 0,
                },
              ],
              businessServiceLayer: [
                {
                  label: "请求数",
                  value: "1500次/分钟",
                },
                {
                  label: "交易量",
                  value: "1500次/分钟",
                },
                {
                  label: "失败数",
                  value: "5笔/分钟",
                },
                {
                  label: "响应时间",
                  value: "200ms",
                },
              ],
            },
          },
          {
            key: "35.114.1.24",
            text: "35.114.1.24",
            status: "normal",
            combo: "819",
            source: "",
            detail: [
              {
                name: "CPU使用率",
                value: 16.760663,
              },
              {
                name: "物理内存已用量)",
                value: 50081943552,
              },
              {
                name: "磁盘空间使用率",
                value: 62.945834,
              },
              {
                name: "网卡入流量",
                value: 590547,
              },
              {
                name: "网卡出流量",
                value: 744768,
              },
              {
                name: "I/O使用率",
                value: 0.00338,
              },
              {
                name: "5分钟平均负载)",
                value: 4.4,
              },
            ],
            listdetail: {
              name: "35.114.1.24",
              systemResourceLayer: [
                {
                  name: "CPU使用率",
                  value: 16.760663,
                },
                {
                  name: "物理内存已用量)",
                  value: 50081943552,
                },
                {
                  name: "磁盘空间使用率",
                  value: 62.945834,
                },
                {
                  name: "网卡入流量",
                  value: 590547,
                },
                {
                  name: "网卡出流量",
                  value: 744768,
                },
                {
                  name: "I/O使用率",
                  value: 0.00338,
                },
                {
                  name: "5分钟平均负载)",
                  value: 4.4,
                },
                {
                  name: "CPU核心数",
                  value: 32,
                },
                {
                  name: "CPU型号",
                  value: "Intel(R) Xeon(R) Gold 5220R CPU @ 2.20GHz",
                },
                {
                  name: "内存总量",
                  value: 48124,
                },
                {
                  name: "操作系统",
                  value: "linux suse",
                },
                {
                  name: "磁盘总量",
                  value: 139,
                },
              ],
              applicationSoftwareLayer: [
                {
                  label: "outexception关键字异常",
                  value: 1,
                },
                {
                  label: "告警数量",
                  value: 0,
                },
              ],
              businessServiceLayer: [
                {
                  label: "请求数",
                  value: "1500次/分钟",
                },
                {
                  label: "交易量",
                  value: "1500次/分钟",
                },
                {
                  label: "失败数",
                  value: "5笔/分钟",
                },
                {
                  label: "响应时间",
                  value: "200ms",
                },
              ],
            },
          },
        ],
        // edges: [
        //   {
        //     source: "loadBalancer",
        //     target: "mainCenter",
        //     status: "normal",
        //     name: "负载均衡器至主中心",
        //     detailValue: [
        //       {
        //         name: "带宽使用率",
        //         value: "45%",
        //       },
        //       {
        //         name: "延迟",
        //         value: "2ms",
        //       },
        //       {
        //         name: "丢包率",
        //         value: "0%",
        //       },
        //     ],
        //     hoverValue: [
        //       {
        //         name: "带宽使用率",
        //         value: "45%",
        //       },
        //       {
        //         name: "延迟",
        //         value: "2ms",
        //       },
        //       {
        //         name: "丢包率",
        //         value: "0%",
        //       },
        //     ],
        //   },
        //   {
        //     source: "loadBalancer",
        //     target: "noneCenter",
        //     status: "normal",
        //     name: "负载均衡器至集群",
        //     detailValue: [
        //       {
        //         name: "带宽使用率",
        //         value: "45%",
        //       },
        //       {
        //         name: "延迟",
        //         value: "2ms",
        //       },
        //       {
        //         name: "丢包率",
        //         value: "0%",
        //       },
        //     ],
        //     hoverValue: [
        //       {
        //         name: "带宽使用率",
        //         value: "45%",
        //       },
        //       {
        //         name: "延迟",
        //         value: "2ms",
        //       },
        //       {
        //         name: "丢包率",
        //         value: "0%",
        //       },
        //     ],
        //   },
        //   {
        //     source: "loadBalancer",
        //     target: "disasterCenter",
        //     status: "normal",
        //     name: "负载均衡器至灾备中心",
        //     detailValue: [
        //       {
        //         name: "带宽使用率",
        //         value: "45%",
        //       },
        //       {
        //         name: "延迟",
        //         value: "2ms",
        //       },
        //       {
        //         name: "丢包率",
        //         value: "0%",
        //       },
        //     ],
        //     hoverValue: [
        //       {
        //         name: "带宽使用率",
        //         value: "45%",
        //       },
        //       {
        //         name: "延迟",
        //         value: "2ms",
        //       },
        //       {
        //         name: "丢包率",
        //         value: "0%",
        //       },
        //     ],
        //   },
        //   {
        //     source: "node2",
        //     target: "node0-1",
        //     status: "normal",
        //     name: "负载均衡器至灾备中心",
        //     detailValue: [
        //       {
        //         name: "带宽使用率",
        //         value: "45%",
        //       },
        //       {
        //         name: "延迟",
        //         value: "2ms",
        //       },
        //       {
        //         name: "丢包率",
        //         value: "0%",
        //       },
        //     ],
        //     hoverValue: [
        //       {
        //         name: "带宽使用率",
        //         value: "45%",
        //       },
        //       {
        //         name: "延迟",
        //         value: "2ms",
        //       },
        //       {
        //         name: "丢包率",
        //         value: "0%",
        //       },
        //     ],
        //   },
        //   {
        //     source: "node2",
        //     target: "node0-2",
        //     status: "normal",
        //     name: "负载均衡器至灾备中心",
        //     detailValue: [
        //       {
        //         name: "带宽使用率",
        //         value: "45%",
        //       },
        //       {
        //         name: "延迟",
        //         value: "2ms",
        //       },
        //       {
        //         name: "丢包率",
        //         value: "0%",
        //       },
        //     ],
        //     hoverValue: [
        //       {
        //         name: "带宽使用率",
        //         value: "45%",
        //       },
        //       {
        //         name: "延迟",
        //         value: "2ms",
        //       },
        //       {
        //         name: "丢包率",
        //         value: "0%",
        //       },
        //     ],
        //   },
        // ],
        combos: [
          {
            id: "818",
            name: "开发环境",
            parentId: "mainCenter",
            status: "normal",
          },
          {
            id: "819",
            name: "SIT环境",
            parentId: "mainCenter",
            status: "normal",
          },
          {
            id: "820",
            name: "UAT环境",
            parentId: "mainCenter",
            status: "normal",
          },
          {
            id: "821",
            name: "准生产环境",
            parentId: "mainCenter",
            status: "normal",
          },
        ],
        comboList: [
          {
            source: "A",
            listdetail: {
              name: "应用集群A",
              Alerts: "0",
              url: "http://73-cluster.com",
              status: "normal",
              values: [
                {
                  name: "CPU利用率",
                  value: "20%",
                },
                {
                  name: "内存利用率",
                  value: "45%",
                },
                {
                  name: "磁盘利用率",
                  value: "35%",
                },
              ],
            },
          },
          {
            source: "B",
            listdetail: {
              name: "应用集群B",
              Alerts: "0",
              url: "http://90-cluster.com",
              status: "normal",
              values: [
                {
                  name: "CPU利用率",
                  value: "15%",
                },
                {
                  name: "内存利用率",
                  value: "38%",
                },
                {
                  name: "磁盘利用率",
                  value: "40%",
                },
              ],
            },
          },
          {
            source: "C",
            listdetail: {
              name: "应用集群C",
              Alerts: "1",
              url: "http://100-cluster.com",
              status: "异常",
              values: [
                {
                  name: "CPU利用率",
                  value: "25%",
                },
                {
                  name: "内存利用率",
                  value: "52%",
                },
                {
                  name: "磁盘利用率",
                  value: "45%",
                },
              ],
            },
          },
          {
            source: "D",
            listdetail: {
              name: "应用集群D",
              Alerts: "0",
              url: "http://116-cluster.com",
              status: "normal",
              values: [
                {
                  name: "CPU利用率",
                  value: "28%",
                },
                {
                  name: "内存利用率",
                  value: "55%",
                },
                {
                  name: "磁盘利用率",
                  value: "48%",
                },
              ],
            },
          },
          {
            source: "E",
            listdetail: {
              name: "应用集群E",
              Alerts: "0",
              url: "http://141-cluster.com",
              status: "normal",
              values: [
                {
                  name: "CPU利用率",
                  value: "30%",
                },
                {
                  name: "内存利用率",
                  value: "60%",
                },
                {
                  name: "磁盘利用率",
                  value: "50%",
                },
              ],
            },
          },
          {
            source: "F",
            listdetail: {
              name: "应用集群F",
              Alerts: "0",
              url: "http://160-cluster.com",
              status: "normal",
              values: [
                {
                  name: "CPU利用率",
                  value: "22%",
                },
                {
                  name: "内存利用率",
                  value: "45%",
                },
                {
                  name: "磁盘利用率",
                  value: "38%",
                },
              ],
            },
          },
        ],
        combosParent: [
          {
            name: "开发测试",
            id: "mainCenter",
            children: ["818", "819", "820", "821"],
            status: "normal",
          },
          {
            name: "",
            id: "noneCenter",
            children: ["G"],
            status: "normal",
          },
          {
            name: "灾备中心",
            id: "disasterCenter",
            children: ["F"],
            status: "idle",
          },
        ],
      },
    };
  },
  mounted() {
    const newObject = Object.fromEntries(
      Object.entries(this.tabRawData).map(([key, value]) => [`"${key}"`, value])
    );
    console.log(JSON.stringify(newObject), "newObject");

    this.com = new CustomComponent();
    this.com.init(
      this.$refs.container,
      {
        legend: {
          fontSize: 12,
          color: "#fff",
        },
        label: {
          show: false,
          color: "#ffffff",
          fontSize: 14,
          lineColor: "rgba(255, 255, 255, 0.45)",
        },
      } // 在组件初始化后执行反缩放
    );
    this.com.resize();
    this.com.setStyle("legend$color", "#ccc");
    this.com.setData(this.tabRawData);
  },
  methods: {},
};
</script>
<style lang="scss">
#panel {
  width: 90vw;
  height: 98vh;
  display: flex;
  align-items: center;
  justify-content: center;
  // 添加变换原点，确保缩放居中
  transform-origin: center center;
}
#com-container {
  width: 100%;
  height: 100%;
  background-color: #0b1421;
  // 确保容器可以正确应用变换
  transform-origin: center center;
}
</style>
