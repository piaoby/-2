# 自定义组件开发框架说明
## 框架目录
```
|-- custom-component
    |-- .babelrc
    |-- .eslintignore
    |-- .eslintrc.js
    |-- gulpfile.js
    |-- index.html             
    |-- package-lock.json
    |-- package.json
    |-- README.md               开发说明
    |-- webpack.config.js       开发环境配置
    |-- build                   组件打包配置文件
    |   |-- file-zip.js
    |   |-- rollup.config.js
    |-- dist                    组件打包产物
    |   |-- config.json         
    |   |-- index.js            
    |-- lib                     组件开发目录
    |   |-- config.json         组件配置项文件
    |   |-- index.js            组件模板渲染入口
    |   |-- index.vue           组件模板开发入口
    |   |-- assets              组件静态资源
    |       |-- img
    |-- src                     本地开发预览环境
        |-- App.vue
        |-- index.js
```
## 本地开发
安装第三方依赖，启动本地环境进行开发。
``` shell
npm install
npm run dev
```

## 组件构建
组件构建完后，将在根目录下生成dist文件夹，包含组件渲染文件、组件配置项文件等。构建成功后，才可进行组件压缩上传使用。
``` shell
npm run build
```

## 组件压缩上传
组件构建完后，执行组件压缩指令。根目录下生成文件 custom-component.zip，可直接将压缩包上传至数字化运营中心使用。
``` shell
npm run zip
```

## 组件开发说明
### 组件开发
进入目录 ./lib
- index.js文件为自定义组件类的构建，不可修改，不可删除
- index.vue 组件开发入口，可在该文件进行开发
```
// index.vue 内置配置说明, 内置配置不可删除

// 内置变量
export default {
    .....
    data() {
        return {
            /** 默认数据，不可删除 */
            id: '', // 组件唯一id标识
            configKv: {}, // 组件样式键值对
            ......
        }
    }
}

// 内置函数
export default {
    .....
    methods: {
        /** 组件初始化时触发 */
        init() {
        },
        /** 组件大小变更时触发 */
        resize() {
        },
        /** 组件配置项变更时触发, 返回键值如 legend$color */
        setStyle(k, v) {
            const keyList = k.split('$')
            if (keyList.length > 1) {
                this.configKv[keyList[0]][keyList[1]] = v
            } else {
                this.configKv[keyList[0]] = v
            }
        },
        /** 组件数据变更时触发 */
        setData(data) {
        },
        /** 组件销毁时触发 */
        destroy() {
        }
    }
}

```
### 组件配置项开发
进入 ./lib/config.json 进行配置项编辑，文件包含以下字段：
- name 组件名称
- code 组件标志
- default_size_posi 组件默认大小、位置
- default_config 组件默认样式配置
- default_static_data 组件默认数据

#### default_config 组件默认样式配置说明：
包含以下字段：
- key 配置项键值
- desc 配置项展示名称
- value 配置项值
- children 配置项子集
- show_type 配置项类型
- options 其他配置
```
// 目前配置项支持最多一层嵌套

// 未嵌套
{
    "key": "title", 
    "desc": "标题文本", 
    "value": "XX大屏", 
    "show_type": "text_input"
}

// 嵌套一层
{
    "key": "legend",
    "desc": "图例",
    "children": [
        {
            "key": "fontSize", 
            "desc": "文字大小", 
            "value": 12, 
            "show_type": "font_size_select"
        }，
        {
            "key": "type",
            "desc": "线条类型", 
            "value": "solid", 
            "options": [
                {
                    "value": "solid", 
                    "text": "实线"
                },
                { 
                    "value": "dashed", 
                    "text": "虚线"
                }
            ],
            "show_type": "select_input"
        }
    ]
}


```
#### 样式配置show_type参考
| 类型 | 说明 | 值类型 | 参考值 | options |
|------|------|------|------|------|
| bool_input | switch开关 | boolean | true/false | -- |
| font_size_select | 字体大小 | number | 24 | -- |
| color_input_new | 颜色选择 | string | 'rgba(255, 255, 255, 0.65)' | -- |
| number | 数值输入框 | number | 24 | {"unit": "%"}, 单位配置，可不写 |
| text_input | 文本输入框 | string | 'string' | -- |
| number_input | 滑动输入条 | number | 0-100间的数值 | -- |
| select_input | 下拉选择 | any | "demoValue" | [{"value": "demoValue", "text": "demo"}]
| radio_group | 单选框 | any | "demoValue" | [{"value": "demoValue", "text": "demo"}]



### 本地开发调试
文件 ./src/App.vue模拟大屏主程序的组件使用方式，可到该文件进行调试。

进入 ./src/App.vue, 引入lib/index.js 或 dist/index.js 进行调试
```javascript
<script>
    import CustomComponent from '../lib'
    // import CustomComponent from '../dist/index'

    export default {
        name: 'App',
        data () {
            return {
                container: null,
                com: null
            }
        },
        mounted () {
            this.com = new CustomComponent()
            // 初始化
            this.com.init(this.$refs.container, {
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
            })
            // 组件大小变更
            this.com.resize()
            // 组件样式变更
            this.com.setStyle('legend$color', '#ccc')
            // 组件数据变更
            this.com.setData([
                {
                    value: 20,
                    name: '系列一'
                },
                {
                    value: 60,
                    name: '系列二'
                },
                {
                    value: 30,
                    name: '系列三'
                }
            ])
        }
    }
</script>
```

