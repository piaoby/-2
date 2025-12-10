<template>
    <div id="panel">
        <div ref="container" id="com-container"></div>
    </div>
</template>
<script>
    import CustomComponent from '../lib'
    import '../lib/customNode.js' // 导入自定义节点定义文件

    export default {
        name: 'App',
        data () {
            return {
                container: null,
                com: null,
                tabRawData: {}
            }
        },
        mounted () {
            // const newObject = Object.fromEntries(
            //   Object.entries(this.tabRawData).map(([key, value]) => [`"${key}"`, value])
            // );
            // console.log(JSON.stringify(newObject), "newObject");
            this.tabRawData = require('../lib/rowData.json')

            this.com = new CustomComponent()
            this.com.init(
                this.$refs.container,
                {
                    legend: {
                        fontSize: 12,
                        color: '#fff'
                    },
                    label: {
                        show: false,
                        color: '#ffffff',
                        fontSize: 14,
                        lineColor: 'rgba(255, 255, 255, 0.45)'
                    }
                } // 在组件初始化后执行反缩放
            )
            this.com.resize()
            this.com.setStyle('legend$color', '#ccc')
            this.com.setData(this.tabRawData)

            // setTimeout(() => {
            //     // this.com.reverseScale()
            //     this.com.setData(this.tabRawData)
            // }, 5000)
        },
        methods: {}
    }
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
