const path = require('path');

import filesize from 'rollup-plugin-filesize'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'
import commonjs from '@rollup/plugin-commonjs'

const isProd = process.env.NODE_ENV === 'production'

export default {
  input: 'src/index.js',
  output: {
    file: isProd ? 'dist/DanmakuSender.min.js' : 'dist/DanmakuSender.js',
    format: 'umd',
    exports: 'default',
    name: 'DanmakuSender',
  },
  plugins: [
    resolve(),
    commonjs(),
    filesize(),
    json({
      compact: true
    }),
    babel({
      babelHelpers: 'runtime',
      include: [
        'src/**',
      ],
      exclude: [/node_modules\/(?!(query-string)\/).*/]
    }),
    (isProd && uglify())
  ]
}