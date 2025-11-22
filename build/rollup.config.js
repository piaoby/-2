// 提供babel能力
import { babel } from '@rollup/plugin-babel'
// 解析 node_modules 中的模块，帮助 Rollup 查找外部模块，然后导入
import nodeResolve from '@rollup/plugin-node-resolve'
// 将CommonJS模块转换为 ES2015 供 Rollup 处理
import commonjs from '@rollup/plugin-commonjs'
// vue SFC单文件组件处理
import vue from 'rollup-plugin-vue'
// 代码压缩，除屑优化
import { terser } from 'rollup-plugin-terser'
// 拷贝静态资源
import copy from 'rollup-plugin-copy'
// 处理图片资源
import image from '@rollup/plugin-image'
// 处理css
import autoprefixer from 'autoprefixer'
import url from 'postcss-url'
import atImport from 'postcss-import'
import replace from '@rollup/plugin-replace'

module.exports = [
    {
        input: 'lib/index.js',
        output: {
            file: 'dist/index.js',
            format: 'es',
            name: 'doc-component'
        },
        plugins: [
            vue({
                css: true,
                compileTemplate: true,
                style: {
                    postcssPlugins: [
                        autoprefixer(),
                        url({
                            url: 'inline'
                        }),
                        atImport()
                    ]
                }
            }),
            nodeResolve(),
            commonjs(),
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            babel(),
            image(),
            terser(),
            copy({
                targets: [
                    {
                        src: 'lib/config.json',
                        dest: 'dist'
                    }
                ]
            })
        ]
    }
]
