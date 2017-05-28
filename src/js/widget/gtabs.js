/*!
 * Plugin name - gTabs
 * Version - v1.0
 * Updated - 2012-10-17
 * author - liuxiaofan
 * author's blog - http://liuxiaofan.com
 */
(function($) {
	$.fn.gTabs = function(opts) {
		var def = {
			btnID:".j-gTbtn",	/* 按钮的父级id */
			boxID:".j-gTbox",	/* 内容的父级id */
			bind: "hover",		/* 事件类型 可选参数 "click" */
			hdelay: 300,		/* tab延迟速度 */
			speed:400,			/* 滚动速度 */
			animated: 0, 		/* 动画效果 可选参数 "up" "left" "fadein" */
			auto:0,				/* 自动滚动的时间(毫秒) 0为不自动滚动 */
			gomesrc:1,			/* 0为不执行图片延迟加载 可选参数1为使用图片延迟加载*/
			hide:0,				/* 如果等于1则隐藏所有box只显示第1个 */
			hEven:null 			/* 移上去响应事件 */
		};
		var opts = $.extend(def, opts),
			evt = opts.bind,
			autospeed = opts.auto,
			anim = opts.animated,
			btn = this.find(opts.btnID),
			box = this.find(opts.boxID),
			boxheight = box.children().height(),
			boxwidth = box.children().width(),
			n = 0,timer,gTtimer;
		return this.each(function(i) {
			/* 各种初始化 */
		if(autospeed != 0) {box.eq(i).children().eq(0).clone().appendTo(box.eq(i));};
		if(anim == "left") {box.eq(i).css({	width: 99999 + "px"	})};
		if(opts.hide == 1) {box.eq(i).children().hide().eq(0).show();}
		/* gome-src 替换 初始化*/
		if(opts.gomesrc==1){
			box.eq(i).children().eq(0).find("img").each(function(){
				var p_=$(this).attr("gome-src");
				if(p_){
					this.src = p_;
					$(this).removeAttr("gome-src");
				}
			});
		};
			if(evt == "hover") {
				btn.eq(i).children().hover(function() {

					var this_=this;
					var k=-1;
					$(this).parent().children().each(function(i,o){
						if(this_==this){
							k=i;return false;
						}
					});
					//var k = $(this).index(),
					var h = k * boxheight,
						w = k * boxwidth;
					gTway = function() {
						/*gome-src替换*/
						if(opts.gomesrc==1){
							var hoverjudge = box.eq(i).children().eq(k).find("img").attr("gome-src");
							if(k > 0 && hoverjudge != undefined){
								box.eq(i).children().eq(k).find("img").each(function(){
								   this.src = $(this).attr("gome-src");
								   $(this).removeAttr("gome-src");
								});
							};
						};
						btn.eq(i).children().removeClass("cur").eq(k).addClass("cur");
						switch(anim) {
							case "up":box.eq(i).animate({"top": -h + "px"}, opts.speed); break;
							case "left":box.eq(i).animate({"left": -w + "px"}, opts.speed); break;
							case 0: box.eq(i).children().hide().eq(k).show(); break;
							case "fadein": box.eq(i).children().hide().eq(k).fadeIn();break;
						};
						if(opts.hEven!=null){opts.hEven();}
					};
					gTtimer = setTimeout(gTway, opts.hdelay);
					return false;
				}, function() {
					clearTimeout(gTtimer);
				});
			} else {
				btn.eq(i).children().bind(evt, function() {
					var this_=this;
					var k=-1;
					$(this).parent().children().each(function(i,o){
						if(this_==this){
							k=i;
							return false;
						}
					});
					//var k = $(this).index(),
					var	h = k * boxheight,
						w = k * boxwidth;
						/*gome-src替换*/
					if(opts.gomesrc==1){
						var hoverjudge = box.eq(i).children().eq(k).find("img").attr("gome-src");
						if(k > 0 && hoverjudge != undefined){
							box.eq(i).children().eq(k).find("img").each(function(){
							   this.src = $(this).attr("gome-src");
							   $(this).removeAttr("gome-src");
							});
						};
					};
					btn.eq(i).children().removeClass("cur").eq(k).addClass("cur");
					switch(anim) {
							case "up":box.eq(i).animate({"top": -h + "px"}, opts.speed); break;
							case "left":box.eq(i).animate({"left": -w + "px"}, opts.speed); break;
							case 0: box.eq(i).children().hide().eq(k).show(); break;
							case "fadein": box.eq(i).children().hide().eq(k).fadeIn();break;
						};
					if(opts.hEven!=null){opts.hEven();}
					return false;
				});
			};
			function autoroll() {
				 var total = btn.eq(i).children().length;
				if(n >= total+1) {
					btn.eq(i).children().removeClass("cur").eq(0).addClass("cur") ;
					box.eq(i).stop(true,false).css({left:"0px",top:"0px"});
					n = 1;
				};
				/*gome-src替换*/
				if(opts.gomesrc==1){
					var scrolljudge = box.eq(i).children().eq(n).find("img").attr("gome-src");
					if(n > 0 && scrolljudge != undefined){
						box.eq(i).children().eq(n).find("img").each(function(){
						   this.src = $(this).attr("gome-src");
						   $(this).removeAttr("gome-src");
						});
					};
				};
				var h = n * boxheight,
					w = n * boxwidth;
				btn.eq(i).children().removeClass("cur").eq(n).addClass("cur");
				switch(anim) {
							case "up":box.eq(i).stop(true,false).animate({"top":-h+"px"},opts.speed); break;
							case "left":box.eq(i).stop(true,false).animate({"left":-w+"px"},opts.speed);; break;
							case 0: box.eq(i).stop(true,false).children().hide().eq(n).show(); break;
							case "fadein": box.eq(i).stop(true,false).children().hide().eq(n).fadeIn();break;
						};
				if(n >= total){btn.eq(i).children().removeClass("cur").eq(0).addClass("cur"); };
				n++;
					timer = setTimeout(autoroll, autospeed);
					};
			function stoproll() {
				box.eq(i).children().hover(function() {
					clearTimeout(timer);
					n = $(this).prevAll().length+1;
				}
				, function() {
					timer = setTimeout(autoroll, autospeed);
				});
				btn.eq(i).children().hover(function() {
					clearTimeout(timer);
					n = $(this).prevAll().length+1;
				}
				, function() {
					timer = setTimeout(autoroll, autospeed);
				});
			};
			if(autospeed!=0){autoroll(); stoproll();}});
	};
})(jQuery);