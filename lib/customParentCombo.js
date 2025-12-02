// customParentCombo.js
import G6 from '@antv/g6'

G6.registerCombo('custom-parent-combo', {
    draw (cfg, group) {
        // 使用实际计算的尺寸
        const width = cfg.width || 600
        const height = cfg.height || 400
        const x = -width / 2
        const y = -height / 2

        let borderColor = '#5fc7ff'
        const borderWidth = 2
        const titleHeight = 50 // 标题区域高度
        let fillColor = '#92ebff'
        // 根据不同的父combo设置不同的背景色
        let backgroundColor = '#2d5fa1' // 默认背景色
        if (cfg.comboStatus === 'idle') {
            backgroundColor = '#92ffca' // 灾备中心背景色
            borderColor = '#92ffca'
            fillColor = '#92ffca'
        }

        // 绘制带边框的背景矩形
        const rect = group.addShape('rect', {
            attrs: {
                x,
                y,
                width,
                height,
                fill: backgroundColor, // 背景色
                opacity: 0.2, // 20% 透明度
                stroke: borderColor, // 边框颜色
                lineWidth: borderWidth, // 边框宽度
                radius: 8 // 圆角
            },
            name: 'parent-combo-border'
        })

        // 添加标签（居中显示在顶部标题区域内）
        if (cfg.label) {
            group.addShape('text', {
                attrs: {
                    x: x + 80, // 水平居中
                    y: y - 50, // 垂直居中于标题区域
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: cfg.label,
                    fill: fillColor,
                    fontSize: 40,
                    fontWeight: 'bold'
                },
                name: 'parent-combo-label'
            })
        }

        return rect
    },

    getAnchorPoints () {
        // 修改锚点以支持垂直布局
        return [
            [0, 0.5] // 左侧中心
            // [0.5, 1] // 下方中心
        ]
    }
})
