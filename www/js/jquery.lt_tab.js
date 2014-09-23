/**
 * jquery.lt_tab.js
 * jquery plugin
 * 导航菜单，用于切换内容区域，可左右滑动
 * date: 2014-01-08
 * author: kezhi
 */

;(function($){

	/**
	 * set li position
	 * liWidth 计算li宽度百分比
	 */
	function set_li_position(obj,opts){
		var liWidth = parseInt((obj.width() / opts.minItems ) * 100 ) / obj.width();

		$('li',obj).each(function(){
			$(this).css({
				width: liWidth + '%'
			});
		});

	}
	/**
	 * get url parameter
	 * parameter 接收URL后的参数值
	 */
	function getParameter(url){
		var parameter = "";
		if(url.lastIndexOf("?") > 0){
			parameter = url.substring(url.lastIndexOf("?") + 1,url.length);
		}

		return parameter;
	}

	/**
	 * get left value
	 */
	function getLeft(obj){
		return parseInt(obj.css('left'));
	}

	/**
	 * add_bottom_arrow
	 */
	function add_bottom_arrow(obj,opts){
		var liWidth = $('li',obj).width()+1;
		obj.liArrow = '<div class="cur_on" style="width: '+liWidth+'px"></div>';
		obj.parent().append(obj.liArrow);
	}


	/**
	 * bind li click event
	 */

	function add_li_click_event(obj,opts,_this){
		//var onURL = getParameter(document.URL);
		$('li', obj).eq(opts.onItem).children('a').addClass('on');
		var liWidth = $('li',obj).width();

		$('li', obj).on(opts.changeMode,function(){
			if( obj.currentIndex != $('li',obj).index($(this))){
				obj.currentIndex = $('li',obj).index($(this));
				//$('li span',obj).remove();
				$('li a',obj).removeClass('on');
				$(this).children('a').addClass('on');

				$('.cur_on').css({'transform':'translate('+obj.currentIndex*liWidth+'px)',transition: '200ms'});
				console.log(obj.currentIndex,liWidth);


				//add callback
				opts.callBack(obj.currentIndex);
			}
		});
	}

	/**
	 * touchstart start
	 */
	function tab_touchstart_event(obj,opts){
		obj.bind('touchstart',function(event){
			var touch = event.originalEvent.touches[0];

			obj.startLeft = getLeft(obj);
			obj.startX = touch.pageX;

			obj.css({
				'-webkit-transition-duration': '0'
			});

			obj.touchStartTime = new Date().getTime();
		});
	}

	/**
	 * touchmove start
	 */
	function tab_touchmove_event(obj,opts){
		obj.bind('touchmove',function(event){
			var touch = event.originalEvent.touches[0];
			obj.endX = touch.pageX;

			if (!obj.sliding) {
				obj.sliding = true;
			}

			if (obj.startX > obj.endX) {
				//向左滑动
				obj.css('left', '-' + (obj.startX - obj.endX - obj.startLeft) + 'px');
				obj.slidingLeft = true;
			} else {
				// 向右滑动
				var left = (obj.endX - obj.startX + obj.startLeft);
				obj.css('left', left + 'px');
				obj.slidingLeft = false;
			}
		});
	}

	/**
	 * touchend start
	 */
	function tab_touchend_event(obj,opts){
		obj.bind('touchend',function(event){
			var moveX = getLeft(obj);

			obj.columnWidth = $("li a",obj).width();
			obj.objWidth = $("li a",obj).length * obj.columnWidth;
			obj.parentWidth = obj.parent().width();
			if(obj.parentWidth > obj.objWidth) {
				doSlide(obj, 0, '0.5s');
				obj.startX = null;
			}

			if(moveX > 0){
				doSlide(obj, 0, '0.5s');
				obj.startX = null;
			}else if((Math.abs(moveX) + obj.parentWidth) > obj.objWidth){
				doSlide(obj, '-' + (obj.objWidth - obj.parentWidth), '0.5s');
				obj.startX = null;
			}else{
				//slideTimer(obj, event);
				doSlide(obj, 0, '0.5s');
				obj.startX = null;
			}

			//$('.panel_header').html(moveX + ',' + obj.objWidth + ',' + obj.parentWidth);
		});
	}

	/**
	 * doSlide
	 */
	function doSlide(obj, scrollX, duration){
		obj.css({
			left: scrollX + 'px',
			'-webkit-transition-property': 'left',
			'-webkit-transition-duration': duration
		});
	}

	function slideTimer(obj){
		//end的时间减去start的时间
		var slideAdjust = (new Date().getTime() - obj.touchStartTime) * 10;
		var left = getLeft(obj);

		//计算滑动速度
		var changeX = 6000 * (Math.abs(obj.startLeft) - Math.abs(left));
		slideAdjust = Math.round(changeX / slideAdjust);
		var newLeft = slideAdjust + left;
		//var t = newLeft % obj.columnWidth;

		// 如果超过半个的宽度就走一个的宽度
//		if ((Math.abs(t)) > ((obj.columnWidth / 2))) {
//			newLeft -= (obj.columnWidth - Math.abs(t));
//		} else {
//			newLeft -= t;
//		}

		if (obj.slidingLeft) {
			var maxLeft = parseInt('-' + (obj.objWidth - obj.parentWidth), 10);
			// 向左滑动
			doSlide(obj, Math.max(maxLeft, newLeft), '0.8s');
		} else {
			//向右滑动
			doSlide(obj, Math.min(0, newLeft), '0.8s');
		}

		obj.startX = null;
	}

/*	$.fn.refresh_tab_header = function(htmlText){
		var opts = $.extend({},$.fn.lt_tab.defaults,$(this).opts);

		return this.each(function(){
			var obj = $('.tab_header ul', $(this));
			$(obj).closest('.tab_header ul',$(this)).html(htmlText);

			// 设置li的位置
			set_li_position(obj,opts);

			//给li增加click事件，用于tab切换
			add_li_click_event(obj,opts);
		});
	}*/

	function initDataValue(obj){
		var currentIndex = $(obj).data('currentIndex',0);
		var startLeft = $(obj).data('startLeft',0);
		var startX = $(obj).data('startX',0);
		var endX = $(obj).data('endX',0);
	}

	$.fn.lt_tab = function(options){

		//将defaults 和 options 参数合并到{}
		var opts = $.extend({},$.fn.lt_tab.defaults,options);

		/**
		 * obj对象为当前调用该插件方法的对象。
		 * 而后面bind里面的clickIndex = $(".tab li", obj).index($(this));
		 * 意思就是obj对象下面的ul中的li元素索引index($(this))
		 * 这里的$(this)则是在li元素中找到当前li元素的索引。
		 */
		return this.each(function(){
			var obj = $('.tab_header ul', $(this));
			obj.opts = opts;
			var _this = $(this);

			var con

			//设置初始值
			initDataValue(obj);

			// 设置li的位置
			set_li_position(obj,opts);

			//给li增加click事件，用于tab切换
			add_li_click_event(obj,opts,_this);

			//tab滑动事件
			tab_touchstart_event(obj,opts);
			tab_touchmove_event(obj,opts);

			tab_touchend_event(obj,opts);

			add_bottom_arrow(obj);
		});
		// each end
	}

	/**
	 * 定义默认配置项
	 * minItems: li列的个数
	 * onItem: 定义默认选中项
	 */
	$.fn.lt_tab.defaults = {
		minItems: 3,
		onItem:0,
		changeMode : 'click',
		tabConPosition:$('.tab_item'),
		callBack: function(){
		}
	};

})(jQuery);
