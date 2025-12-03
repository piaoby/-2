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
                [0, 0.5], // 左侧中间
                [1, 0.42], // 右侧中间
                [0.5, 0], // 上侧中间
                [0.5, 1] // 下侧中间

                // // 左侧边的3个锚点 (x=0)
                // [0, 0.25], // 左侧上部
                // [0, 0.5], // 左侧中间
                // [0, 0.75], // 左侧下部

                // // 右侧边的3个锚点 (x=1)
                // [1, 0.25], // 右侧上部
                // [1, 0.5], // 右侧中间
                // [1, 0.75], // 右侧下部

                // // 上侧边的3个锚点 (y=0)
                // [0.25, 0], // 上侧左部
                // [0.5, 0], // 上侧中间
                // [0.75, 0], // 上侧右部

                // // 下侧边的3个锚点 (y=1)
                // [0.25, 1], // 下侧左部
                // [0.5, 1], // 下侧中间
                // [0.75, 1] // 下侧右部
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

G6.registerEdge('flowing-polyline', {
    draw (cfg, group) {
        const { startPoint, endPoint } = cfg
        // 使用新的路径计算方法，传递cfg参数
        const path = this.calcPolylinePath(startPoint, endPoint, cfg)

        // 创建主线（底色）
        const mainLine = group.addShape('path', {
            attrs: {
                path: path,
                stroke: 'rgba(40, 101, 255, 0.35)', // #2865ff 颜色，35% 透明度
                lineWidth: 8
            },
            name: 'main-path-shape'
        })

        return mainLine
    },

    afterDraw (cfg, group) {
        const { startPoint, endPoint } = cfg
        // 使用新的路径计算方法，传递cfg参数
        const path = this.calcPolylinePath(startPoint, endPoint, cfg)

        // 创建流动效果线
        const flowLine = group.addShape('path', {
            attrs: {
                path: path,
                stroke: '#2865ff', // 流动颜色为 #2865ff，无透明度
                lineWidth: 4,
                lineDash: [400, 400]
            },
            name: 'flow-path-shape'
        })

        // 添加流动动画
        if (flowLine && flowLine.animate) {
            flowLine.animate(
                (ratio) => {
                    const diff = ratio * 800 // 动画偏移量
                    return {
                        lineDashOffset: -diff // 改为负值，改变流动方向
                    }
                },
                {
                    repeat: true,
                    duration: 1500
                }
            )
        }
    },
    
    // 新增计算垂直-水平折线路径的方法
    calcPolylinePath (startPoint, endPoint, cfg) {
        // 检查是否为负载均衡器到主中心或灾备中心的连接
        if (cfg && cfg.sourceNode && cfg.targetNode) {
            const sourceModel = cfg.sourceNode.getModel()
            const targetModel = cfg.targetNode.getModel()
            
            // 判断源节点是否为负载均衡器
            const isSourceLoadBalancer = sourceModel.source === '负载均衡器'
                                       || (sourceModel.label && sourceModel.label.includes('负载均衡'))
            
            // 判断目标节点是否为主中心或灾备中心
            const isTargetCenter = (targetModel.comboId === 'mainCenter')
                                  || (targetModel.comboId === 'disasterCenter')
                                  || (targetModel.label && (targetModel.label.includes('主中心')
                                                        || targetModel.label.includes('灾备中心')))
            
            // 如果是负载均衡器到中心的连接，使用先垂直再水平的路径
            if (isSourceLoadBalancer && isTargetCenter) {
                // 先垂直到目标点的Y坐标，再水平到目标点
                return [
                    ['M', startPoint.x, startPoint.y],
                    ['L', startPoint.x, endPoint.y],
                    ['L', endPoint.x, endPoint.y]
                ]
            }
        }
        
        // 对于其他连接，使用直线路径
        return [
            ['M', startPoint.x, startPoint.y],
            ['L', endPoint.x, endPoint.y]
        ]
    },

    update (cfg, item) {
        const { startPoint, endPoint } = cfg
        // 使用新的路径计算方法，传递cfg参数
        const path = this.calcPolylinePath(startPoint, endPoint, cfg)
    
        const group = item.getContainer()
        const children = group.get('children')
    
        // 更新所有子形状
        if (children) {
            children.forEach((child) => {
                if (child.attr) {
                    child.attr({ path: path })
                }
            })
        }
        
        // 重新启动流动动画
        const flowLine = group.find(element => element.get('name') === 'flow-path-shape')
        if (flowLine && flowLine.animate) {
            // 先停止之前的动画
            flowLine.stopAnimate()
            
            // 重新开始动画
            flowLine.animate(
                (ratio) => {
                    const diff = ratio * 800 // 动画偏移量
                    return {
                        lineDashOffset: -diff // 改为负值，保持流动方向一致
                    }
                },
                {
                    repeat: true,
                    duration: 1500
                }
            )
        } else if (!flowLine) {
            // 如果找不到flowLine，尝试从group直接获取
            const flowLineFromGroup = group.get('flowLine')
            if (flowLineFromGroup && flowLineFromGroup.animate) {
                flowLineFromGroup.stopAnimate()
                flowLineFromGroup.animate(
                    (ratio) => {
                        const diff = ratio * 800
                        return {
                            lineDashOffset: -diff
                        }
                    },
                    {
                        repeat: true,
                        duration: 1500
                    }
                )
            }
        }
    }
})
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
