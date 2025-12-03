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
          // 主中心 - 73集群 (3个节点)
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
            key: "node0-1",
            text: "DB集群1",
            status: "normal",
            combo: "G",
            detail: [
              {
                name: "DB集群CPU利用率",
                value: "20%",
              },
              {
                name: "DB集群内存利用率",
                value: "45%",
              },
            ],
          },
          {
            key: "node0-2",
            text: "DB集群2",
            status: "normal",
            combo: "G",
            detail: [
              {
                name: "DB集群CPU利用率",
                value: "20%",
              },
              {
                name: "DB集群内存利用率",
                value: "45%",
              },
            ],
          },
          {
            key: "node0-3",
            text: "DB集群3",
            status: "normal",
            combo: "G",
            detail: [
              {
                name: "DB集群CPU利用率",
                value: "20%",
              },
              {
                name: "DB集群内存利用率",
                value: "45%",
              },
            ],
          },
          {
            key: "node1",
            text: "73集群",
            status: "normal",
            combo: "A",

            detail: [
              {
                name: "CPU利用率",
                value: "20%",
              },
              {
                name: "内存利用率",
                value: "45%",
              },
            ],
            listdetail: {
              name: "73集群详情",
              Alerts: "0",
              url: "http://73-cluster.com",
              status: "normal",
              systemResourceLayer: [
                {
                  label: "主机状态",
                  value: " 在线",
                  level: "0", //告警等级 0-3 分别对应0-3级告警
                  type: "enum", //枚举
                },
                {
                  label: "主机运行时间",
                  value: "120天",
                  level: "0",
                  type: "numeric", //数值
                },
                {
                  label: "CPU数量",
                  value: "8核",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "内存总量",
                  value: "32GB",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "磁盘总量",
                  value: "1TB",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "网络带宽",
                  value: "1Gbps",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "CPU使用率",
                  value: "20%",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "内存使用率",
                  value: "45%",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "磁盘使用率",
                  value: "35%",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "僵尸进程数量",
                  value: "0",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "监控采集器状态",
                  value: " normal",
                  level: "0",
                  type: "enum",
                },
                {
                  label: "磁盘IO",
                  value: "15%",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "平均负载",
                  value: "1.2",
                  level: "0",
                  type: "numeric",
                },
              ],
              applicationSoftwareLayer: [
                {
                  label: "osb_server4进程状态",
                  value: " 运行中",
                  level: "0",
                  type: "enum",
                },
                {
                  label: "SYN_SEND总数",
                  value: "120",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "SYN_RECV总数",
                  value: "85",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "SOCKET使用量",
                  value: "420",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "监听端口请求量",
                  value: "2450",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "网络接口丢包率",
                  value: "0.01%",
                  level: "0",
                  type: "numeric",
                },
                {
                  label: "僵尸进程数量",
                  value: "0",
                  level: "0",
                  type: "numeric",
                },
              ],
            },
          },
          {
            key: "node2",
            text: "73集群-节点2",
            status: "normal",
            combo: "A",

            detail: [
              {
                name: "CPU利用率",
                value: "18%",
              },
              {
                name: "内存利用率",
                value: "42%",
              },
            ],
          },
          {
            key: "node3",
            text: "73集群-节点3",
            status: "normal",
            combo: "A",

            detail: [
              {
                name: "CPU利用率",
                value: "22%",
              },
              {
                name: "内存利用率",
                value: "48%",
              },
            ],
          },
          // 主中心 - 90集群 (4个节点)
          {
            key: "node4",
            text: "90集群",
            status: "normal",
            combo: "B",

            detail: [
              {
                name: "CPU利用率",
                value: "15%",
              },
              {
                name: "内存利用率",
                value: "38%",
              },
            ],
          },
          {
            key: "node5",
            text: "90集群-节点2",
            status: "normal",
            combo: "B",

            detail: [
              {
                name: "CPU利用率",
                value: "17%",
              },
              {
                name: "内存利用率",
                value: "40%",
              },
            ],
          },
          {
            key: "node6",
            text: "90集群-节点3",
            status: "normal",
            combo: "B",

            detail: [
              {
                name: "CPU利用率",
                value: "19%",
              },
              {
                name: "内存利用率",
                value: "43%",
              },
            ],
          },
          {
            key: "node7",
            text: "90集群-节点4",
            status: "normal",
            combo: "B",

            detail: [
              {
                name: "CPU利用率",
                value: "16%",
              },
              {
                name: "内存利用率",
                value: "39%",
              },
            ],
          },
          // 主中心 - 100集群 (1个节点)
          {
            key: "node8",
            text: "100集群",
            status: "normal",
            combo: "C",

            detail: [
              {
                name: "CPU利用率",
                value: "25%",
              },
              {
                name: "内存利用率",
                value: "52%",
              },
            ],
          },
          // 主中心 - 116集群 (4个节点)
          {
            key: "node9",
            text: "116集群",
            status: "normal",
            combo: "D",

            detail: [
              {
                name: "CPU利用率",
                value: "28%",
              },
              {
                name: "内存利用率",
                value: "55%",
              },
            ],
          },
          {
            key: "node10",
            text: "116集群-节点2",
            status: "normal",
            combo: "D",

            detail: [
              {
                name: "CPU利用率",
                value: "23%",
              },
              {
                name: "内存利用率",
                value: "50%",
              },
            ],
          },
          {
            key: "node11",
            text: "116集群-节点3",
            status: "normal",
            combo: "D",

            detail: [
              {
                name: "CPU利用率",
                value: "26%",
              },
              {
                name: "内存利用率",
                value: "53%",
              },
            ],
          },
          {
            key: "node12",
            text: "116集群-节点4",
            status: "normal",
            combo: "D",

            detail: [
              {
                name: "CPU利用率",
                value: "24%",
              },
              {
                name: "内存利用率",
                value: "51%",
              },
            ],
          },
          // 主中心 - 141集群 (4个节点)
          {
            key: "node13",
            text: "141集群",
            status: "normal",
            combo: "E",

            detail: [
              {
                name: "CPU利用率",
                value: "30%",
              },
              {
                name: "内存利用率",
                value: "60%",
              },
            ],
          },
          {
            key: "node14",
            text: "141集群-节点2",
            status: "normal",
            combo: "E",

            detail: [
              {
                name: "CPU利用率",
                value: "27%",
              },
              {
                name: "内存利用率",
                value: "58%",
              },
            ],
          },
          {
            key: "node15",
            text: "141集群-节点3",
            status: "normal",
            combo: "E",

            detail: [
              {
                name: "CPU利用率",
                value: "29%",
              },
              {
                name: "内存利用率",
                value: "59%",
              },
            ],
          },
          {
            key: "node16",
            text: "141集群-节点4",
            status: "normal",
            combo: "E",

            detail: [
              {
                name: "CPU利用率",
                value: "28%",
              },
              {
                name: "内存利用率",
                value: "57%",
              },
            ],
          },
          // 灾备中心 - 160集群 (3个节点)
          {
            key: "node17",
            text: "160集群",
            status: "idle",
            combo: "F",

            detail: [
              {
                name: "CPU利用率",
                value: "22%",
              },
              {
                name: "内存利用率",
                value: "45%",
              },
            ],
          },
          {
            key: "node18",
            text: "160集群-节点2",
            status: "idle",
            combo: "F",

            detail: [
              {
                name: "CPU利用率",
                value: "20%",
              },
              {
                name: "内存利用率",
                value: "42%",
              },
            ],
          },
          {
            key: "node19",
            text: "160集群-节点3",
            status: "idle",
            combo: "F",

            detail: [
              {
                name: "CPU利用率",
                value: "24%",
              },
              {
                name: "内存利用率",
                value: "48%",
              },
            ],
          },
        ],
        edges: [
          {
            source: "loadBalancer", // 负载均衡器节点
            target: "mainCenter", // 主中心
            status: "normal",
            name: "负载均衡器至主中心",
            detailValue: [
              { name: "带宽使用率", value: "45%" },
              { name: "延迟", value: "2ms" },
              { name: "丢包率", value: "0%" },
            ],
            hoverValue: [
              { name: "带宽使用率", value: "45%" },
              { name: "延迟", value: "2ms" },
              { name: "丢包率", value: "0%" },
            ],
          },
          {
            source: "loadBalancer", // 负载均衡器节点
            target: "noneCenter", //
            status: "normal",
            name: "负载均衡器至集群",
            detailValue: [
              { name: "带宽使用率", value: "45%" },
              { name: "延迟", value: "2ms" },
              { name: "丢包率", value: "0%" },
            ],
            hoverValue: [
              { name: "带宽使用率", value: "45%" },
              { name: "延迟", value: "2ms" },
              { name: "丢包率", value: "0%" },
            ],
          },
          {
            source: "loadBalancer", // 负载均衡器节点
            target: "disasterCenter", // 灾备中心
            status: "normal",
            name: "负载均衡器至灾备中心",
            detailValue: [
              { name: "带宽使用率", value: "45%" },
              { name: "延迟", value: "2ms" },
              { name: "丢包率", value: "0%" },
            ],
            hoverValue: [
              { name: "带宽使用率", value: "45%" },
              { name: "延迟", value: "2ms" },
              { name: "丢包率", value: "0%" },
            ],
          },
          {
            source: "node2", // 负载均衡器节点
            target: "node0-1", // 灾备中心
            status: "normal",
            name: "负载均衡器至灾备中心",
            detailValue: [
              { name: "带宽使用率", value: "45%" },
              { name: "延迟", value: "2ms" },
              { name: "丢包率", value: "0%" },
            ],
            hoverValue: [
              { name: "带宽使用率", value: "45%" },
              { name: "延迟", value: "2ms" },
              { name: "丢包率", value: "0%" },
            ],
          },
          {
            source: "node2", // 负载均衡器节点
            target: "node0-2", // 灾备中心
            status: "normal",
            name: "负载均衡器至灾备中心",
            detailValue: [
              { name: "带宽使用率", value: "45%" },
              { name: "延迟", value: "2ms" },
              { name: "丢包率", value: "0%" },
            ],
            hoverValue: [
              { name: "带宽使用率", value: "45%" },
              { name: "延迟", value: "2ms" },
              { name: "丢包率", value: "0%" },
            ],
          },
        ],
        combos: [
          {
            id: "A",
            name: "应用集群A",
            parentId: "mainCenter",
            status: "normal",
          },
          {
            id: "B",
            name: "应用集群B",
            parentId: "mainCenter",
            status: "normal",
          },
          {
            id: "C",
            name: "应用集群C",
            parentId: "mainCenter",
            status: "normal",
          },
          {
            id: "D",
            name: "应用集群D",
            parentId: "mainCenter",
            status: "normal",
          },
          {
            id: "E",
            name: "应用集群E",
            parentId: "mainCenter",
            status: "normal",
          },
          {
            id: "F",
            name: "应用集群F",
            parentId: "disasterCenter",
            status: "idle", //状态为闲置时，combo颜色为绿色
          },
          {
            id: "G",
            name: "DB集群",
            parentId: "noneCenter",
            status: "normal",
          },
        ],
        // 组合详情数据
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
        // 新增的combosParent结构
        combosParent: [
          {
            name: "主中心",
            id: "mainCenter",
            children: ["A", "B", "C", "D", "E"],
            status: "normal", //状态为normal时，combo颜色为默认颜色蓝色
          },
          {
            name: "",
            id: "noneCenter",
            children: ["G"],
            status: "normal", //状态为normal时，combo颜色为默认颜色蓝色
          },
          {
            name: "灾备中心",
            id: "disasterCenter",
            children: ["F"],
            status: "idle", //状态为闲置时，combo颜色为绿色
          },
        ],
      },
    };
  },
  mounted() {
    //   const newObject = Object.fromEntries(
    //     Object.entries(this.tabRawData).map(([key, value]) => [ `"${key}"`, value ])
    // );
    // console.log(JSON.stringify(newObject),'newObject');

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
  // background-color: #0b1421;
  // 确保容器可以正确应用变换
  transform-origin: center center;
}
</style>
