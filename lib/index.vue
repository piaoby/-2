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
        <!-- 替换 index.vue 模板中的 combo-detail-content 部分 -->
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
              <!-- 直接展示 values 数组中的内容 -->
              <div
                v-for="(value, valueIndex) in item.values"
                :key="valueIndex"
                class="value-item"
              >
                <span class="value-name">{{ value.name }}:</span>
                <span class="value-data">{{ value.value }}</span>
              </div>
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
                  <div class="item-label" v-if="section.title != '操作列表'">
                    {{ item.label }}:
                  </div>
                  <div class="item-value">
                    <span
                      :style="{
                        color:
                          item.color || getValueColor(item.value, item.label),
                      }"
                    >
                      {{ item.value }}
                    </span>
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
      parentComboPositions: null,
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
        if (transform && transform !== "none") {
          const matrix = new DOMMatrixReadOnly(transform);
          console.log(matrix, "matrix");
          const scale = { scaleX: matrix.a, scaleY: matrix.d };

          this.$refs.component.style.transform = `scale(${1 / scale.scaleX}, ${
            1 / scale.scaleY
          })`;
          // this.$refs.component.style.transformOrigin = "center center";
        } else {
          // 清除缩放
          this.$refs.component.style.transform = "";
        }
      }
    },
    /**
     * 为combo内的节点预设位置
     * @param {Array} nodes - 节点数组
     * @param {String} comboId - combo ID
     */
    layoutComboNodes(nodes, comboId) {
      // 检查combo的parentId是否为mainCenter
      const combo = this.tabRawData.combos?.find((c) => c.id === comboId);
      const isMainCenterChild = combo && combo.parentId === "mainCenter";

      const nodeSize = 200;
      const nodeSpacing = 150;
      const padding = 50;
      const labelHeight = 40;
      const totalNodeHeight = nodeSize + labelHeight;

      // 获取属于当前combo的节点
      const comboNodes = nodes.filter((node) => node.comboId === comboId);

      if (isMainCenterChild) {
        // 对于mainCenter的子combo，使用竖向排列，每列最多2个节点
        const nodesPerColumn = 2; // 每列最多2个节点

        // 特别处理只有一个节点的情况，使其居中显示
        if (comboNodes.length === 1) {
          comboNodes[0].x = padding + nodeSize / 2;
          comboNodes[0].y = padding + nodeSize / 2;
        } else {
          comboNodes.forEach((node, index) => {
            const column = Math.floor(index / nodesPerColumn); // 列数（从左到右）
            const row = index % nodesPerColumn; // 行数（从上到下）

            // 计算节点位置：竖向排列，每列最多2个
            node.x =
              padding + column * (nodeSize + (column > 0 ? nodeSpacing : 0));
            node.y =
              padding +
              row * (nodeSize + (row > 0 ? nodeSpacing : 0)) +
              nodeSize / 2;
          });

          // 特别处理奇数个节点的情况，将最后一列的单个节点垂直居中
          if (comboNodes.length % 2 === 1 && comboNodes.length > 1) {
            const lastIndex = comboNodes.length - 1;
            const lastNode = comboNodes[lastIndex];

            // 最后一个节点应该放在第二列（column=1）垂直居中位置
            lastNode.x =
              padding +
              Math.floor(comboNodes.length / nodesPerColumn) *
                (nodeSize + nodeSpacing); // 第二列的x位置
            lastNode.y = padding + (nodeSize + nodeSpacing) / 2 + nodeSize / 2; // 在该列中垂直居中
          }
        }
      } else {
        // 其他combo保持原来的4列布局
        const nodesPerRow = 4;

        // 特别处理只有一个节点的情况，使其居中显示
        if (comboNodes.length === 1) {
          comboNodes[0].x = padding + nodeSize / 2; // 修正：移除nodeSpacing的影响
          comboNodes[0].y = padding + totalNodeHeight / 2;
        } else {
          comboNodes.forEach((node, index) => {
            const row = Math.floor(index / nodesPerRow);
            const col = index % nodesPerRow;

            // 计算节点位置：横向排列，相对于combo内部
            node.x = padding + col * (nodeSize + (col > 0 ? nodeSpacing : 0)); // 修正：仅在多列时添加间距
            // 调整节点y坐标，使节点+标签整体在combo内垂直居中
            node.y =
              padding +
              row * (totalNodeHeight + (row > 0 ? nodeSpacing : 0)) +
              totalNodeHeight / 2;
          });
        }
      }

      return nodes;
    },

   /**
 * 预布局所有节点
 * @param {Object} graphData - 图数据
 */
preLayoutNodes(graphData) {
  // 按combo分组节点
  const nodesByCombo = {};
  // 注意：这里不再需要单独处理独立节点，因为它们会在layoutCombos中处理

  graphData.nodes.forEach((node) => {
    const comboId = node.comboId || "default";
    if (comboId && comboId !== "default") {
      if (!nodesByCombo[comboId]) {
        nodesByCombo[comboId] = [];
      }
      nodesByCombo[comboId].push(node);
    }
  });

  // 为每个combo内的节点设置位置
  Object.keys(nodesByCombo).forEach((comboId) => {
    this.layoutComboNodes(graphData.nodes, comboId);
  });

  // 为combo设置位置，避免重叠
  // 独立节点的布局将在layoutCombos方法中完成
  this.layoutCombos(graphData.combos, graphData.nodes);

  // 特别处理loadBalancer节点位置
  const loadBalancerNode = graphData.nodes.find(node => node.id === "loadBalancer");
  if (loadBalancerNode && this.parentComboPositions) {
    // 获取所有父combo
    const parentIds = ["mainCenter", "noneCenter", "disasterCenter"];
    const validParents = parentIds.filter(id => this.parentComboPositions[id]);
    
    if (validParents.length > 0) {
      if (validParents.length % 2 === 1) {
        // 奇数个父combo，将loadBalancer放在中间那个的左侧
        const middleIndex = Math.floor(validParents.length / 2);
        const middleParentId = validParents[middleIndex];
        const middleParentPos = this.parentComboPositions[middleParentId];
        
        // 放置在中间父combo的左侧
        loadBalancerNode.x = middleParentPos.x - 200; // 左侧200px位置
        loadBalancerNode.y = middleParentPos.y + middleParentPos.height / 2; // 垂直居中
      } else {
        // 偶数个父combo，将loadBalancer放在整个布局的左侧中间
        // 计算所有父combo的垂直范围
        let minY = Infinity;
        let maxY = -Infinity;
        
        validParents.forEach(id => {
          const pos = this.parentComboPositions[id];
          minY = Math.min(minY, pos.y);
          maxY = Math.max(maxY, pos.y + pos.height);
        });
        
        if (minY !== Infinity && maxY !== -Infinity) {
          // 放置在整个布局的左侧中间
          loadBalancerNode.x = 100; // 左侧固定位置
          loadBalancerNode.y = (minY + maxY) / 2; // 垂直居中
        }
      }
    }
  }

  return graphData;
},

    /**
     * 为combos设置位置，避免重叠
     * @param {Array} combos - combo数组
     * @param {Array} nodes - 节点数组
     */
    layoutCombos(combos, nodes) {
      const spacing = 50; // 间距
      const maxPerRow = 2; // 每行最多两个
      const titleHeight = 50; // 父容器标题高度

      // 先找出所有父 combo（主中心、灾备中心）
      const parentCombos = combos.filter(
        (c) =>
          c.id === "mainCenter" ||
          c.id === "noneCenter" ||
          c.id === "disasterCenter"
      );

      // 先处理子 combo 的尺寸计算
      const childCombos = combos.filter(
        (c) => c.type === "custom-combo" && c.parentId
      );

      // 为每个子 combo 计算实际尺寸（基于内部节点数量）
      childCombos.forEach((child) => {
        // 获取该 combo 下的所有节点
        const childNodes = nodes.filter((n) => n.comboId === child.id);

        // 检查combo的parentId是否为mainCenter
        const combo = this.tabRawData.combos?.find((c) => c.id === child.id);
        const isMainCenterChild = combo && combo.parentId === "mainCenter";

        const nodeSize = 200;
        const nodeSpacing = 150;
        const padding = 50;
        const labelHeight = 40;

        // 在 layoutCombos 方法中，针对 mainCenter 子 combo 的处理部分

        if (isMainCenterChild) {
          // 对于mainCenter的子combo：每列最多2个节点，从左到右排列
          const nodesPerColumn = 2;

          // 正确计算实际行数和列数
          const actualRows = 2; // 最多2行，但不超过实际节点数
          const columns = Math.ceil(childNodes.length / nodesPerColumn) || 1;

          // 计算实际尺寸 - 只有当有多列或多行时才添加间距
          const width =
            columns * nodeSize +
            (columns > 1 ? (columns - 1) * nodeSpacing : 0) +
            2 * padding;

          const height =
            actualRows * nodeSize +
            (actualRows > 1 ? (actualRows - 1) * nodeSpacing : 0) +
            2 * padding +
            labelHeight * 2;

          child.width = width;
          child.height = height;
        } else {
          // 其他combo使用4列水平布局
          const nodesPerRow = 4;

          // 计算实际行列数
          const rows = Math.ceil(childNodes.length / nodesPerRow) || 1;
          const cols = Math.min(childNodes.length, nodesPerRow);

          // 特别处理只有一个节点的情况
          if (childNodes.length === 1) {
            // 单个节点时，combo只需要容纳一个节点的空间
            const width = nodeSize + 2 * padding;
            const height = nodeSize + labelHeight + 2 * padding;
            child.width = width;
            child.height = height;
          } else {
            // 计算实际尺寸
            const width =
              cols * nodeSize +
              (cols > 1 ? (cols - 1) * nodeSpacing : 0) +
              2 * padding;

            const height =
              rows * nodeSize +
              (rows > 1 ? (rows - 1) * nodeSpacing : 0) +
              2 * padding +
              labelHeight;

            child.width = width;
            child.height = height;
          }
        }
      });

      // 为每个父 combo 计算实际需要的尺寸
      parentCombos.forEach((parent) => {
        // 获取该父容器下的所有子combo
        const children = combos.filter(
          (c) => c.parentId === parent.id && c.type === "custom-combo"
        );

        if (children.length === 0) {
          // 如果没有子combo，使用默认尺寸
          parent.width = 1200; // 先使用临时宽度，后续会统一
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

        // 在 layoutCombos 方法中修改这部分代码：

        // 特别处理mainCenter：水平排列
        if (parent.id === "mainCenter") {
          // 水平排列时，宽度是所有子combo宽度之和加上间距
          let totalWidth = 0;
          children.forEach((child, index) => {
            totalWidth += child.width || 250;
            if (index < children.length - 1) {
              totalWidth += spacing; // 添加间距
            }
          });

          parent.width = totalWidth + spacing * 2; // 左右各一个spacing
          parent.height = (maxHeight || 150) + titleHeight * 2 + spacing * 2; // 上下各一个spacing，加上标题区域
        } else {
          // 特别处理noneCenter和disasterCenter，当只有一个子combo时，让父容器尺寸更大
          if (
            children.length === 1 &&
            (parent.id === "noneCenter" || parent.id === "disasterCenter")
          ) {
            // 当noneCenter或disasterCenter只有一个子combo时，让父容器尺寸接近子combo尺寸但稍大一些
            const child = children[0];
            // 设置父容器尺寸稍大于子combo，确保有足够的边距
            parent.width = (child.width || 250) + 200; // 增加左右各100px的边距
            parent.height = (child.height || 150) + 200; // 增加上下各100px的边距
          } else {
            // 其他父combo保持原有计算方式
            const rows = Math.ceil(children.length / maxPerRow) || 1;
            const cols = Math.min(children.length, maxPerRow);

            // 计算父容器尺寸
            const parentWidth =
              cols * maxWidth + (cols - 1) * spacing + spacing * 2;
            const parentHeight =
              titleHeight * 2 +
              rows * maxHeight +
              (rows - 1) * spacing +
              spacing * 2 +
              50; // 上下都增加标题区域高度

            parent.width = parentWidth;
            parent.height = parentHeight;
          }
        }
      });

      // 确保所有父combo使用相同的宽度（以mainCenter为准）
      if (parentCombos.length > 0) {
        const mainCenter = parentCombos.find((c) => c.id === "mainCenter");
        if (mainCenter) {
          // 使用mainCenter的宽度作为统一宽度
          const unifiedWidth = mainCenter.width;

          // 为所有父combo设置相同的宽度
          parentCombos.forEach((parent) => {
            parent.width = unifiedWidth;
          });
        }
      }

      // 三区域布局：上(主中心)、中(独立combo)、下(灾备中心)
      if (parentCombos.length >= 2) {
        // 按照固定顺序排列
        const mainCenter = parentCombos.find((c) => c.id === "mainCenter");
        const noneCenter = parentCombos.find((c) => c.id === "noneCenter");
        const disasterCenter = parentCombos.find(
          (c) => c.id === "disasterCenter"
        );

        const allParents = [mainCenter, noneCenter, disasterCenter].filter(
          Boolean
        );

        if (allParents.length > 0) {
          // 使用统一间距
          const verticalSpacing = 200; // 统一间距
          const startX = 100;

          // 计算所有父combo的位置，确保间距一致
          let currentY = verticalSpacing;

          allParents.forEach((parent, index) => {
            if (parent) {
              parent.x = startX;
              parent.y = currentY;

              // 更新currentY为当前combo的底部位置
              currentY += parent.height || 400;

              // 如果不是最后一个元素，添加间距
              if (index < allParents.length - 1) {
                currentY += verticalSpacing;
              }
            }
          });

          // 特别处理noneCenter，让它向上偏移自身高度的一半+边距
          if (noneCenter) {
            const offset = verticalSpacing / 2;
            noneCenter.y -= offset;

            // 同时调整上方和下方的combo，避免重叠
            // if (mainCenter) {
            //   mainCenter.y -= offset / 2;
            // }
            // if (disasterCenter) {
            //   disasterCenter.y += offset / 2;
            // }
          }

          // 存储位置信息
          this.parentComboPositions = {};
          allParents.forEach((parent, index) => {
            if (parent) {
              this.parentComboPositions[parent.id] = {
                x: parent.x,
                y: parent.y,
                width: parent.width,
                height: parent.height,
              };
            }
          });
        }
      }

      // 处理每个父 combo 内的子 combo 布局
      parentCombos.forEach((parent) => {
        const children = combos.filter(
          (c) => c.parentId === parent.id && c.type === "custom-combo"
        );

        // 特别处理mainCenter：水平从左到右排列
        if (parent.id === "mainCenter") {
          const titleHeight = 50;
          // 计算垂直居中位置（考虑标题区域）
          const centerY =
            parent.y + titleHeight + (parent.height - titleHeight * 2) / 2;

          // 从父容器的左侧内边距开始计算
          let currentX = parent.x + spacing;

          children.forEach((child, index) => {
            // 特别处理应用集群C，让它向左偏移
            let offsetX = 0;
            if (child.id === "C") {
              offsetX = -(child.width / 2) - spacing / 2; // 应用集群C向左偏移
            }
            // 水平排列，垂直居中（考虑标题区域）
            child.x = currentX + offsetX;
            child.y = centerY - (child.height || 150) / 2;

            // 使用实际计算的宽度，如果没有则使用默认值
            const childWidth = child.width || 250;
            // 更新下一个元素的X位置，加上当前元素宽度和间距
            currentX += childWidth + spacing;
          });
        } else {
          // 特别处理noneCenter和disasterCenter，当只有一个子combo时，让其居中显示
          if (
            children.length === 1 &&
            (parent.id === "noneCenter" || parent.id === "disasterCenter")
          ) {
            const child = children[0];
            // 让子combo在父容器中居中显示
            child.x = parent.x + (parent.width - (child.width || 250)) / 2;
            child.y = parent.y + (parent.height - (child.height || 150)) / 2;
          } else {
            // 其他父combo保持原有布局逻辑
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

              // 子 combo 相对于父 combo 的偏移（考虑标题区域）
              child.x = parent.x + spacing + col * (maxWidth + spacing);
              child.y =
                parent.y +
                titleHeight * 2 +
                spacing +
                row * (maxHeight + spacing);
            });
          }
        }
      });
    },

    convertToGraphData(rawData) {
      if (!rawData || !rawData.nodes) {
        return { nodes: [], edges: [], combos: [] };
      }

      // 转换节点数据
      const nodes = rawData.nodes.map((node) => {
        // 查找节点所属的combo
        const combo = rawData.combos.find((c) => c.id === node.combo);
        let isInDisasterCenter = false;

        // 检查节点的combo是否属于disasterCenter
        if (combo && combo.parentId === "disasterCenter") {
          isInDisasterCenter = true;
        }

        return {
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
          // 添加额外属性用于标识是否在disasterCenter中
          isInDisasterCenter: isInDisasterCenter,
        };
      });

      // 转换边数据
      let edges = [];
      if (rawData.edges && Array.isArray(rawData.edges)) {
        edges = rawData.edges.map((edge) => {
          const newEdge = {
            source: edge.source,
            target: edge.target,
            detailValue: edge.detailValue || [],
            hoverValue: edge.hoverValue || [],
            type: "orthogonal-edge",
            status: edge.status,
            name: edge.name || `${edge.source} → ${edge.target}`, // 添加 name 字段，默认值
          };

          // 定义锚点映射关系表（基于实际的锚点索引）
          const anchorMap = {
            // 负载均衡到主中心: 负载均衡的下1锚点(索引0)到主中心的上1锚点(索引0)
            "loadBalancer->mainCenter": { sourceAnchor: 0, targetAnchor: 0 },
            // 主中心到负载均衡: 主中心的上2锚点(索引1)到负载均衡的下2锚点(索引1)
            "mainCenter->loadBalancer": { sourceAnchor: 1, targetAnchor: 1 },
            // 负载均衡到灾备中心: 负载均衡的下4锚点(索引3)到灾备中心的上2锚点(索引1)
            "loadBalancer->disasterCenter": {
              sourceAnchor: 3,
              targetAnchor: 1,
            },
            // 灾备中心到负载均衡: 灾备中心的上1锚点(索引0)到负载均衡的下3锚点(索引2)
            "disasterCenter->loadBalancer": {
              sourceAnchor: 0,
              targetAnchor: 2,
            },
            "A->G": {
              sourceAnchor: 2,
              targetAnchor: 5,
            },
            "G->A": {
              sourceAnchor: 4,
              targetAnchor: 3,
            },
          };
          // 特殊处理A和G之间的连接
          if (edge.source === "A" && edge.target === "G") {
            newEdge.sourceAnchor = 2; // A的下侧第一个锚点
            newEdge.targetAnchor = 5; // G的上侧第一个锚点
          } else if (edge.source === "G" && edge.target === "A") {
            newEdge.sourceAnchor = 4; // G的上侧第二个锚点
            newEdge.targetAnchor = 3; // A的下侧第二个锚点
          } else {
            // 构造当前边的标识符用于查找映射
            const sourceType = edge.source.includes("loadBalancer")
              ? "loadBalancer"
              : edge.source.includes("mainCenter")
              ? "mainCenter"
              : edge.source.includes("disasterCenter")
              ? "disasterCenter"
              : "other";

            const targetType = edge.target.includes("loadBalancer")
              ? "loadBalancer"
              : edge.target.includes("mainCenter")
              ? "mainCenter"
              : edge.target.includes("disasterCenter")
              ? "disasterCenter"
              : "other";

            const key = `${sourceType}->${targetType}`;

            // 应用对应的锚点配置
            if (anchorMap[key]) {
              newEdge.sourceAnchor = anchorMap[key].sourceAnchor;
              newEdge.targetAnchor = anchorMap[key].targetAnchor;
            } else {
              // 可选：打印日志或设置默认锚点以防止意外情况
              console.warn(`未找到对应锚点配置: ${key}`);
            }
          }
          return newEdge;
        });
      }

      // 转换普通 combo（集群）
      let combos = [];
      if (rawData.combos && Array.isArray(rawData.combos)) {
        combos = rawData.combos.map((combo) => ({
          id: combo.id,
          label: combo.name,
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
            comboStatus: parentCombo.status,
            x: 0,
            y: 0,
            status:  parentCombo.status,
            // width: 800, // 设置足够宽度
            // height: 400, // 设置足够高度
          });
        });
      }

      // 设置父子关系：让每个 combo 的 parentId 成为其父 combo
      combos.forEach((combo) => {
        if (
          combo.id === "mainCenter" ||
          combo.id === "noneCenter" ||
          combo.id === "disasterCenter"
        ) {
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
          this.reverseScale();
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
      // 重新应用反缩放
      this.reverseScale();
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
        if (comboId === "mainCenter" || comboId === "disasterCenter") {
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
      // 边鼠标点击事件
      this.graph.on("edge:click", (evt) => {
        const edge = evt.item;
        const edgeModel = edge.getModel();

        // 设置选中边的标签
        this.selectedNodeLabel =
          edgeModel.name || `${edgeModel.source} → ${edgeModel.target}`;

        // 构造边的详情数据
        const edgeDetailItems = [];
        if (edgeModel.detailValue && edgeModel.detailValue.length > 0) {
          edgeDetailItems.push({
            name: "连接详情",
            values: edgeModel.detailValue,
          });
        } else {
          edgeDetailItems.push({
            name: "连接详情",
            stats: [
              { name: "源节点", value: edgeModel.source },
              { name: "目标节点", value: edgeModel.target },
              {
                name: "状态",
                value: edgeModel.status === "normal" ? "正常" : "异常",
              },
            ],
          });
        }

        this.detailItems = edgeDetailItems;
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
      //线鼠标悬浮事件
      this.graph.on("edge:mouseenter", (evt) => {
        const edge = evt.item;
        const edgeModel = edge.getModel();

        // 构建提示内容
        let tooltipContent = `<div class="node-tooltip"><div class="tooltip-content">`;

        // 添加节点详情信息
        if (edgeModel.hoverValue && edgeModel.hoverValue.length > 0) {
          edgeModel.hoverValue.forEach((detail) => {
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
        if (!this.edgeTooltipElement) {
          this.edgeTooltipElement = document.createElement("div");
          this.edgeTooltipElement.className = "g6-node-tooltip";
          this.edgeTooltipElement.style.position = "absolute";
          this.edgeTooltipElement.style.backgroundColor = "#111B30";
          this.edgeTooltipElement.style.color = "#fff";
          this.edgeTooltipElement.style.padding = "10px";
          this.edgeTooltipElement.style.borderRadius = "4px";
          this.edgeTooltipElement.style.fontSize = "12px";
          this.edgeTooltipElement.style.zIndex = "999";
          this.edgeTooltipElement.style.boxShadow =
            "0 2px 6px rgba(0, 0, 0, 0.3)";
          this.edgeTooltipElement.style.pointerEvents = "none";
          document.body.appendChild(this.edgeTooltipElement);
        }

        this.edgeTooltipElement.innerHTML = tooltipContent;
        // 设置提示框位置为鼠标右侧
        this.edgeTooltipElement.style.left = evt.canvasX + "px";
        this.edgeTooltipElement.style.top = evt.canvasY + "px";
        this.edgeTooltipElement.style.transform = "translate(80px, 0)";

        this.edgeTooltipElement.style.display = "block";
      }),
        // 边鼠标移出事件
        this.graph.on("edge:mouseleave", (evt) => {
          if (this.edgeTooltipElement) {
            this.edgeTooltipElement.style.display = "none";
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

              values: detail.values || [],
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

          // 构建详情项，按新的三层结构组织
          detailData[source] = [
            {
              type: "system",
              title: "系统资源层",
              items: listdetail[0]?.systemResourceLayer || [],
            },
            {
              type: "application",
              title: "应用软件层",
              items: listdetail[0]?.applicationSoftwareLayer || [],
            },
            {
              type: "business",
              title: "业务服务层",
              items: listdetail[0]?.businessServiceLayer || [],
            },
            {
              type: "operation",
              title: "操作列表",
              items: listdetail[0]?.operationList || [],
            },
          ];
        });
      }

      return detailData;
    },
    /**
     * 根据指标值获取数值颜色
     * @param {String} value - 指标值
     * @param {String} label - 指标名称
     * @returns {String} 颜色值
     */
    getValueColor(value, label) {
      // 如果数据中已经定义了颜色，优先使用
      if (arguments.length > 2 && arguments[2]) {
        return arguments[2]; // 第三个参数是color
      }

      // 移除单位，只保留数字部分进行比较
      let numericValue = parseFloat(value);

      // 特殊处理百分比字符串，如"20%"
      if (typeof value === "string" && value.includes("%")) {
        numericValue = parseFloat(value.replace("%", ""));
      }

      // 对于状态类文本，根据内容判断颜色
      if (typeof value === "string") {
        if (
          value.includes("🟢") ||
          value.includes("正常") ||
          value.includes("在线")
        ) {
          return "#61bd4f"; // 绿色（枚举字段）
        } else if (
          value.includes("🔴") ||
          value.includes("异常") ||
          value.includes("离线") ||
          value.includes("危险")
        ) {
          return "#ff4d4f"; // 红色（危险）
        } else if (value.includes("🟡") || value.includes("警告")) {
          return "#ffc53d"; // 黄色（警告）
        } else if (value.includes("🟠") || value.includes("严重")) {
          return "#ffa940"; // 橙色（严重警告）
        } else if (
          value.includes("运行中") ||
          value.includes("已连接") ||
          value.includes("启用") ||
          value.includes("开启")
        ) {
          return "#61bd4f"; // 绿色（枚举字段）
        }
      }

      // 如果不是数字，且不是特殊状态文本，根据字段类型判断
      if (isNaN(numericValue)) {
        // 判断是否为枚举字段（状态类字段）
        if (
          label.includes("状态") ||
          label.includes("进程") ||
          label.includes("采集器") ||
          label.includes("时间")
        ) {
          return "#61bd4f"; // 绿色（枚举字段）
        }
        return "#ffffff"; // 白色（默认）
      }

      // 对于数值类型，根据指标名称和数值判断状态颜色
      if (
        label.includes("CPU使用率") ||
        label.includes("内存使用率") ||
        label.includes("磁盘使用率")
      ) {
        if (numericValue < 70) {
          return "#ffffff"; // 白色（正常）
        } else if (numericValue < 80) {
          return "#ffc53d"; // 黄色（警告）
        } else if (numericValue < 90) {
          return "#ffa940"; // 橙色（严重警告）
        } else {
          return "#ff4d4f"; // 红色（危险）
        }
      }

      if (label.includes("成功率") || label.includes("响应率")) {
        if (numericValue > 99) {
          return "#ffffff"; // 白色（正常）
        } else if (numericValue > 95) {
          return "#ffc53d"; // 黄色（警告）
        } else if (numericValue > 90) {
          return "#ffa940"; // 橙色（严重警告）
        } else {
          return "#ff4d4f"; // 红色（危险）
        }
      }

      if (
        label.includes("错误") ||
        label.includes("失败") ||
        label.includes("丢包")
      ) {
        if (numericValue === 0) {
          return "#ffffff"; // 白色（正常）
        } else if (numericValue <= 5) {
          return "#ffc53d"; // 黄色（警告）
        } else if (numericValue <= 10) {
          return "#ffa940"; // 橙色（严重警告）
        } else {
          return "#ff4d4f"; // 红色（危险）
        }
      }

      // 默认返回白色（数值类型）
      return "#ffffff";
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
        this.graph.fitView([100, 100, 100, 100]);
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
      height: calc(100% - 100px);
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
              padding: 5px 0;

              &:last-child {
                border-bottom: none;
              }

              .item-label {
                font-size: 12px;
                color: #fff;
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
