// customNode.js
import G6 from '@antv/g6'
// 导入Base64图片资源
import { Base64Img } from './imageResources'

G6.registerNode(
    'custom-node',
    {
        draw (cfg, group) {
            const size = cfg.size || 100
            const status = cfg.status // 正常/idle
            const source = cfg.source // 数据来源
            const labelHeight = 40 // 标签高度
         
            if (cfg.comboId) {
                // 在实际使用中，我们可以通过cfg获取到combo信息
                // 这里假设我们有一个方式获取父combo信息
                // 暂时先保持原有逻辑，颜色处理在update方法中更合适
            }

            // 底座图片 - 根据是否在disasterCenter中选择不同底座
            const baseImage = group.addShape('image', {
                attrs: {
                    x: -size / 2,
                    y: -size / 2,
                    width: size,
                    height: size,
                    // 根据状态和位置选择不同的底座图片
                    img: status === 'idle'
                        ? Base64Img.GbaseImagelBase64
                        : Base64Img.baseImageBase64
                },
                name: 'base-image'
            })

            // 类型图片 - 根据source和status分为前三种类型
            let typeImageSource
            if (source === '防火墙') {
                // 防火墙类型图片，根据状态选择
                typeImageSource = status === 'idle'
                    ? Base64Img.firewallErrorBase64
                    : Base64Img.firewallBase64
            } else if (source === '负载均衡器' || source === 'ESB集群信息') {
                // F5类型图片，根据状态选择
                typeImageSource = status === 'idle'
                    ? Base64Img.GF5Base64
                    : Base64Img.F5Base64
            } else {
                // 默认类型图片，根据状态选择
                typeImageSource = status === 'idle'
                    ? Base64Img.GtopologyImageBase64
                    : Base64Img.topologyImageBase64
            }

            // 类型图片 - 统一尺寸，居中显示
            const typeImage = group.addShape('image', {
                attrs: {
                    x: -size * 0.37,
                    y: -size * 0.5,
                    width: size * 0.8,
                    height: size * 0.7,
                    img: typeImageSource
                },
                name: 'type-image'
            })

            if (cfg.label) {
                group.addShape('text', {
                    attrs: {
                        x: 0,
                        y: size / 2 + 15,
                        textAlign: 'center',
                        textBaseline: 'top',
                        text: cfg.label,
                        fill: '#fff',
                        fontSize: 40
                    },
                    name: 'custom-node-label'
                })
            }

            // 添加透明覆盖层，用于捕获鼠标事件
            // 覆盖层需要包含标签区域，使整个节点+标签作为一个整体
            const totalHeight = size + labelHeight
            const dragArea = group.addShape('rect', {
                attrs: {
                    x: -size / 2,
                    y: -size / 2,
                    width: size,
                    height: totalHeight,
                    fill: 'transparent',
                    stroke: 'transparent'
                },
                name: 'drag-area',
                draggable: true
            })

            return dragArea
        },

        // 设置锚点
        getAnchorPoints () {
            // 其他节点保持原有的12个锚点
            return [
                // 左侧边的3个锚点 (x=0)
                [0, 0.25], // 左侧上部
                [0, 0.5], // 左侧中间
                [0, 0.75], // 左侧下部

                // 右侧边的3个锚点 (x=1)
                [1, 0.25], // 右侧上部
                [1, 0.5], // 右侧中间
                [1, 0.75], // 右侧下部

                // 上侧边的3个锚点 (y=0)
                [0.25, 0], // 上侧左部
                [0.5, 0], // 上侧中间
                [0.75, 0], // 上侧右部

                // 下侧边的3个锚点 (y=1)
                [0.25, 1], // 下侧左部
                [0.5, 1], // 下侧中间
                [0.75, 1] // 下侧右部
            ]
        },

        // 更新节点时的处理
        update (cfg, item) {
            const group = item.getContainer()
            const children = group.get('children')
            const status = cfg.status
            const source = cfg.source
            const nodeSize = cfg.size || 50
            const labelHeight = 40 // 标签高度

            // 更新底座图片
            if (children[0]) {
                // 根据状态选择不同的底座图片
                let baseImageSource = Base64Img.baseImageBase64
                if (status === 'idle') {
                    baseImageSource = Base64Img.GbaseImagelBase64
                }
        
                children[0].attr({
                    img: baseImageSource,
                    y: -nodeSize / 2
                })
            }

            // 更新类型图片
            if (children[1]) {
                let typeImageSource
                if (source === '防火墙') {
                    typeImageSource = status === 'idle'
                        ? Base64Img.firewallErrorBase64
                        : Base64Img.firewallBase64
                } else if (source === '负载均衡器' || source === 'ESB集群信息') {
                    typeImageSource = status === 'idle'
                        ? Base64Img.GF5Base64
                        : Base64Img.F5Base64
                } else {
                    typeImageSource = status === 'idle'
                        ? Base64Img.GtopologyImageBase64
                        : Base64Img.topologyImageBase64
                }
                children[1].attr({
                    img: typeImageSource,
                    width: nodeSize * 0.8,
                    height: nodeSize * 0.7,
                    x: -nodeSize * 0.37,
                    y: -nodeSize * 0.5
                })
            }

            // 更新标签
            const labelIndex = children.length > 2 ? 2 : children.length - 1
            if (
                cfg.label
        && children[labelIndex]
        && children[labelIndex].get('name') === 'custom-node-label'
            ) {
                children[labelIndex].attr({
                    text: cfg.label,
                    fill: '#fff',
                    y: nodeSize / 2 + 15
                })
            }

            // 更新拖拽区域大小，包含标签区域
            const dragAreaIndex = children.length > 3 ? 3 : children.length - 1
            if (
                children[dragAreaIndex]
        && children[dragAreaIndex].get('name') === 'drag-area'
            ) {
                const totalHeight = nodeSize + labelHeight
                children[dragAreaIndex].attr({
                    height: totalHeight,
                    y: -nodeSize / 2
                })
            }
        },

        // 添加状态交互
        setState (name, value, item) {
            if (name === 'hover') {
                const group = item.getContainer()
                const children = group.get('children')
                // 可以在这里添加hover状态的样式变化
            }
        }
    },
    'single-node'
)
G6.registerEdge(
    'orthogonal-edge',
    {
        draw (cfg, group) {
            const path = this.calcCustomPath(cfg)

            // 创建主线（实线）
            const mainLine = group.addShape('path', {
                attrs: {
                    path: path,
                    stroke: '#264d85',
                    lineWidth: 8
                },
                name: 'main-path-shape'
            })

            return mainLine
        },

        afterDraw (cfg, group) {
            const path = this.calcCustomPath(cfg)

            // 创建带渐变的流动效果线
            const flowLine = group.addShape('path', {
                attrs: {
                    path: path,
                    stroke: 'l(0)0.7:rgba(0,191,255,0.8) 1:rgba(0,191,255,1)',
                    lineWidth: 2,
                    lineDash: [40, 40],
                    lineDashOffset: 8
                },
                name: 'flow-path-shape'
            })

            group.set('flowLine', flowLine)
            this.startAnimation(flowLine)
        },

        startAnimation (flowLine) {
            if (flowLine && flowLine.animate) {
                flowLine.animate(
                    (ratio) => ({
                        lineDashOffset: ratio * -80
                    }),
                    {
                        repeat: true,
                        duration: 1000
                    }
                )
            }
        },

        // 更新 orthogonal-edge 的定义，简化避障逻辑
        update (cfg, edge) {
            // 修复原代码中的问题，正确停止动画
            const group = edge.getContainer()
            const path = this.calcCustomPath(cfg)

            // 更新所有子形状
            const children = group.get('children')
            if (children) {
                children.forEach((child) => {
                    if (child.attr) {
                        child.attr({ path: path })
                    }
                })
            }

            // 正确获取和重启动画
            const flowLine = group.find(
                (element) => element.get('name') === 'flow-path-shape'
            )
            if (flowLine && flowLine.animate) {
                flowLine.stopAnimate()
                this.startAnimation(flowLine)
            }
        },

        // 修改 customNode.js 中 orthogonal-edge 的 calcCustomPath 方法
        calcCustomPath (cfg) {
            const { startPoint, endPoint, sourceNode, targetNode } = cfg

            // 获取源节点和目标节点的模型数据
            const sourceModel = sourceNode ? sourceNode.getModel() : null
            const targetModel = targetNode ? targetNode.getModel() : null

            // 判断节点类型
            const isFromLoadBalancer
        = sourceModel
        && (sourceModel.source === '负载均衡器'
          || (sourceModel.label && sourceModel.label.includes('负载均衡')))

            const isToMainCenter = targetModel && targetModel.id === 'mainCenter'
            const isToDisasterCenter
        = targetModel && targetModel.id === 'disasterCenter'

            const isFromMainCenter = sourceModel && sourceModel.id === 'mainCenter'
            const isFromDisasterCenter
        = sourceModel && sourceModel.id === 'disasterCenter'

            const isToLoadBalancer
        = targetModel
        && (targetModel.source === '负载均衡器'
          || (targetModel.label && targetModel.label.includes('负载均衡')))

            // 根据不同的连接类型使用不同的路径
            if (isFromLoadBalancer && isToMainCenter) {
                // 负载均衡到主中心：向下然后连接
                return this.createSpecialPath(
                    startPoint,
                    endPoint,
                    'down-then-connect'
                )
            } else if (isFromMainCenter && isToLoadBalancer) {
                // 主中心到负载均衡：向上然后连接
                return this.createSpecialPath(startPoint, endPoint, 'up-then-connect')
            } else if (isFromLoadBalancer && isToDisasterCenter) {
                // 负载均衡到灾备中心：向下然后连接
                return this.createSpecialPath(
                    startPoint,
                    endPoint,
                    'down-then-connect'
                )
            } else if (isFromDisasterCenter && isToLoadBalancer) {
                // 灾备中心到负载均衡：向上然后连接
                return this.createSpecialPath(startPoint, endPoint, 'up-then-connect')
            } else {
                // 默认使用标准的正交路径，根据锚点位置决定方向
                return this.createOrthogonalPathByAnchor(cfg)
            }
        },

        // 根据锚点位置决定路径方向的新方法
        createOrthogonalPathByAnchor (cfg) {
            const { startPoint, endPoint, sourceAnchor, sourceNode } = cfg

            // 根据源锚点决定初始方向
            // 锚点索引对应位置：
            // custom-node 锚点：
            //   [0, 0.25], [0, 0.5], [0, 0.75] - 左侧锚点 (索引 0-2)
            //   [1, 0.25], [1, 0.5], [1, 0.75] - 右侧锚点 (索引 3-5)
            //   [0.25, 0], [0.5, 0], [0.75, 0] - 上侧锚点 (索引 6-8)
            //   [0.25, 1], [0.5, 1], [0.75, 1] - 下侧锚点 (索引 9-11)
            //
            // custom-combo 锚点：
            //   [0, 0.45], [0, 0.55] - 左侧锚点 (索引 0-1)
            //   [1, 0.45], [1, 0.55] - 右侧锚点 (索引 2-3)
            //   [0.45, 0], [0.55, 0] - 上侧锚点 (索引 4-5)
            //   [0.45, 1], [0.55, 1] - 下侧锚点 (索引 6-7)

            // 判断源锚点类型
            let isSourceVertical = false // 是否从上下锚点出发

            if (sourceAnchor !== undefined) {
                if (sourceNode) {
                    const sourceModel = sourceNode.getModel()
                    const sourceNodeType = sourceModel.type

                    if (sourceNodeType === 'custom-node') {
                        // custom-node 的锚点分布
                        if (sourceAnchor >= 6 && sourceAnchor <= 11) {
                            // 上下锚点 (索引 6-11)
                            isSourceVertical = true
                        }
                        // 左右锚点 (索引 0-5) 则 isSourceVertical = false
                    } else if (sourceNodeType === 'custom-combo') {
                        // custom-combo 的锚点分布
                        if (
                            (sourceAnchor >= 4 && sourceAnchor <= 5)
              || (sourceAnchor >= 6 && sourceAnchor <= 7)
                        ) {
                            // 上下锚点 (索引 4-5, 6-7)
                            isSourceVertical = true
                        }
                        // 左右锚点 (索引 0-3) 则 isSourceVertical = false
                    }
                }
            }

            // 根据源锚点类型决定路径方向
            if (isSourceVertical) {
                // 从上下锚点出发，先垂直移动
                return [
                    ['M', startPoint.x, startPoint.y],
                    ['L', startPoint.x, endPoint.y],
                    ['L', endPoint.x, endPoint.y]
                ]
            } else {
                // 从左右锚点出发，先水平移动
                return [
                    ['M', startPoint.x, startPoint.y],
                    ['L', endPoint.x, startPoint.y],
                    ['L', endPoint.x, endPoint.y]
                ]
            }
        },

        createSpecialPath (startPoint, endPoint, type) {
            const offsetDistance = 100

            switch (type) {
                case 'down-then-connect':
                    // 向下延伸然后连接
                    const midY1 = startPoint.y + offsetDistance
                    return [
                        ['M', startPoint.x, startPoint.y],
                        ['L', startPoint.x, midY1],
                        ['L', endPoint.x, midY1],
                        ['L', endPoint.x, endPoint.y]
                    ]

                case 'up-then-connect':
                    // 向上延伸然后连接
                    const midY2 = startPoint.y - offsetDistance
                    return [
                        ['M', startPoint.x, startPoint.y],
                        ['L', startPoint.x, midY2],
                        ['L', endPoint.x, midY2],
                        ['L', endPoint.x, endPoint.y]
                    ]

                default:
                    // 对于特殊路径也使用锚点判断
                    // 这里保持原有的实现，因为特殊路径有特定的逻辑
                    return [
                        ['M', startPoint.x, startPoint.y],
                        ['L', startPoint.x, endPoint.y],
                        ['L', endPoint.x, endPoint.y]
                    ]
            }
        }
    },
    'line'
)
// 注册自定义 combo
G6.registerCombo(
    'custom-combo',
    {
        draw (cfg, group) {
            const comboStatus = cfg.comboStatus || 'normal'

            // 根据 combo 状态设置边框颜色和背景色
            let borderColor = 'rgba(95, 199, 255, 0.6)' // 默认正常状态颜色
            let bgColor = '#000c1b' // 默认背景颜色改为 #000c1b
            if (comboStatus === 'abnormal') {
                borderColor = '#ff4d4f' // 异常状态红色
                bgColor = '#000c1b' // 异常状态也保持相同背景色
            }

            // 获取节点信息来计算combo尺寸
            const nodeSize = 200 // 节点大小
            const nodeSpacing = 150 // 节点间距
            const padding = 50 // combo内边距
            const labelHeight = 40 // 节点标签高度

            // 检查combo的parentId是否为mainCenter
            const isMainCenterChild = cfg.parentId === 'mainCenter'

            // 计算节点数量和行列数
            const nodesCount = cfg.children ? cfg.children.length : 0

            let columns, rows, comboWidth, comboHeight

            if (isMainCenterChild) {
                // 对于mainCenter的子combo：每列最多2个节点，从左到右排列
                rows = 2 // 每列最多2个节点
                columns = Math.ceil(nodesCount / rows) || 1 // 计算需要多少列

                // 计算combo尺寸
                comboWidth
          = columns * nodeSize + (columns - 1) * nodeSpacing + 2 * padding
                comboHeight
          = rows * nodeSize + (rows - 1) * nodeSpacing + 2 * padding + 50 // 额外50px用于combo标题
            } else {
                // 其他combo保持原来的4列布局
                const nodesPerRow = 4
                rows = Math.ceil(nodesCount / nodesPerRow) || 1

                // 计算combo尺寸
                comboWidth
          = nodesPerRow * nodeSize
          + (nodesPerRow - 1) * nodeSpacing
          + 2 * padding
                comboHeight
          = rows * (nodeSize + nodeSpacing + labelHeight)
          - nodeSpacing
          + 2 * padding
          + 50
            }

            // 使用 (0,0) 作为中心点，计算左上角坐标用于绘制
            const x = -comboWidth / 2 // 左上角x坐标
            const y = -comboHeight / 2 // 左上角y坐标

            // 添加背景矩形（带边框）
            const bgRect = group.addShape('rect', {
                attrs: {
                    x: x,
                    y: y,
                    width: comboWidth,
                    height: comboHeight,
                    fill: bgColor,
                    opacity: 0.4, // 40% 透明度
                    stroke: borderColor, // 添加边框
                    lineWidth: 1, // 边框宽度
                    radius: 8
                },
                name: 'combo-background'
            })

            // 关键形状
            const keyShape = group.addShape('rect', {
                attrs: {
                    x: x,
                    y: y,
                    width: comboWidth,
                    height: comboHeight,
                    fill: 'transparent', // 保持透明，只作为关键形状
                    stroke: 'transparent' // 无边框
                },
                name: 'combo-keyShape'
            })

            // 根据父级设置标题颜色
            let labelColor = '#92ebff' // 默认标题颜色
            if (comboStatus === 'idle') {
                labelColor = '#92ffca' // 灾备中心子combo的标题颜色
            }

            // 添加 combo 标题在上方左侧
            if (cfg.label) {
                group.addShape('text', {
                    attrs: {
                        x: x, // 左对齐
                        y: y - 20, // 放在combo上方
                        textAlign: 'left',
                        textBaseline: 'bottom',
                        text: cfg.label,
                        fill: labelColor, // 使用条件设置的颜色
                        fontSize: 40,
                        fontWeight: 'bold'
                    },
                    name: 'combo-label'
                })
            }

            return keyShape
        },

        // G6 4.0中需要提供getComboCfg方法来配置combo
        getComboCfg (cfg) {
            return {
                padding: [40, 20, 20, 20], // 恢复原始padding设置
                style: {
                    lineWidth: 1,
                    fill: 'transparent',
                    stroke: 'rgba(95, 199, 255, 0.6)', // 默认边框颜色
                    radius: 8
                }
            }
        },

        // 更新combo时的处理
        update (cfg, item) {
            const group = item.getContainer()
            const children = group.get('children')
            const comboStatus = cfg.comboStatus || 'normal'

            // 根据 combo 状态设置边框颜色和背景色
            let borderColor = 'rgba(95, 199, 255, 0.6)' // 默认正常状态颜色
            let bgColor = '#000c1b' // 背景色改为 #000c1b
            if (comboStatus === 'abnormal') {
                borderColor = '#ff4d4f' // 异常状态红色
                bgColor = '#000c1b' // 异常状态也保持相同背景色
            }

            // 更新背景矩形（第一个子元素）
            if (children[0] && children[0].get('name') === 'combo-background') {
                children[0].attr({
                    fill: bgColor,
                    opacity: 0.4, // 40% 透明度
                    stroke: borderColor // 更新边框颜色
                })
            }

            // 更新关键形状（第二个子元素）
            if (children[1] && children[1].get('name') === 'combo-keyShape') {
                children[1].attr({
                    stroke: 'transparent' // 保持透明
                })
            }

            // 根据父级设置标题颜色
            let labelColor = '#92ebff' // 默认标题颜色
            if (comboStatus === 'idle') {
                labelColor = '#92ffca' // 灾备中心子combo的标题颜色
            }

            // 更新标签（第三个子元素）- 现在放在上方左侧
            if (children[2] && children[2].get('name') === 'combo-label') {
                const comboShape = children[0] // 获取combo背景形状
                if (comboShape) {
                    const attrs = comboShape.attr()
                    const x = attrs.x
                    const y = attrs.y

                    children[2].attr({
                        fill: labelColor, // 使用条件设置的颜色
                        x: x, // 与combo左边对齐
                        y: y - 20 // 放在combo上方
                    })
                }
            }
        },

        // 设置锚点
        getAnchorPoints () {
            return [
                [0, 0.3], // 左侧1 0
                [0, 0.7], // 左侧2 1

                [1, 0.3], // 右侧1 2
                [1, 0.7], // 右侧2 3
                [0.45, 0], // 上侧1 4
                [0.55, 0], // 上侧2 5
                [0.45, 1], // 下侧1 6
                [0.55, 1] // 下侧2 7
            ]
        }
    },
    'rect'
)
