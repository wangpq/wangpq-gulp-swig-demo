/*!
 * --------------
 * gfixed js
 * --------------
 */
(function($){
	$.fn.gfixed = function(o) {
		var def = {
			star:"#g-dtspace",/*站位起始位置*/
			target:".j-dtfix",/*fixed目标*/
			fixed:"fixed",/*fixed class*/
			fixfn:null/* 执行事件 */
			};
		var o=$.extend(def,o),
			s = o.star,
			t = o.target,
			f = o.fixed,
			fn= o.fixfn;
		return this.each(function(){
			$(window).scroll(function(){
				var offtop = $(s).offset().top,
				wh = $(window).height(),
				removing = wh - offtop;
				var wofftop = $(window).scrollTop();
				if(wofftop >= offtop){
					$(t).addClass(f);
					if(fn)fn(true);
				}else{
					$(t).removeClass(f);
					if(fn)fn(false);
				};
			});
		});
	};
})(jQuery);