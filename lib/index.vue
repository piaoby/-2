<template>
  <div class="custom-component" ref="component">
    <!-- 三栏布局容器 -->
    <div class="layout-container">
      <!-- 中间 G6 画布 -->
      <div class="center-panel">
        <div ref="ringChart" class="ring-chart"></div>
      </div>

      <!-- 右侧 详情栏 -->
      <div v-if="showDetailPanel" class="right-panel">
        <div class="detail-header">
          <div class="title-container">
            <img class="title-icon" src="./assets/img/Frame.png" alt="icon" />
            <span class="detail-title">{{ selectedNodeLabel }}</span>
          </div>
        </div>
        <div class="combo-detail-content" v-if="showType === 'combo'">
          <div
            v-for="(item, index) in detailItems"
            :key="index"
            class="detail-item"
            :class="{ active: selectedItem === index }"
            @click="selectItem(index)"
          >
            <div class="item-name">{{ item.name }}</div>
            <div class="item-stats">
              <span class="success-rate">成功率: {{ item.successRate }}</span>
              <span class="response-rate">响应率: {{ item.responseRate }}</span>
              <span class="p99-time">P99耗时: {{ item.p99Time }}</span>
            </div>
          </div>
        </div>
        <div class="node-detail-content" v-if="showType === 'node'">
          <!-- 动态渲染每个层级 -->
          <div
            v-for="(section, index) in detailItems"
            :key="index"
            class="detail-section"
          >
            <div class="section-title">{{ section.title }}</div>
            <div class="section-body">
              <div class="section-grid">
                <div
                  v-for="(item, i) in section.items"
                  :key="i"
                  class="section-item"
                >
                  <div class="item-label">{{ item.label }}</div>
                  <div class="item-value">
                    <span v-if="item.trend" :style="{ color: item.color }">
                      <span v-if="item.trend === 'up'">▲</span>
                      <span v-else-if="item.trend === 'down'">▼</span>
                      <span v-else>▬</span>
                    </span>
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import "./customNode.js"; // 导入自定义节点定义文件
import "./customParentCombo.js";
// 在你的组件中使用这个自定义布局
export default {
  name: "custom-component",
  data() {
    return {
      /** 默认数据，不可删除 */
      id: "", // 组件唯一id标识
      configKv: {}, // 组件样式键值对
      // 自定义数据
      graph: null,
      options: null,

      // 添加面板控制状态
      showDetailPanel: false, // 控制右侧详情面板是否显示
      showType: "combo", // 当前选中的是节点还是combo
      selectedNodeLabel: "Node 1111", // 默认选中的节点标签
      selectedItem: 0, // 默认选中第一个详情项
      tabRawData: {},
      // 详情项数据
      detailItems: [],

      activeTab: "internal", // 默认选中第一个tab
    };
  },
  created() {
    this.color = [
      "#4D96FF",
      "#64D8A3",
      "#F8B73F",
      "#65789B",
      "#A96ED4",
      "#85E1FA",
      "#7268F0",
      "#29A397",
      "#BD7830",
      "#FF7A70",
    ];
  },
  /**
   * init、resize、setStyle、setData、destroy为内置函数，
   * 不可删除
   */
  methods: {
    /** 组件初始化时触发 */
    init() {
      this.initGraph();
      this.$nextTick(() => {
        this.reverseScale();
      });
    },
    /**
     * 反缩放处理
     */
    reverseScale() {
      const isDesigner = window.location.href.indexOf("design") > -1;
      if (isDesigner) return;

      const previewWrap = document.querySelector(".preview-wrap");
      if (previewWrap) {
        const computedStyle = window.getComputedStyle(previewWrap);
        const transform =
          computedStyle.transform || computedStyle.webkitTransform;
        console.log(transform, "transform");

        if (transform && transform !== "none") {
          const matrix = new DOMMatrixReadOnly(transform);
          console.log(matrix, "matrix");
          const scale = { scaleX: matrix.a, scaleY: matrix.d };
          console.log(this.$refs.ringChart.style, "this.$refs.ringChart.style");

          this.$refs.ringChart.style.transform = `scale(${1 / scale.scaleX}, ${
            1 / scale.scaleY
          })`;
          // this.$refs.ringChart.style.transformOrigin = "center center";
        } else {
          // 清除缩放
          this.$refs.ringChart.style.transform = "";
        }
      }
    },

    /**
     * 为combo内的节点预设位置
     * @param {Array} nodes - 节点数组
     * @param {String} comboId - combo ID
     */
    layoutComboNodes(nodes, comboId) {
      const nodeSize = 200;
      const nodeSpacing = 150; // 从20增大到30，增加节点间距
      const padding = 20; // 从20增大到30，增加内边距
      const nodesPerRow = 4;
      const labelHeight = 20; // 节点标签高度
      const totalNodeHeight = nodeSize + labelHeight; // 节点+标签的总高度

      // 获取属于当前combo的节点
      const comboNodes = nodes.filter((node) => node.comboId === comboId);

      // 为每个节点计算位置（相对于combo的局部坐标系）
      comboNodes.forEach((node, index) => {
        const row = Math.floor(index / nodesPerRow);
        const col = index % nodesPerRow;

        // 计算节点位置：横向排列，相对于combo内部
        node.x = padding + col * (nodeSize + nodeSpacing);
        // 调整节点y坐标，使节点+标签整体在combo内垂直居中
        node.y =
          padding +
          30 +
          row * (totalNodeHeight + nodeSpacing) +
          totalNodeHeight / 2 -
          labelHeight / 2;
      });

      return nodes;
    },

    /**
     * 预布局所有节点
     * @param {Object} graphData - 图数据
     */
    preLayoutNodes(graphData) {
      // 按combo分组节点
      const nodesByCombo = {};
      graphData.nodes.forEach((node) => {
        const comboId = node.comboId || "default";
        if (!nodesByCombo[comboId]) {
          nodesByCombo[comboId] = [];
        }
        nodesByCombo[comboId].push(node);
      });

      // 为每个combo内的节点设置位置
      Object.keys(nodesByCombo).forEach((comboId) => {
        this.layoutComboNodes(graphData.nodes, comboId);
      });

      // 为combo设置位置，避免重叠
      this.layoutCombos(graphData.combos, graphData.nodes);

      return graphData;
    },
    /**
     * 为combos设置位置，避免重叠
     * @param {Array} combos - combo数组
     * @param {Array} nodes - 节点数组
     */
    layoutCombos(combos, nodes) {
      const spacing = 30; // 间距
      const maxPerRow = 2; // 每行最多两个
      const titleHeight = 50; // 父容器标题高度
      const parentVerticalSpacing = 50; // 主中心和灾备中心之间的垂直间距（从100减小到50）

      // 先找出所有父 combo（主中心、灾备中心）
      const parentCombos = combos.filter(
        (c) => c.id === "main-center" || c.id === "disaster-center"
      );

      // 先处理子 combo 的尺寸计算
      const childCombos = combos.filter(
        (c) => c.type === "custom-combo" && c.parentId
      );

      // 为每个子 combo 计算实际尺寸（基于内部节点数量）
      childCombos.forEach((child) => {
        // 获取该 combo 下的所有节点
        const childNodes = nodes.filter((n) => n.comboId === child.id);
        const nodesPerRow = 4;
        const nodeSize = 200;
        const nodeSpacing = 150;
        const padding = 40;
        const labelHeight = 20;

        // 计算行数
        const rows = Math.ceil(childNodes.length / nodesPerRow) || 1;

        // 计算实际尺寸
        const width =
          nodesPerRow * nodeSize +
          (nodesPerRow - 1) * nodeSpacing +
          2 * padding;
        const height =
          rows * (nodeSize + nodeSpacing + labelHeight) -
          nodeSpacing +
          2 * padding +
          100;

        child.width = width;
        child.height = height;
      });

      // 为每个父 combo 计算实际需要的尺寸
      parentCombos.forEach((parent) => {
        // 获取该父容器下的所有子combo
        const children = combos.filter(
          (c) => c.parentId === parent.id && c.type === "custom-combo"
        );

        if (children.length === 0) {
          // 如果没有子combo，使用默认尺寸
          parent.width = 600;
          parent.height = 400;
          return;
        }

        // 找到子combo中的最大尺寸作为基准
        let maxWidth = 0;
        let maxHeight = 0;
        children.forEach((child) => {
          maxWidth = Math.max(maxWidth, child.width || 250);
          maxHeight = Math.max(maxHeight, child.height || 150);
        });

        // 计算需要的行数
        const rows = Math.ceil(children.length / maxPerRow) || 1;

        // 计算父容器尺寸
        const parentWidth = maxWidth * maxPerRow + spacing * (maxPerRow + 1);
        const parentHeight =
          titleHeight + maxHeight * rows + spacing * (rows + 1);

        parent.width = parentWidth;
        parent.height = parentHeight;
      });

      // 为每个父 combo 设置位置
      parentCombos.forEach((parent, index) => {
        parent.x = 200; // 统一左边距
        parent.y =
          index === 0
            ? 100
            : 100 + parentVerticalSpacing + (parentCombos[0].height || 400); // 减小间距
      });

      // 处理每个父 combo 内的子 combo 布局
      parentCombos.forEach((parent) => {
        const children = combos.filter(
          (c) => c.parentId === parent.id && c.type === "custom-combo"
        );

        // 找到子combo中的最大尺寸作为基准
        let maxWidth = 0;
        let maxHeight = 0;
        children.forEach((child) => {
          maxWidth = Math.max(maxWidth, child.width || 250);
          maxHeight = Math.max(maxHeight, child.height || 150);
        });

        children.forEach((child, index) => {
          const col = index % maxPerRow;
          const row = Math.floor(index / maxPerRow);

          // 子 combo 相对于父 combo 的偏移
          child.x = parent.x + spacing + col * (maxWidth + spacing);
          child.y =
            parent.y + titleHeight + spacing + row * (maxHeight + spacing);
        });
      });
    },
    convertToGraphData(rawData) {
      if (!rawData || !rawData.nodes) {
        return { nodes: [], edges: [], combos: [] };
      }

      // 转换节点数据
      const nodes = rawData.nodes.map((node) => ({
        id: node.key,
        label: node.text,
        type: "custom-node",
        draggable: true,
        status: node.status,
        source: node.source,
        detail: node.detail,
        comboId: node.combo,
        x: 0,
        y: 0,
      }));

      // 转换边数据
      let edges = [];
      if (rawData.edges && Array.isArray(rawData.edges)) {
        edges = rawData.edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
          type: "orthogonal-edge",
          status: edge.status,
        }));
      }

      // 转换普通 combo（集群）
      let combos = [];
      if (rawData.combos && Array.isArray(rawData.combos)) {
        combos = rawData.combos.map((combo) => ({
          id: combo.id,
          label: `应用集群 ${combo.id}`,
          type: "custom-combo",
          comboStatus: combo.status,
          x: 0,
          y: 0,
        }));
      }

      // 添加顶层 parent combo（主中心、灾备中心）
      if (rawData.combosParent && Array.isArray(rawData.combosParent)) {
        rawData.combosParent.forEach((parentCombo) => {
          combos.push({
            id: parentCombo.id,
            label: parentCombo.name,
            type: "custom-parent-combo",
            comboStatus: "正常",
            x: 0,
            y: 0,
            // width: 800, // 设置足够宽度
            // height: 400, // 设置足够高度
          });
        });
      }

      // 设置父子关系：让每个 combo 的 parentId 成为其父 combo
      combos.forEach((combo) => {
        if (combo.id === "main-center" || combo.id === "disaster-center") {
          return;
        }
        // 查找该 combo 的 parentId
        const parent = rawData.combos.find((c) => c.id === combo.id);
        if (parent && parent.parentId) {
          combo.parentId = parent.parentId; // G6 支持 parentId 字段
        }
      });

      const graphData = { nodes, edges, combos };

      // 预布局节点和 combos
      return this.preLayoutNodes(graphData);
    },

    selectItem(index) {
      this.selectedItem = index;
      // 这里可以添加选择详情项时的业务逻辑
    },
    /** 组件大小变更时触发 */
    resize() {
      if (this.graph) {
        this.$nextTick(() => {
          this.graph.changeSize(
            this.$refs.ringChart.clientWidth,
            this.$refs.ringChart.clientHeight
          );
        });
      }
    },
    /** 调整画布大小并保持视图一致 */
    resizeGraphAndKeepView(newWidth, newHeight) {
      if (!this.graph) return;

      // 获取当前变换
      const transform = this.graph.get("group").getMatrix() || [
        1, 0, 0, 0, 1, 0, 0, 0, 1,
      ];

      // 保存当前视图中心点的世界坐标
      const oldWidth = this.graph.get("width");
      const oldHeight = this.graph.get("height");
      const scale = transform[0];
      const worldCenterX = (oldWidth / 2 - transform[6]) / scale;
      const worldCenterY = (oldHeight / 2 - transform[7]) / scale;

      // 调整画布大小
      this.graph.changeSize(newWidth, newHeight);

      // 保持视图中心一致
      const newTranslateX = newWidth / 2 - worldCenterX * scale;
      const newTranslateY = newHeight / 2 - worldCenterY * scale;

      const newTransform = [...transform];
      newTransform[6] = newTranslateX;
      newTransform[7] = newTranslateY;

      this.graph.get("group").setMatrix(newTransform);
      this.graph.refresh();
    },
    /**
     * 创建或更新提示框
     */
    createTooltip(content, x, y) {
      // 如果已经存在提示框，先移除
      if (this.tooltip) {
        this.tooltip.remove();
      }

      // 创建提示框
      this.tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        getContent: () => {
          return content;
        },
        itemTypes: ["node"],
      });

      // 注册提示框插件
      this.graph.addPlugin(this.tooltip);
    },

    /**
     * 初始化图实例
     */
    initGraph() {
      if (!this.$refs.ringChart) return;

      // 如果图表已经存在，先销毁
      if (this.graph) {
        this.graph.destroy();
      }

      // 直接使用 tabRawData 的数据
      let graphData = this.convertToGraphData(this.tabRawData);

      this.graph = new G6.Graph({
        container: this.$refs.ringChart,
        width: this.$refs.ringChart.clientWidth || 600,
        height: this.$refs.ringChart.clientHeight || 400,
        animate: true,
        animateCfg: {
          duration: 500,
          easing: "easeLinear",
        },
        modes: {
          default: ["drag-node", "zoom-canvas", "drag-canvas", "drag-combo"],
        },
        layout: null,
        defaultNode: {
          shape: "custom-node",
          size: 200,
          color: "#333",
        },
        defaultEdge: {
          type: "orthogonal-edge",
          style: {
            endArrow: true,
          },
        },
        defaultCombo: {
          type: "custom-combo",
          style: {
            lineWidth: 2,
          },
        },
        fitView: true,
        fitViewPadding: [100, 100, 100, 100],
        edgeStateStyles: {
          hover: {
            lineWidth: 3,
          },
        },
        comboCfg: {
          collapseExpand: false,
          enableDelegate: true,
          nested: true,
        },
        groupByTypes: false,
      });

      this.graph.data(graphData);
      this.graph.render();

      // 节点点击事件
      this.graph.on("node:click", (evt) => {
        const node = evt.item;
        if (!node) return;

        const nodeModel = node.getModel();
        console.log(nodeModel, "nodeModel");

        const nodeId = nodeModel.id;

        // 获取节点详情数据
        const detailData = this.convertToNodeDetailData(this.tabRawData);
        const nodeDetail = detailData[nodeId];

        if (!nodeDetail || nodeDetail.length === 0) {
          console.warn(`No detail data found for node ${nodeId}`);
          return;
        }

        // 设置选中的节点标签
        this.selectedNodeLabel = nodeModel.text || `节点 ${nodeId}`;

        // 设置详情数据
        this.detailItems = nodeDetail;
        this.showType = "node";
        // 显示详情面板
        this.showDetailPanel = true;

        // 调整图表大小以适应右侧面板
        this.$nextTick(() => {
          if (this.graph) {
            this.resizeGraphAndKeepView(
              this.$refs.component.clientWidth * 0.75,
              this.$refs.component.clientHeight
            );
          }
        });
      });

      // combo点击事件
      this.graph.on("combo:click", (evt) => {
        const combo = evt.item;
        if (!combo) return; // 防止 undefined

        const comboId = combo.get("id");
        if (comboId === "main-center" || comboId === "disaster-center") {
          return;
        }

        const comboModel = combo.getModel();
        this.selectedNodeLabel = comboModel.label || `组合 ${comboId}`;

        const detailData = this.convertToComboDetailData(this.tabRawData);
        this.detailItems = detailData[comboId] || [];
        this.showType = "combo";
        this.showDetailPanel = true;

        this.$nextTick(() => {
          if (this.graph) {
            this.resizeGraphAndKeepView(
              this.$refs.component.clientWidth * 0.75,
              this.$refs.component.clientHeight
            );
          }
        });
      });
      // 节点鼠标悬浮事件
      this.graph.on("node:mouseenter", (evt) => {
        const node = evt.item;
        const nodeModel = node.getModel();
        // 构建提示内容
        let tooltipContent = `<div class="node-tooltip"><div class="tooltip-content">`;

        // 添加节点详情信息
        if (nodeModel.detail && nodeModel.detail.length > 0) {
          nodeModel.detail.forEach((detail) => {
            tooltipContent += `<div class="tooltip-item" style="padding: 5px 0 !important;">
                              <span class="item-name">${detail.name}:</span>
                              <span class="item-value"> ${detail.value}</span>
                              </div>`;
          });
        } else {
          tooltipContent += `<div class="tooltip-item">暂无详细信息</div>`;
        }

        tooltipContent += `</div></div>`;

        // 创建提示框元素
        if (!this.tooltipElement) {
          this.tooltipElement = document.createElement("div");
          this.tooltipElement.className = "g6-node-tooltip";
          this.tooltipElement.style.position = "absolute";
          this.tooltipElement.style.backgroundColor = "#111B30";
          this.tooltipElement.style.color = "#fff";
          this.tooltipElement.style.padding = "10px";
          this.tooltipElement.style.borderRadius = "4px";
          this.tooltipElement.style.fontSize = "12px";
          this.tooltipElement.style.zIndex = "999";
          this.tooltipElement.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";
          this.tooltipElement.style.pointerEvents = "none";
          document.body.appendChild(this.tooltipElement);
        }

        this.tooltipElement.innerHTML = tooltipContent;
        // 设置提示框位置为鼠标右侧
        this.tooltipElement.style.left = evt.canvasX + "px";
        this.tooltipElement.style.top = evt.canvasY + "px";
        this.tooltipElement.style.transform = "translate(80px, 0)";

        this.tooltipElement.style.display = "block";
      }),
        // 节点鼠标移出事件
        this.graph.on("node:mouseleave", (evt) => {
          if (this.tooltipElement) {
            this.tooltipElement.style.display = "none";
          }
        });

      // 添加画布点击事件（点击空白处）
      this.graph.on("canvas:click", (evt) => {
        this.closeDetailPanel();
      });

      // 鼠标移动事件，用于更新提示框位置
      this.graph.on("mousemove", (evt) => {
        if (
          this.tooltipElement &&
          this.tooltipElement.style.display !== "none"
        ) {
          this.tooltipElement.style.left = evt.canvasX + "px";
          this.tooltipElement.style.top = evt.canvasY + "px";
          this.tooltipElement.style.transform = "translate(80px, 0)";
        }
      });

      // 初始化后自动适配视图
      this.$nextTick(() => {
        if (this.graph) {
          this.graph.fitView([100, 100, 100, 100]);

          // 手动触发动画
          setTimeout(() => {
            const edges = this.graph.getEdges();
            edges.forEach((edge) => {
              // 重新应用边的样式以触发动画
              this.graph.refreshItem(edge);
            });
          }, 200);
        }
      });
    },
    /**
     * 将原始数据转换为combo详情数据
     * @param {Object} rawData - 原始数据
     * @returns {Object} combo详情数据映射
     */
    /**
     * 将原始数据转换为combo详情数据
     * @param {Object} rawData - 原始数据
     * @returns {Object} combo详情数据映射
     */
    convertToComboDetailData(rawData) {
      const detailData = {};

      if (rawData && rawData.comboList) {
        rawData.comboList.forEach((item) => {
          // 将listdetail数据转换为组件需要的详情项格式
          detailData[item.source] = item.listdetail.map((detail) => {
            // 根据新的数据结构提取信息
            return {
              name: detail.name || "未知项",
              successRate:
                detail.values && detail.values.length > 0
                  ? detail.values[0].value || "0%"
                  : "0%",
              responseRate:
                detail.values && detail.values.length > 1
                  ? detail.values[1].value || "0%"
                  : "0%",
              p99Time:
                detail.values && detail.values.length > 2
                  ? detail.values[2].value || "0ms"
                  : "0ms",
            };
          });
        });
      }

      return detailData;
    },
    // 关闭详情面板
    closeDetailPanel() {
      this.showDetailPanel = false;
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.graph) {
            this.$nextTick(() => {
              this.resizeGraphAndKeepView(
                this.$refs.component.clientWidth - 1,
                this.$refs.component.clientHeight
              );
            });
          }
        }, 100);
      });
    },
    /**
     * 将原始数据转换为节点详情数据（适配当前结构）
     * @param {Object} rawData - 原始数据
     * @returns {Object} 节点详情数据映射
     */
    convertToNodeDetailData(rawData) {
      const detailData = {};

      if (rawData && rawData.nodeList) {
        rawData.nodeList.forEach((item) => {
          const source = item.source || item.key; // 使用 source 或 key 作为唯一标识
          const listdetail = item.listdetail || [];

          // 构建详情项
          detailData[source] = [
            {
              type: "base",
              title: "基础层指标",
              items: [
                {
                  label: "主机状态",
                  value: item.status === "在线" ? "🟢 在线" : "🔴 离线",
                },
                { label: "CPU型号", value: "IntelXeonE5-2676v3" },
                { label: "磁盘总量", value: "500GB" },
                { label: "操作系统", value: "Linux5.4.0-42-gen..." },
                { label: "内存总量", value: "16GB" },
                { label: "网络带宽", value: "1Gbps" },
                { label: "系统错误日志信息", value: "oarm kill: 0" },
              ],
            },
            {
              type: "system",
              title: "系统层指标",
              items:
                listdetail[0]?.systemMetrics?.map((v) => ({
                  label: v.name,
                  value: v.value,
                })) || [],
            },
            {
              type: "app",
              title: "应用层指标",
              items:
                listdetail[0]?.appMetrics?.map((v) => ({
                  label: v.name,
                  value: v.value,
                })) || [],
            },
            {
              type: "business",
              title: "业务层指标",
              items:
                listdetail[0]?.businessMetrics?.map((v) => ({
                  label: v.name,
                  value: v.value,
                })) || [],
            },
            {
              type: "operations",
              title: "操作列表",
              items:
                listdetail[0]?.operations?.map((v) => ({
                  label: v.name,
                  value: v.value,
                })) || [],
            },
          ];
        });
      }
      console.log("detailData:", detailData);

      return detailData;
    },

    /** 组件配置项变更时触发 */
    setStyle(k, v) {
      const keyList = k.split("$");
      if (keyList.length > 1) {
        this.configKv[keyList[0]][keyList[1]] = v;
      } else {
        this.configKv[keyList[0]] = v;
      }
      this.initGraph();
    },

    /** 组件数据变更时触发 */
    setData(data) {
      if (!data || typeof data !== "object") return;

      this.tabRawData = data;
      let graphData = this.convertToGraphData(data);

      if (this.graph) {
        this.graph.changeData(graphData);
      } else {
        this.initGraph(); // 确保 graph 已创建
      }
    },
    /** 组件销毁时触发 */
    destroy() {
      if (this.graph) {
        this.graph.destroy();
      }
      if (this.tooltipElement && this.tooltipElement.parentNode) {
        this.tooltipElement.parentNode.removeChild(this.tooltipElement);
      }
      this.tooltipElement = null;
    },
  },
};
</script>
<style scoped lang="scss">
.custom-component {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .layout-container {
    display: flex;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    // 中间面板 (G6画布) - 自适应剩余空间
    .center-panel {
      flex: 1; // 占据剩余空间
      // background-color: #000;
      box-sizing: border-box;

      .ring-chart {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    }

    // 右侧面板 - 占据 25%
    .right-panel {
      flex: 0 0 20%; // 不放大不缩小，基础宽度 20%
      min-width: 300px; // 设置最小宽度防止过小
      // height: calc(100% - 100px);
      background-color: #111d30;
      //   border-left: 1px solid #333;
      position: relative;
      box-sizing: border-box;
      margin: 20px 20px;
      .detail-header {
        height: 60px;
        display: flex;
        align-items: center;
        padding: 0 15px;
        position: relative;
        background: url("./assets/img/bg.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;

        .title-container {
          display: flex;
          align-items: center;

          .title-icon {
            width: 16px;
            height: 23px;
            margin-right: 10px;
            flex-shrink: 0;
          }

          .detail-title {
            color: #5fc7ff;
            font-size: 16px;
            font-weight: bold;
          }
        }
      }

      .combo-detail-content {
        width: 100%;
        height: calc(100% - 60px);
        color: #fff;
        box-sizing: border-box;
        overflow-y: auto; // 添加滚动条
        padding: 10px;

        // 滚动条样式（可选）
        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: #000;
        }

        &::-webkit-scrollbar-thumb {
          background: #10375d;
          border-radius: 3px;
        }

        .detail-item {
          background-color: #020c1d;
          border-radius: 4px;
          padding: 12px 15px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background-color: #10375d;
          }

          //   &.active {
          //     background-color: #10375d;
          //   }

          .item-name {
            color: #00d9ff;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .item-stats {
            display: flex;
            justify-content: space-between;
            font-size: 12px;

            .success-rate,
            .response-rate,
            .p99-time {
              color: #fff;
            }
          }
        }
      }
      .node-detail-content {
        width: 100%;
        height: calc(100% - 60px);
        color: #fff;
        box-sizing: border-box;
        overflow-y: auto;
        padding: 10px;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: #000;
        }

        &::-webkit-scrollbar-thumb {
          background: #10375d;
          border-radius: 3px;
        }

        .detail-section {
          border-radius: 4px;
          margin-bottom: 10px;
          overflow: hidden;

          .section-title {
            padding: 10px 0 10px 0;
            // background: linear-gradient(
            //   90deg,
            //   rgba(95, 199, 255, 0.3) 0%,
            //   rgba(95, 199, 255, 0.1) 100%
            // );
            color: #ffff;
            font-size: 14px;
            font-weight: bold;
            text-shadow: 0 0 5px rgba(95, 199, 255, 0.8),
              0 0 10px rgba(95, 199, 255, 0.5);
            // box-shadow: 0 0 10px rgba(95, 199, 255, 0.3) inset;
          }

          .section-body {
            border-radius: 4px;
            padding: 12px 15px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: background-color 0.3s;
            background-color: #020c1d;

            &:hover {
              background-color: #10375d;
            }
            .section-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
            }
            .section-item {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;

              &:last-child {
                border-bottom: none;
              }

              .item-label {
                font-size: 12px;
                color: #ccc;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .item-value {
                font-size: 12px;
                color: #fff;
                display: flex;
                align-items: center;
                gap: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                min-width: 0; /* 允许flex项目收缩 */
                span {
                  font-size: 12px;
                  line-height: 1;
                }
              }
            }
          }
        }
      }
    }
  }
}
.left-panel {
  flex: 0 0 15%; // 不放大不缩小，基础宽度 15%
  min-width: 100px; // 设置最小宽度防止过小
  background-color: #000;
  box-sizing: border-box;
  display: flex;
  align-items: center; // 垂直居中
  justify-content: center; // 水平居中（如果需要）

  .tab-content {
    width: 80%;
    box-sizing: border-box;
    padding: 10px 0;
    display: flex;
    flex-direction: column;

    // 垂直居中关键：使用 margin auto
    margin: auto 0;

    .tab-item {
      height: 60px;
      // 设置从左到右的浅蓝色到透明的渐变背景
      background: linear-gradient(
        90deg,
        rgba(95, 199, 255, 0.2) 0%,
        rgba(95, 199, 255, 0) 100%
      );
      margin: 5px 10px 5px 10px;
      //   border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      cursor: pointer;
      transition: background-color 0.3s;
      position: relative;

      &:hover {
        background-color: rgba(68, 68, 68, 0.7);
      }

      &.active {
        // background-image: url('./assets/img/tabbg.png');

        background: 
        // linear-gradient(
        //   90deg,
        //   rgba(95, 199, 255, 0.3) 0%,
        //   rgba(95, 199, 255, 0.1) 100%
        // ),
          url("./assets/img/tabbg.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;

        // 选中时添加上边框渐变
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          // 从左到右逐渐消失的渐变边框
          background: linear-gradient(
            90deg,
            #5fc7ff 0%,
            rgba(95, 199, 255, 0) 100%
          );
        }

        // 选中时添加下边框渐变
        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          // 从左到右逐渐消失的渐变边框
          background: linear-gradient(
            90deg,
            #5fc7ff 0%,
            rgba(95, 199, 255, 0) 100%
          );
        }

        // 选中时添加左边框（纯色）
        border-left: 2px solid #5fc7ff;
        // 调整border-radius以适应左边框
        border-radius: 0 4px 4px 0;

        .tab-label {
          color: #5fc7ff;
        }
      }

      .tab-label {
        color: #fff;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .arrow-icon {
        width: 28px;
        height: 28px;
        flex-shrink: 0;
      }
    }
  }
}
.g6-node-tooltip {
  .tooltip-title {
    font-weight: bold;
    margin-bottom: 8px;
    color: #5fc7ff;
    border-bottom: 1px solid #5fc7ff;
    padding-bottom: 4px;
  }

  .tooltip-item {
    padding: 20px 0;
    margin: 4px 0;
    display: flex;
    justify-content: space-between;

    .item-name {
      margin-right: 10px;
      color: #ffffff;
    }

    .item-value {
      font-weight: bold;
    }
    .warning {
      color: #ff4d4f !important; // 红色警告色
    }
  }
}

// 全局样式确保提示框不会被其他元素遮挡
:global(.g6-node-tooltip) {
  z-index: 9999 !important;
}

// 添加更通用的警告样式
.warning {
  color: #ff4d4f !important;
}
</style>
