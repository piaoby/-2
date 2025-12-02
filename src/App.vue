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
            source: "负载均衡器",
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
            source: "DB集群1",
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
            source: "DB集群2",
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
            source: "DB集群3",
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
            source: "模块.svg",
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
          },
          {
            key: "node2",
            text: "73集群-节点2",
            status: "normal",
            combo: "A",
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
            source: "模块.svg",
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
        // edges: [
        //   {
        //     source: "loadBalancer", // 负载均衡器节点
        //     target: "mainCenter", // 主中心
        //     status: "normal",
        //     name: "负载均衡器至主中心",
        //     detailValue: [
        //       { name: "带宽使用率", value: "45%" },
        //       { name: "延迟", value: "2ms" },
        //       { name: "丢包率", value: "0%" },
        //     ],
        //     hoverValue: [
        //       { name: "带宽使用率", value: "45%" },
        //       { name: "延迟", value: "2ms" },
        //       { name: "丢包率", value: "0%" },
        //     ],
        //   },
        //   {
        //     source: "mainCenter", // 主中心
        //     target: "loadBalancer", // 负载均衡器节点
        //     status: "warning",
        //     name: "主中心至负载均衡器",
        //     detailValue: [
        //       { name: "带宽使用率", value: "32%" },
        //       { name: "延迟", value: "2ms" },
        //       { name: "丢包率", value: "0%" },
        //     ],
        //   },
        //   // 负载均衡器到灾备中心的双向连接
        //   {
        //     source: "loadBalancer", // 负载均衡器节点
        //     target: "disasterCenter", // 灾备中心
        //     status: "normal",
        //     name: "负载均衡器至灾备中心",
        //     detailValue: [
        //       { name: "带宽使用率", value: "45%" },
        //       { name: "延迟", value: "2ms" },
        //       { name: "丢包率", value: "0%" },
        //     ],
        //     hoverValue: [
        //       { name: "带宽使用率", value: "45%" },
        //       { name: "延迟", value: "2ms" },
        //       { name: "丢包率", value: "0%" },
        //     ],
        //   },
        //   {
        //     source: "disasterCenter", // 灾备中心
        //     target: "loadBalancer", // 负载均衡器节点
        //     status: "normal",
        //     name: "灾备中心至 负载均衡器",
        //     detailValue: [
        //       { name: "带宽使用率", value: "45%" },
        //       { name: "延迟", value: "2ms" },
        //       { name: "丢包率", value: "0%" },
        //     ],
        //     hoverValue: [
        //       { name: "带宽使用率", value: "45%" },
        //       { name: "延迟", value: "2ms" },
        //       { name: "丢包率", value: "0%" },
        //     ],
        //   },
        //   {
        //     source: "A", // 应用集群A
        //     target: "G", // DB集群
        //     status: "normal",
        //     name: "应用集群A至DB集群",
        //     detailValue: [
        //       { name: "带宽使用率", value: "35%" },
        //       { name: "延迟", value: "3ms" },
        //       { name: "丢包率", value: "0%" },
        //     ],
        //     hoverValue: [
        //       { name: "带宽使用率", value: "35%" },
        //       { name: "延迟", value: "3ms" },
        //       { name: "丢包率", value: "0%" },
        //     ],
        //   },
        //   {
        //     source: "G",
        //     target: "A",
        //     status: "normal",
        //     name: "DB集群至应用集群A",
        //     detailValue: [
        //       { name: "带宽使用率", value: "35%" },
        //       { name: "延迟", value: "3ms" },
        //       { name: "丢包率", value: "0%" },
        //     ],
        //     hoverValue: [
        //       { name: "带宽使用率", value: "35%" },
        //       { name: "延迟", value: "3ms" },
        //       { name: "丢包率", value: "0%" },
        //     ],
        //   },
        // ],
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
        // 节点详情数据
        nodeList: [
          {
            source: "node1",
            listdetail: [
              {
                name: "73集群详情",
                Alerts: "0",
                url: "http://73-cluster.com",
                status: "normal",
                systemResourceLayer: [
                  {
                    label: "主机状态",
                    value: "🟢 在线",
                    trend: "up",
                  },
                  {
                    label: "主机运行时间",
                    value: "120天",
                    trend: "flat",
                  },
                  {
                    label: "CPU数量",
                    value: "8核",
                    trend: "flat",
                  },
                  {
                    label: "内存总量",
                    value: "32GB",
                    trend: "flat",
                  },
                  {
                    label: "磁盘总量",
                    value: "1TB",
                    trend: "flat",
                  },
                  {
                    label: "网络带宽",
                    value: "1Gbps",
                    trend: "flat",
                  },
                  {
                    label: "CPU使用率",
                    value: "20%",
                    trend: "up",
                  },
                  {
                    label: "内存使用率",
                    value: "45%",
                    trend: "up",
                  },
                  {
                    label: "磁盘使用率",
                    value: "35%",
                    trend: "down",
                  },
                  {
                    label: "僵尸进程数量",
                    value: "0",
                    trend: "flat",
                  },
                  {
                    label: "监控采集器状态",
                    value: "🟢 normal",
                    trend: "flat",
                  },
                  {
                    label: "磁盘IO",
                    value: "15%",
                    trend: "up",
                  },
                  {
                    label: "平均负载",
                    value: "1.2",
                    trend: "up",
                  },
                ],
                applicationSoftwareLayer: [
                  {
                    label: "osb_server4进程状态",
                    value: "🟢 运行中",
                    trend: "flat",
                  },
                  {
                    label: "SYN_SEND总数",
                    value: "120",
                    trend: "up",
                  },
                  {
                    label: "SYN_RECV总数",
                    value: "85",
                    trend: "up",
                  },
                  {
                    label: "SOCKET使用量",
                    value: "420",
                    trend: "up",
                  },
                  {
                    label: "监听端口请求量",
                    value: "2450",
                    trend: "up",
                  },
                  {
                    label: "网络接口丢包率",
                    value: "0.01%",
                    trend: "down",
                  },
                  {
                    label: "僵尸进程数量",
                    value: "0",
                    trend: "flat",
                  },
                ],
                businessServiceLayer: [
                  {
                    label: "响应率",
                    value: "99.9%",
                    trend: "up",
                  },
                  {
                    label: "成功率",
                    value: "99.5%",
                    trend: "up",
                  },
                  {
                    label: "交易量阈值",
                    value: "5000TPS",
                    trend: "flat",
                  },
                  {
                    label: "平均响应时间",
                    value: "120ms",
                    trend: "down",
                  },
                  {
                    label: "错误请求数",
                    value: "5",
                    trend: "down",
                  },
                ],
                operationList: [
                  {
                    label: "操作1",
                    value: "三板斧应急操作",
                  },
                  {
                    label: "操作2",
                    value: "告警详情查看",
                  },
                ],
              },
            ],
          },
        ],
        // 组合详情数据
        comboList: [
          {
            source: "A",
            listdetail: [
              // 73集群节点详情
              {
                name: "73集群",
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
              {
                name: "73集群-节点2",
                Alerts: "1",
                url: "http://73-node2.com",
                status: "异常",
                values: [
                  {
                    name: "CPU利用率",
                    value: "18%",
                  },
                  {
                    name: "内存利用率",
                    value: "42%",
                  },
                  {
                    name: "磁盘利用率",
                    value: "38%",
                  },
                ],
              },
              {
                name: "73集群-节点3",
                Alerts: "0",
                url: "http://73-node3.com",
                status: "normal",
                values: [
                  {
                    name: "CPU利用率",
                    value: "22%",
                  },
                  {
                    name: "内存利用率",
                    value: "48%",
                  },
                  {
                    name: "磁盘利用率",
                    value: "32%",
                  },
                ],
              },
            ],
          },
          {
            source: "B",
            listdetail: [
              // 90集群节点详情
              {
                name: "90集群",
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
              {
                name: "90集群-节点2",
                Alerts: "0",
                url: "http://90-node2.com",
                status: "normal",
                values: [
                  {
                    name: "CPU利用率",
                    value: "17%",
                  },
                  {
                    name: "内存利用率",
                    value: "40%",
                  },
                  {
                    name: "磁盘利用率",
                    value: "39%",
                  },
                ],
              },
              {
                name: "90集群-节点3",
                Alerts: "2",
                url: "http://90-node3.com",
                status: "异常",
                values: [
                  {
                    name: "CPU利用率",
                    value: "19%",
                  },
                  {
                    name: "内存利用率",
                    value: "43%",
                  },
                  {
                    name: "磁盘利用率",
                    value: "41%",
                  },
                ],
              },
              {
                name: "90集群-节点4",
                Alerts: "0",
                url: "http://90-node4.com",
                status: "normal",
                values: [
                  {
                    name: "CPU利用率",
                    value: "16%",
                  },
                  {
                    name: "内存利用率",
                    value: "39%",
                  },
                  {
                    name: "磁盘利用率",
                    value: "37%",
                  },
                ],
              },
            ],
          },
          {
            source: "C",
            listdetail: [
              // 100集群节点详情
              {
                name: "100集群",
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
            ],
          },
          {
            source: "D",
            listdetail: [
              // 116集群节点详情
              {
                name: "116集群",
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
              {
                name: "116集群-节点2",
                Alerts: "0",
                url: "http://116-node2.com",
                status: "normal",
                values: [
                  {
                    name: "CPU利用率",
                    value: "23%",
                  },
                  {
                    name: "内存利用率",
                    value: "50%",
                  },
                  {
                    name: "磁盘利用率",
                    value: "42%",
                  },
                ],
              },
              {
                name: "116集群-节点3",
                Alerts: "0",
                url: "http://116-node3.com",
                status: "normal",
                values: [
                  {
                    name: "CPU利用率",
                    value: "26%",
                  },
                  {
                    name: "内存利用率",
                    value: "53%",
                  },
                  {
                    name: "磁盘利用率",
                    value: "46%",
                  },
                ],
              },
              {
                name: "116集群-节点4",
                Alerts: "3",
                url: "http://116-node4.com",
                status: "异常",
                values: [
                  {
                    name: "CPU利用率",
                    value: "24%",
                  },
                  {
                    name: "内存利用率",
                    value: "51%",
                  },
                  {
                    name: "磁盘利用率",
                    value: "44%",
                  },
                ],
              },
            ],
          },
          {
            source: "E",
            listdetail: [
              // 141集群节点详情
              {
                name: "141集群",
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
              {
                name: "141集群-节点2",
                Alerts: "0",
                url: "http://141-node2.com",
                status: "normal",
                values: [
                  {
                    name: "CPU利用率",
                    value: "27%",
                  },
                  {
                    name: "内存利用率",
                    value: "58%",
                  },
                  {
                    name: "磁盘利用率",
                    value: "49%",
                  },
                ],
              },
              {
                name: "141集群-节点3",
                Alerts: "1",
                url: "http://141-node3.com",
                status: "异常",
                values: [
                  {
                    name: "CPU利用率",
                    value: "29%",
                  },
                  {
                    name: "内存利用率",
                    value: "59%",
                  },
                  {
                    name: "磁盘利用率",
                    value: "51%",
                  },
                ],
              },
              {
                name: "141集群-节点4",
                Alerts: "0",
                url: "http://141-node4.com",
                status: "normal",
                values: [
                  {
                    name: "CPU利用率",
                    value: "28%",
                  },
                  {
                    name: "内存利用率",
                    value: "57%",
                  },
                  {
                    name: "磁盘利用率",
                    value: "47%",
                  },
                ],
              },
            ],
          },
          {
            source: "F",
            listdetail: [
              // 160集群节点详情
              {
                name: "160集群",
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
              {
                name: "160集群-节点2",
                Alerts: "2",
                url: "http://160-node2.com",
                status: "异常",
                values: [
                  {
                    name: "CPU利用率",
                    value: "20%",
                  },
                  {
                    name: "内存利用率",
                    value: "42%",
                  },
                  {
                    name: "磁盘利用率",
                    value: "36%",
                  },
                ],
              },
              {
                name: "160集群-节点3",
                Alerts: "0",
                url: "http://160-node3.com",
                status: "normal",
                values: [
                  {
                    name: "CPU利用率",
                    value: "24%",
                  },
                  {
                    name: "内存利用率",
                    value: "48%",
                  },
                  {
                    name: "磁盘利用率",
                    value: "40%",
                  },
                ],
              },
            ],
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
  background-color: #0b1421;
  // 确保容器可以正确应用变换
  transform-origin: center center;
}
</style>
