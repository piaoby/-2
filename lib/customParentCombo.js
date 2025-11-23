// customParentCombo.js
import G6 from '@antv/g6'

G6.registerCombo('custom-parent-combo', {
    draw (cfg, group) {
        // 使用实际计算的尺寸
        const width = cfg.width || 600
        const height = cfg.height || 400
        const x = -width / 2
        const y = -height / 2

        const borderColor = '#5fc7ff'
        const borderWidth = 2

        // 绘制带边框的背景矩形
        const rect = group.addShape('rect', {
            attrs: {
                x,
                y,
                width,
                height,
                fill: 'transparent',
                stroke: borderColor,
                lineWidth: borderWidth,
                radius: 8
            },
            name: 'parent-combo-border'
        })

        // 添加标签（居中显示在顶部）
        if (cfg.label) {
            group.addShape('text', {
                attrs: {
                    x: 0, // 居中
                    y: y - 20, // 放在combo上方
                    textAlign: 'center',
                    textBaseline: 'bottom',
                    text: cfg.label,
                    fill: borderColor,
                    fontSize: 40,
                    fontWeight: 'bold'
                },
                name: 'parent-combo-label'
            })
        }

        return rect
    },

    getAnchorPoints () {
        return [
            [0.5, 0], // 上
            [0.5, 1], // 下
            [0, 0.5], // 左
            [1, 0.5] // 右
        ]
    }
})
