/*!
 * [gmPrdApp 主体JS]
 * @type {Object}
 */
var gmPrdApp={
    gTabsFn : function(){
		if($('#fixtabox').hasClass("fixedtop")){
			$("html,body").animate({scrollTop:$("#gfixed").offset().top},100);
		}
	},
	dzTabsFn : function(){
	},
	appraisalPage : function(num){
		var tpl='';
		for(var i=0;i<10;i++){
			tpl=tpl+'<li style="height:100px;border-bottom:1px solid #ccc;">第'+num+'页第'+(i+1)+'条评论类容</li>';
		}
        $("#appraisalContent").html('<ul data-index="'+num+'">'+tpl+'</ul>');
	},
	jumpToAppTop : function(){
        $("body,html").animate({
            scrollTop: $("#appraisalContent").offset().top-36
        },80);
	}
}



$(".sidecategory").hover(function(){
	$(".sidecategory .dropDownMenu").toggle();
})


/** 商品详情描述 **/
$('#prdDesc').gLoad(function () {
	$('#prdDesc').gTabs({
		btnID:"#prd_tbox",
		boxID:"#prd_data",
		bind:'click',
		hEven: gmPrdApp.gTabsFn,
		hide:1
	});
	$("#fixtabox").gfixed({
		star:"#gfixed",
		target:"#fixtabox",
		fixed:"fixed-top"
	});
});