// customNode.js
import G6 from '@antv/g6'
// 导入Base64图片资源
import { Base64Img } from './imageResources'

// 注册自定义节点
G6.registerNode(
    'custom-node',
    {
        draw (cfg, group) {
            const size = cfg.size || 50
            const status = cfg.status // 正常/异常
            const source = cfg.source // 数据来源
            const labelHeight = 20 // 标签高度

            // 底座图片
            const baseImage = group.addShape('image', {
                attrs: {
                    x: -size / 2,
                    y: -size / 2, // 恢复原始位置
                    width: size,
                    height: size,
                    // 根据状态选择不同的底座图片
                    img:
            status === '异常'
                ? Base64Img.abbaseImagelBase64
                : Base64Img.baseImageBase64
                },
                name: 'base-image'
            })

            // 类型图片 - 根据source和status分为前三种类型
            let typeImageSource
            if (source === '防火墙') {
                // 防火墙类型图片，根据状态选择
                typeImageSource
          = status === '异常'
                        ? Base64Img.firewallErrorBase64
                        : Base64Img.firewallBase64
            } else if (source === '负载均衡器' || source === 'ESB集群信息') {
                // F5类型图片，根据状态选择
                typeImageSource
          = status === '异常' ? Base64Img.F5ErrorBase64 : Base64Img.F5Base64
            } else {
                // 默认类型图片，根据状态选择
                typeImageSource
          = status === '异常'
                        ? Base64Img.topologyImageErrorBase64
                        : Base64Img.topologyImageBase64
            }

            // 类型图片 - 统一尺寸，居中显示
            const typeImage = group.addShape('image', {
                attrs: {
                    x: -size * 0.37,
                    y: -size * 0.5, // 恢复原始位置
                    width: size * 0.8, // 统一宽度为节点大小的80%
                    height: size * 0.7, // 统一高度为节点大小的80%
                    img: typeImageSource
                },
                name: 'type-image'
            })

            if (cfg.label) {
                group.addShape('text', {
                    attrs: {
                        x: 0,
                        y: size / 2 + 5, // 恢复原始位置
                        textAlign: 'center',
                        textBaseline: 'top',
                        text: cfg.label,
                        fill: '#fff',
                        fontSize: 12
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
                    y: -size / 2, // 恢复原始位置
                    width: size,
                    height: totalHeight, // 包含标签的高度
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
            // 每条边设置3个锚点，总共12个锚点
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
            const labelHeight = 20 // 标签高度

            // 更新底座图片
            if (children[0]) {
                children[0].attr({
                    img:
            status === '异常'
                ? Base64Img.abbaseImagelBase64
                : Base64Img.baseImageBase64,
                    y: -nodeSize / 2 // 恢复原始位置
                })
            }

            // 更新类型图片
            if (children[1]) {
                let typeImageSource
                if (source === '防火墙') {
                    typeImageSource
            = status === '异常'
                            ? Base64Img.firewallErrorBase64
                            : Base64Img.firewallBase64
                } else if (source === '负载均衡器' || source === 'ESB集群信息') {
                    typeImageSource
            = status === '异常' ? Base64Img.F5ErrorBase64 : Base64Img.F5Base64
                } else {
                    typeImageSource
            = status === '异常'
                            ? Base64Img.topologyImageErrorBase64
                            : Base64Img.topologyImageBase64
                }
                children[1].attr({
                    img: typeImageSource,
                    width: nodeSize * 0.8,
                    height: nodeSize * 0.7,
                    x: -nodeSize * 0.37,
                    y: -nodeSize * 0.5 // 恢复原始位置
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
                    y: nodeSize / 2 + 5 // 恢复原始位置
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
                    y: -nodeSize / 2 // 恢复原始位置
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
            const { startPoint, endPoint } = cfg
            const offset = cfg.style && cfg.style.offset ? cfg.style.offset : 0

            // 创建折线路径
            const path = this.createPath(startPoint, endPoint, offset, cfg)

            // 创建主线（实线）
            const mainLine = group.addShape('path', {
                attrs: {
                    path: path,
                    stroke: '#264d85',
                    lineWidth: 2
                },
                name: 'main-path-shape'
            })

            return mainLine
        },

        afterDraw (cfg, group) {
            const { startPoint, endPoint } = cfg
            const offset = cfg.style && cfg.style.offset ? cfg.style.offset : 0

            // 创建折线路径
            const path = this.createPath(startPoint, endPoint, offset, cfg)

            // 创建带渐变的流动效果线
            const flowLine = group.addShape('path', {
                attrs: {
                    path: path,
                    // 亮蓝色到透明的渐变
                    stroke:
            'l(0) 0:rgba(0,191,255,0.1) 0.3:rgba(0,191,255,0.5) 0.7:rgba(0,191,255,0.8) 1:rgba(0,191,255,1)',
                    lineWidth: 2,
                    lineDash: [10, 10],
                    lineDashOffset: 0
                },
                name: 'flow-path-shape'
            })

            // 在 afterDraw 中替换动画部分
            setTimeout(() => {
                if (flowLine && flowLine.animate) {
                    // 简单的属性动画
                    flowLine.animate([{ lineDashOffset: 0 }, { lineDashOffset: -20 }], {
                        duration: 1000,
                        iterations: Infinity
                    })
                }
            }, 100)
        },

        update (cfg, edge) {
            const group = edge.getContainer()
            const children = group.get('children')
            const { startPoint, endPoint } = cfg
            const offset = cfg.style && cfg.style.offset ? cfg.style.offset : 0

            // 创建折线路径
            const path = this.createPath(startPoint, endPoint, offset, cfg)

            // 更新所有子形状
            if (children) {
                children.forEach((child) => {
                    if (child.attr) {
                        child.attr({
                            path: path
                        })
                    }
                })
            }

            // 查找并重新启动流动动画
            const flowLines = children.filter(
                (child) => child.get('name') === 'flow-path-shape'
            )

            flowLines.forEach((flowLine) => {
                if (flowLine && flowLine.animate) {
                    // 停止现有动画
                    if (flowLine.stopAnimate) {
                        flowLine.stopAnimate()
                    }

                    // 重新启动动画
                    setTimeout(() => {
                        try {
                            flowLine.animate(
                                {
                                    lineDashOffset: -20
                                },
                                {
                                    duration: 1000,
                                    repeat: true
                                }
                            )
                        } catch (e) {
                            console.warn('Animation update failed:', e.message)
                        }
                    }, 50)
                }
            })
        },
        
        /**
 * 创建折线路径（只有一个直角）
 * @param {Object} start - 起点坐标
 * @param {Object} end - 终点坐标
 * @param {Number} offset - 偏移量
 * @param {Object} cfg - 边的配置信息
 * @returns {Array} 路径数组
 */
        createPath (start, end, offset, cfg) {
            const startX = start.x
            const startY = start.y
            const endX = end.x
            const endY = end.y

            // 创建只有一个直角的折线路径
            let path

            // 判断主要方向来决定如何创建折线
            const dx = Math.abs(startX - endX)
            const dy = Math.abs(startY - endY)

            if (dx > dy) {
                // 水平距离更大，先水平移动再垂直移动
                // 应用垂直偏移量确保平行边分离
                const offsetY = offset || 0
        
                path = [
                    ['M', startX, startY],
                    ['L', endX, startY + offsetY],
                    ['L', endX, endY]
                ]
            } else {
                // 垂直距离更大，先垂直移动再水平移动
                // 应用水平偏移量确保平行边分离
                const offsetX = offset || 0
        
                path = [
                    ['M', startX, startY],
                    ['L', startX + offsetX, endY],
                    ['L', endX, endY]
                ]
            }

            return path
        }
    },
    'polyline' // 使用polyline作为基类
)
// 注册自定义 combo
G6.registerCombo(
    'custom-combo',
    {
        draw (cfg, group) {
            const comboStatus = cfg.comboStatus || 'normal'
            
            // 根据 combo 状态设置边框颜色和背景色
            let borderColor = '#5fc7ff' // 默认正常状态颜色
            let bgColor = '#2d5fa1' // 默认背景颜色
            if (comboStatus === 'abnormal') {
                borderColor = '#ff4d4f' // 异常状态红色
                bgColor = 'transparent' // 异常状态保持透明背景
            }
            
            // 获取节点信息来计算combo尺寸
            const nodeSize = 80 // 节点大小
            const nodeSpacing = 20 // 节点间距
            const padding = 20 // combo内边距
            const labelHeight = 20 // 节点标签高度
            
            // 计算每行可以放置的节点数量和行数
            const nodesPerRow = 4 // 每行4个节点
            const nodesCount = cfg.nodes ? cfg.nodes.length : 0
            const rows = Math.ceil(nodesCount / nodesPerRow) || 1 // 至少1行
            
            // 计算combo尺寸，包含节点标签空间
            const comboWidth = nodesPerRow * nodeSize + (nodesPerRow - 1) * nodeSpacing + 2 * padding
            const comboHeight = rows * (nodeSize + nodeSpacing + labelHeight) - nodeSpacing + 2 * padding + 50 // 额外50px用于combo标题
            
            // combo位置居中
            const x = -comboWidth / 2
            const y = -comboHeight / 2
            
            // 添加背景矩形
            const bgRect = group.addShape('rect', {
                attrs: {
                    x: x,
                    y: y,
                    width: comboWidth,
                    height: comboHeight,
                    fill: bgColor,
                    opacity: 0.2, // 设置透明度使背景不会过于显眼
                    radius: 8
                },
                name: 'combo-background'
            })
            
            const keyShape = group.addShape('rect', {
                attrs: {
                    x: x,
                    y: y,
                    width: comboWidth,
                    height: comboHeight,
                    stroke: borderColor,
                    lineWidth: 2,
                    radius: 8,
                    fill: 'transparent'
                },
                name: 'combo-keyShape'
            })
            
            // 添加 combo 标签在边框内部的左上角
            if (cfg.label) {
                group.addShape('text', {
                    attrs: {
                        x: x + 10, // 边框内左边距10px
                        y: y + 20, // 边框内顶部边距20px
                        textAlign: 'left',
                        textBaseline: 'middle',
                        text: cfg.label,
                        fill: borderColor,
                        fontSize: 14,
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
                    lineWidth: 2,
                    fill: 'transparent',
                    stroke: '#5fc7ff',
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
            let borderColor = '#5fc7ff' // 默认正常状态颜色
            let bgColor = '#2d5fa1' // 默认背景颜色
            if (comboStatus === 'abnormal') {
                borderColor = '#ff4d4f' // 异常状态红色
                bgColor = '#2d5fa1' // 异常状态保持透明背景
            }
            
            // 更新背景矩形（第一个子元素）
            if (children[0] && children[0].get('name') === 'combo-background') {
                children[0].attr({
                    fill: bgColor,
                    opacity: 0.2
                })
            }
            
            // 更新边框矩形（第二个子元素）
            if (children[1] && children[1].get('name') === 'combo-keyShape') {
                children[1].attr({
                    stroke: borderColor
                })
            }
            
            // 更新标签（第三个子元素）
            if (children[2] && children[2].get('name') === 'combo-label') {
                children[2].attr({
                    fill: borderColor
                })
            }
        },
        
        // 设置锚点
        getAnchorPoints () {
            return [
                [0, 0.5], // 左侧中间
                [1, 0.5], // 右侧中间
                [0.5, 0], // 上侧中间
                [0.5, 1] // 下侧中间
            ]
        }
    },
    'rect'
)
