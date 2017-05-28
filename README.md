# wangpq-gulp-swig-demo
一个简单的gulp-swig示例，使用了gulp-connect-multi自动检测html、css、js的改动并自动刷新，更多功能尚待完善。

怎样运行示例?

**首先确保全局安装了gulp**
```bash
npm install gulp -g
```

**下载依赖到本地**
```bash
npm install  
```

**在本地服务器运行**
```bash
gulp
```
然后打开浏览器，输入 http://localhost:8080 查看页面。

- - -

**Gulp自动添加版本号**

使用 gulp-rev + gulp-rev-collector 是比较方便的方法，结果如下:

```bash
"style.min.css" => "style-88795f4f15.min.css"
"app.min.js" => "app-5339a8b623.min.js",
"widget.min.js" => "widget-97d5000b1b.min.js"
```

用上面方法实现，每次更新都会积压过多过期无用的文件，我们预期效果是:

```bash
"style.min.css" => "style.min.css?v=88795f4f15"
"app.min.js" => "app.min.js?v=5339a8b623",
"widget.min.js" => "widget.min.js?v=97d5000b1b"
```

怎么办啊?改上面两个Gulp插件是最高效的方法了。

1.安装Gulp

```bash
npm install --save-dev gulp
npm install --save-dev gulp-rev 
npm install --save-dev gulp-rev-collector
```

2.打开 node_modules\gulp-rev\index.js

第144行 manifest[originalFile] = revisionedFile; 
更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;

3.打开 nodemodules\gulp-rev\nodemodules\rev-path\index.js

10行 return filename + '-' + hash + ext; 
更新为: return filename + ext;

4.打开 node_modules\gulp-rev-collector\index.js

40行  path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' ) 
更新为: path.basename(json[key]).split('?')[0] 

5.配置gulpfile.js, 可参考下面 gulpfile.js 代码

6.结果达到预期