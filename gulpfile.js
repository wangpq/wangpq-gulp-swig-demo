// gulpfile.js
// Load plugins
var gulp = require('gulp')
  , rename = require('gulp-rename')
  , gutil = require('gulp-util')
  , plumber = require('gulp-plumber')
  , swig = require('gulp-swig')
  , connect = require('gulp-connect-multi')()
  , less = require('gulp-less')
  , sass = require('gulp-sass')
  , LessAutoprefix = require('less-plugin-autoprefix')
  , cleanCss =require('gulp-clean-css')
  , rimraf = require('gulp-rimraf')
  , uglify =require('gulp-uglify')
  , autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] })
  , gulpAutoPrefixer = require('gulp-autoprefixer')
  , concat = require('gulp-concat')
  , gulpReplaceHtml=require('gulp-html-replace')
  , rev = require('gulp-rev')
  , revCollector = require('gulp-rev-collector');

// 基本配置参数
var config = {
    // 本地web服务器
    "connect" : {
        // 服务器根目录
        "root" : ['./src/'],
        // 服务器端口
        "port" : 8080,
        // 自动刷新
        "livereload" : true
    },
    "css" :{
        "path" : {
            "src" : "src/css/",
            "dest" : "dest/css/"
        }
    },
    less : {
        "path" : {
            "src" : "src/less/",
            "dest" : "src/css/"
        }
    },
    sass : {
        "path" : {
            "src" : "src/sass/",
            "dest" : "src/css/"
        }
    },
    html : {
        "path" : {
            "src" : "src/html/",
            "dest" : "dest/html/"
        }
    },
    tpl : {
        "path" : {
            "src" : "src/tpl/",
            "dest" : "dest/tpl/"
        }
    },
    js : {
        "path" : {
            "src" : "src/js/",
            "dest" : "dest/js/"
        }
    },
    img : {
        "path" : {
            "src" : "src/images/",
            "dest" : "dest/images/"
        }
    },
    rev : {
        "path" : {
            "css" : "rev/css/",
            "js" : "rev/js/",
            "html" : "rev/html/",
            "tpl" : "rev/tpl/",
            "images" : "rev/images/",
            "cssJson" : "rev/root/css/",
            "jsJson" : "rev/root/js/",
            "root" : "rev/root/"
        }
    }
};

// 辅助函数
var helper={
    // 自动给元素或者数组中的元素补全路径
    addPathToNodes : function(path,nodes){
        if(nodes instanceof Array){
            var arr=[];
            for(var i=0,l=nodes.length;i<l;i++){
                arr.push(path+nodes[i])
            }
            return arr;
        }else{
            return path+nodes;
        }
    },
    // 将元素或者数组中的元素作为函数参数并执行函数
    doNodesFn : function(nodes,fullPath,fn){
        if(nodes instanceof Array){
            for(var i=0,l=nodes.length;i<l;i++){
                fn(nodes[i],fullPath);
            }
        }else{
            fn(nodes,fullPath);
        }
    }
}

/*!
 * 项目CSS和JS合并压缩配置(需要自己根据项目配置)
 * value : 需要合并处理的文件
 * name  : 合并后的文件名
 */
var tasks={
    /**
     * 合并文件配置,默认带压缩功能
     */
    cat : {
		css : {
            fullPath : false,
			group : [
				{
					value : ['reset.css','gmprdui.css','product.css'],
					name : "style"
				}
			]
		},
		js : {
            /*
            fullPath : false,
			group : [
				{
					value : ['jquery/jquery.js','widget/gload.js','widget/gfixed.js','widget/gtabs.js'],
                    name : "widget"
				},
				{
					value : ['app/app.js'],
					name : "app"
				}
			]
            */
            fullPath : true,
			group : [
				{
					value : ['src/js/**/*.js','!src/js/**/{app,demo}.js'],
                    name : "widget"
				},
				{
					value : ['src/js/app/app.js'],
					name : "app"
				}
			]
		}
	},
	/**
	 *替换HTML中指定的CSS和JS
	 *注意key和HTML中书写的名称对应,value和合并cat.group.name对应
	 */
    replace :{
        'css': '../css/style.min.css',
        'widget' : '../js/widget.min.js',
        'app': '../js/app.min.js'
    }
}

// 启动本地web服务器
gulp.task('connect', connect.server({
	root : config.connect.root,
	port : config.connect.port,
	livereload : config.connect.livereload
}));

// less转css并自动重启本地web服务器
gulp.task('less', function () {
    gulp.src(config.less.path.src+'**/*.less')
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(gulp.dest(config.less.path.dest))
        .pipe(connect.reload());
});

// sass转css并自动重启本地web服务器
gulp.task('sass', function () {
    gulp.src(config.sass.path.src+'**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.sass.path.dest))
        .pipe(connect.reload());
});

// CSS改变自动重启本地web服务器页面
gulp.task('style', function () {
    gulp.src(config.css.path.src+'**/*.css')
        .pipe(connect.reload());

    gulp.src(config.html.path.src+'**/*.html')
        .pipe(connect.reload());

});

// JS改变自动重启本地web服务器
gulp.task('javascript', function () {
    gulp.src(config.js.path.src+'**/*.js')
        .pipe(connect.reload());

});

// tpl改变自动转化为html到html文件夹并重启本地web服务器
gulp.task('tpl', function() {
	gulp.src(config.tpl.path.src +  '**/*.html')
	.pipe(plumber())
    .pipe(swig({
        load_json: true,
        defaults: { cache: false },
        json_path: 'src/data/',
        data: {
            message: "Welcome"
        }
    }))
	//.pipe(rename({
		//extname:".html"
	//}))
	.pipe(gulp.dest(config.html.path.src));
});

// html改变,自动重启本地web服务器
gulp.task('html', function() {
	gulp.src(config.html.path.src + '**/*.html')
		.pipe(connect.reload());
});

// 给CSS自动补全前缀
gulp.task('prefixerCss', function(){
    gulp.src(config.css.path.src+'**/*.css')
        .pipe(gulpAutoPrefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(config.css.path.dest))
});

// CSS自动补全前缀并压缩到目标文件夹
gulp.task('cleanCss', function() {
    //先删除dest中的css，有时候会不更新
    gulp.src(config.css.path.dest+'**/*.css')
        .pipe(rimraf({force: true}));
    gulp.src(config.css.path.src+'**/*.css')
        .pipe(gulpAutoPrefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        //.pipe(rename({suffix: '.min'}))
        .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(config.css.path.dest))
});

// CSS自动补全前缀并合并为指定文件名压缩到目标文件夹
gulp.task('concatMinCss', function() {
    var fn=function(node,fullPath){
       //先删除dest中的css，有时候会不更新
        gulp.src(config.css.path.dest+node.name+'.min.css')
            .pipe(rimraf({force: true}));
        var srcValue=fullPath ? node.value : helper.addPathToNodes(config.css.path.src,node.value);
        gulp.src(srcValue)
            .pipe(gulpAutoPrefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(concat(node.name+'.css'))
            .pipe(rename({suffix: '.min'}))
            .pipe(cleanCss({compatibility: 'ie8'}))
            .pipe(gulp.dest(config.css.path.dest))
    }
    helper.doNodesFn(tasks.cat.css.group,tasks.cat.css.fullPath,fn);
});

// JS合并为指定文件名压缩到目标文件夹
gulp.task('concatMinJs', function() {
    var fn=function(node,fullPath){
        //先删除dest中的js，有时候会不更新
        gulp.src(config.js.path.dest+node.name+'.min.js')
            .pipe(rimraf({force: true}));
        var srcValue=fullPath ? node.value : helper.addPathToNodes(config.js.path.src,node.value);
        gulp.src(srcValue)
            .pipe(concat(node.name+'.js'))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify({
                mangle: true,//类型：Boolean 默认：true 是否修改变量名
                compress: false,//类型：Boolean 默认：true 是否完全压缩
                preserveComments: 'license' //保留所有注释
            }))
            .pipe(gulp.dest(config.js.path.dest))
    }
    helper.doNodesFn(tasks.cat.js.group,tasks.cat.js.fullPath,fn);
});

// 压缩JS文件到目标文件夹
gulp.task('uglifyJs', function() {
    //先删除dest中的Js，有时候会不更新
    gulp.src(config.js.path.dest)
        .pipe(rimraf({force: true}));

    gulp.src(config.js.path.src+'**/*.js')
        //.pipe(rename({suffix: '.min'}))
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: false,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'license' //保留所有注释
         }))
        .pipe(gulp.dest(config.js.path.dest))
})

// 拷贝JS文件到目标文件夹
gulp.task('copyJs', function() {
    //先删除dest中的Js，有时候会不更新
    gulp.src(config.js.path.dest)
        .pipe(rimraf({force: true}));
    gulp.src(config.js.path.src+'**/*.js')
        .pipe(gulp.dest(config.js.path.dest))
})


// 拷贝HTML文件
gulp.task('copyHtml', function() {
    gulp.src(config.html.path.dest)
        .pipe(rimraf({force: true}));
    gulp.src(config.html.path.src+'**/*.html')
        .pipe(gulp.dest(config.html.path.dest))
})


// 替换HTML文件中的CSS和JS并输出到指定位置
gulp.task('gulpReplaceHtml', function() {
  gulp.src(config.html.path.dest+'**/*.html')
        .pipe(rimraf({force: true}));
  gulp.src(config.html.path.src+'**/*.html')
    .pipe(gulpReplaceHtml(tasks.replace))
    .pipe(gulp.dest(config.html.path.dest));
})


// 拷贝模板文件
gulp.task('copyTpl', function() {
    gulp.src(config.tpl.path.dest)
        .pipe(rimraf({force: true}));
    gulp.src(config.tpl.path.dest+'**/*.vm')
        .pipe(gulp.dest(config.tpl.path.dest))
})

// copyImages
gulp.task('copyImages', function(){
    gulp.src(config.img.path.src+'**/*.{jpg,png,gif}')
        .pipe(gulp.dest(config.img.path.dest))
});


gulp.task('revCss', function(){   
    gulp.src(config.css.path.dest+'**/*.css')        
        .pipe(rev())     
        .pipe(gulp.dest(config.rev.path.css))   
        .pipe(rev.manifest())        
        .pipe(gulp.dest(config.rev.path.cssJson));
});

gulp.task('revJs', function(){    
    gulp.src(config.js.path.dest+'**/*.js')        
        .pipe(rev())     
        .pipe(gulp.dest(config.rev.path.js))       
        .pipe(rev.manifest())        
        .pipe(gulp.dest(config.rev.path.jsJson));
});


gulp.task('revHtml', function () {    
    gulp.src([config.rev.path.root+'**/*.json', config.html.path.dest+"**/*.html"])  
        .pipe(revCollector({replaceReved: false}))        
        .pipe(gulp.dest(config.rev.path.html));  
});


gulp.task('revCssJs', ['revCss','revJs']);


// 监测改动的文件并自动重启刷新
gulp.task('watch', function() {
    gulp.watch([config.sass.path.src+'**/*.scss'], ['sass']);
    gulp.watch([config.less.path.src+'**/*.less'], ['less']);
    gulp.watch([config.css.path.src+'**/*.css'], ['style']);
    gulp.watch([config.tpl.path.src + '**/*.html'], ['tpl']);
    gulp.watch([config.html.path.src + '**/*.html'], ['html']);
    gulp.watch([config.js.path.src+'**/*.js'], ['javascript']);
});

// dev
gulp.task('default', ['connect','watch']);

// uat
gulp.task('uat', ['copyImages','copyHtml','copyTpl','cleanCss','uglifyJs']);

// live
gulp.task('live', ['copyImages','gulpReplaceHtml','concatMinCss','concatMinJs']);

