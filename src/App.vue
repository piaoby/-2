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
            key: "node1",
            text: "营销系统",
            status: "正常",
            combo: "A",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "11%",
              },
              {
                name: "内存利用率",
                value: "22%",
              },
            ],
          },
          {
            key: "node2",
            text: "订单系统",
            status: "异常",
            combo: "A",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "85%",
              },
              {
                name: "内存利用率",
                value: "72%",
              },
            ],
          },
          {
            key: "node3",
            text: "支付系统",
            status: "正常",
            combo: "A",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "32%",
              },
              {
                name: "内存利用率",
                value: "45%",
              },
            ],
          },
          {
            key: "node4",
            text: "库存系统",
            status: "正常",
            combo: "A",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "28%",
              },
              {
                name: "内存利用率",
                value: "36%",
              },
            ],
          },
          {
            key: "node5",
            text: "用户中心",
            status: "异常",
            combo: "B",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "78%",
              },
              {
                name: "内存利用率",
                value: "69%",
              },
            ],
          },
          {
            key: "node7",
            text: "认证服务",
            status: "正常",
            combo: "B",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "37%",
              },
              {
                name: "内存利用率",
                value: "29%",
              },
            ],
          },
          {
            key: "node8",
            text: "日志服务",
            status: "正常",
            combo: "B",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "22%",
              },
              {
                name: "内存利用率",
                value: "18%",
              },
            ],
          },
          {
            key: "node9",
            text: "数据分析",
            status: "异常",
            combo: "C",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "91%",
              },
              {
                name: "内存利用率",
                value: "84%",
              },
            ],
          },
          {
            key: "node10",
            text: "报表引擎",
            status: "正常",
            combo: "C",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "45%",
              },
              {
                name: "内存利用率",
                value: "38%",
              },
            ],
          },
          {
            key: "node11",
            text: "监控平台",
            status: "正常",
            combo: "C",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "33%",
              },
              {
                name: "内存利用率",
                value: "27%",
              },
            ],
          },
          {
            key: "node12",
            text: "告警中心",
            status: "异常",
            combo: "C",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "76%",
              },
              {
                name: "内存利用率",
                value: "68%",
              },
            ],
          },
          {
            key: "node13",
            text: "消息队列",
            status: "正常",
            combo: "D",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "39%",
              },
              {
                name: "内存利用率",
                value: "31%",
              },
            ],
          },
          {
            key: "node14",
            text: "缓存服务",
            status: "异常",
            combo: "D",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "82%",
              },
              {
                name: "内存利用率",
                value: "75%",
              },
            ],
          },
          {
            key: "node15",
            text: "数据库集群",
            status: "正常",
            combo: "D",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "52%",
              },
              {
                name: "内存利用率",
                value: "46%",
              },
            ],
          },
          {
            key: "node16",
            text: "文件存储",
            status: "正常",
            combo: "D",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "26%",
              },
              {
                name: "内存利用率",
                value: "21%",
              },
            ],
          },
          {
            key: "node18",
            text: "配置中心",
            status: "正常",
            combo: "B",
            source: "模块.svg",
            detail: [
              {
                name: "CPU利用率",
                value: "35%",
              },
              {
                name: "内存利用率",
                value: "28%",
              },
            ],
          },
        ],
        combos: [
          {
            id: "A",
            status: "正常",
          },
          {
            id: "B",
            status: "异常",
          },
          {
            id: "C",
            status: "正常",
          },
          {
            id: "D",
            status: "异常",
          },
        ],
        // 节点详情数据
        nodeList: [
          {
            source: "node1",
            listdetail: [
              {
                name: "营销系统集群",
                Alerts: "1",
                url: "http://marketing-system.com",
                value: {
                  name: "成功率",
                  value: "98%",
                  statues: "1",
                },
              },
            ],
          },
          {
            source: "node5",
            listdetail: [
              {
                name: "用户中心集群",
                Alerts: "3",
                url: "http://user-center.com",
                value: {
                  name: "成功率",
                  value: "87%",
                  statues: "3",
                },
              },
            ],
          },
          {
            source: "node9",
            listdetail: [
              {
                name: "数据分析集群",
                Alerts: "2",
                url: "http://data-analysis.com",
                value: {
                  name: "成功率",
                  value: "92%",
                  statues: "2",
                },
              },
            ],
          },
          {
            source: "node13",
            listdetail: [
              {
                name: "消息队列集群",
                Alerts: "1",
                url: "http://message-queue.com",
                value: {
                  name: "成功率",
                  value: "95%",
                  statues: "1",
                },
              },
            ],
          },
        ],
        // 组合详情数据
        comboList: [
          {
            source: "A",
            listdetail: [
              {
                name: "业务系统组合",
                url: "http://business-group.com",
                value: {
                  name: "成功率",
                  value: "94%",
                },
              },
            ],
          },
          {
            source: "B",
            listdetail: [
              {
                name: "用户管理系统组合",
                Alerts: "3",
                url: "http://user-mgmt-group.com",
                value: {
                  name: "成功率",
                  value: "89%",
                  statues: "3",
                },
              },
            ],
          },
          {
            source: "C",
            listdetail: [
              {
                name: "数据处理组合",
                url: "http://data-process-group.com",
                value: {
                  name: "成功率",
                  value: "91%",
                },
              },
            ],
          },
          {
            source: "D",
            listdetail: [
              {
                name: "基础设施组合",
                Alerts: "2",
                url: "http://infra-group.com",
                value: {
                  name: "成功率",
                  value: "93%",
                  statues: "2",
                },
              },
            ],
          },
        ],
      },
    };
  },
  mounted() {
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
      }, // 在组件初始化后执行反缩放
    );
    this.com.resize();
    
    this.com.setStyle("legend$color", "#ccc");
    this.com.setData(this.tabRawData);
  },
  methods: {
    
  },
};
</script>
<style lang="scss">
#panel {
  width: 90vw;
  height: 90vh;
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
