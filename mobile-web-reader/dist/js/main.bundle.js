/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_normalize_css_normalize_css__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_normalize_css_normalize_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_normalize_css_normalize_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style_sass_base_scss__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style_sass_base_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__style_sass_base_scss__);


(function(){
	let $header = $('.header'),
		$footer = $('.footer'),
		$chapter_control = $('.chapter-control'),
		$container = $('.container'),
		$font_container = $('.font'),
		$header_items = $('header .item'),
		$footer_items = $('.footer-item'),
		$font_items = $('.font-item'),
		$chapter_items = $('.chapter'),
		$bg_colors = $('.bg-color'),
		$back = $('.header-back'),
		$header_info = $('header-info'),
		$mid_mask = $('.mask-mid'),
		$article = $('.article'),
		$article_list = $(".article_list"),
		$chapter_now =$('.chapter-now'),
		$chapter_total  = $('.chapter-total'),
		$mask_detail = $('.mask-detail'),
		$mask_cover = $('.mask-cover'),
		$mask_directory = $('.mask-directory'),
		$mask_img = $(".mask-detail img"),
		$mask_chapter_detail = $(".mask-detail .chapter"),
		$win = $(window);
	let _setting = {
		bgcolorId: 5,
		fontsize: "16px",
		time: 'day',
		books:{},
		colors: [{bgcolor:"#f7eee5",color:"black"},{bgcolor:"#e9dfc7",color:"black"},{bgcolor:"#a4a4a4",color:"black"},{bgcolor:"#cdefce",color:"black"},{bgcolor:"#283548",color:"#7685a2"},{bgcolor:"#0f1410",color:"#4e534f"}]
	}
	let caches = Object.assign({
		colorsId: 0,
		time: true,
		fontsize: "16px",
		chapter: 0,
		totalChapter: 300,
	},store.get("caches"));
	let downLoadDirectory = function(){
		return new Promise(function(resolve, reject){
			$.ajax({
				url: 'http://apis.juhe.cn/goodbook/catalog',
				dataType:"jsonp",
				cache: true,
				data: {key: 'd20700c02fcb0f7e044254e3401b350a'},
				success: function(sourceData) {
					if(sourceData.resultcode === "200"){
						resolve(sourceData.result);
					}else{
						reject(new Error('downLoadDirectory failed!'));
					}
				}
			})
		})
	}
	
	let addDataToHtml = function(result){
		let length = result.data.length,
			s="";
		for(var i = 0; i < length; i++){
			s +="<h2>"+result.data[i].title+"</h2>"+"<h4>"+result.data[i].sub1+"</h4>"+ "<p>"+result.data[i].sub2+"</p>";
		}
			s = "<li>"+ s + "</li>";
			return s;
	}

	
	let downLoadContent = function(start, end){
		let data = {	key: 'd20700c02fcb0f7e044254e3401b350a',
						catalog_id: "中国文学",
						pn: start,
						rn: end || 10
					};
		return new Promise(function(resolve, reject){
			$.ajax({
					url: "http://apis.juhe.cn/goodbook/query", 
					dataType:"jsonp",
					data: data,
					cache: true,
					success:function(sourceData) {
						console.log(sourceData);
						if(sourceData.resultcode === "200"){
							$mask_img[0].src = sourceData.result.data[0].img;
							$mask_chapter_detail.html("<p>"+sourceData.result.data[0].catalog+"</p>");
							resolve(sourceData.result);
						}else{
							reject("downLoadContent Error");
						}
					}
			});
		})
	}
	//从第 m 节开始下载数据, 下载 n 节, n默认10 
	let loadChapterFrom=function(m, n){
		//假定的章节范围
		if(m < 0|| n> 300){
			return;
		}
		downLoadContent(m).then(function(result){
			//成功则加载到html中
			$article_list.append(addDataToHtml(result));
		}, function(err){
			//失败
			console.log("addDataToHtml failed");
		})
	}
	let loadChapterClearHtml=function(m, n){
		//假定的章节范围
		if(m < 0|| n> 300){
			return;
		}
		downLoadContent(m).then(function(result){
			//成功则加载到html中
			$article_list.html(addDataToHtml(result));
		}, function(err){
			//失败
			console.log("addDataToHtml failed");
		})
	}
	//初始化时从 localstorage 加载 UI数据
	let renderUI = function(){
		$article.css({"backgroundColor":_setting.colors[caches.colorsId].bgcolor,
									"color":_setting.colors[caches.colorsId].color});
		$article.css("font-size",caches.fontsize);
		$bg_colors.eq(0).removeClass('checked');
		$bg_colors.eq(caches.colorsId).addClass('checked');
		$chapter_total.html(caches.chapter_total);
		$chapter_now.html(caches.chapter/10+1);
	}
	let mountEvent = function(){
		//header部分事件   返回 + 详细信息
		let hideBanner = function(){
			$header.hide();
			$footer.hide();
			$mask_detail.hide();
			$mask_directory.hide();
			$footer_items.eq(1).removeClass("fontsize_on")
		}
		let showBanner = function(){
			$font_container.hide();
			$header.show();
			$footer.show();
		}
		let banner = function() {
			$mid_mask.on('click', function(){
				if($header.is(':visible')){
					hideBanner();
				}else{
					showBanner();
				}
			})
		}
		//加载下一章
		let loadNextChapter = function(){
			if(caches.chapter>290){
				return;
			}else {
				caches.chapter += 10;
				loadChapterClearHtml(caches.chapter);
				store.set("caches",caches);
			}
			$win.scrollTop();
			$chapter_now.html(caches.chapter/10+1);
		}
		//加载上一章
		let loadPreviousChapter = function(){
			if(caches.chapter<10){
				return;
			}else {
				caches.chapter -= 10;
				loadChapterClearHtml(caches.chapter);
				store.set("caches",caches);
			}
			$win.scrollTop();
			$chapter_now.html(caches.chapter/10+1);
		}
		//章节选择部分 事件
		let changeChapter = function(target) {
			if(target === $chapter_items[1]){
				loadPreviousChapter();
				console.log('pre');
			}else {
				console.log('next');
				loadNextChapter();
			}
		}
		let chapterContainer = function(){
			$chapter_control.on('click', '.chapter', (e)=>{
				changeChapter(e.target);
			})
		}
		//字体大小调整
		let increaseFontSize = function(){
			let num = parseInt($article.css("font-size"));
			if(num < 20){
				$article.css("font-size",num + 1);
			}
			caches.fontsize = num + 1;
			store.set("caches",caches);
		}
		let decreaseFontSize = function(){
			let num = parseInt($article.css("font-size"));
			if(num >14 ){
				$article.css("fontSize",num - 1);
			}
			caches.fontsize = num - 1;
			store.set("caches",caches);
		}
		//字体颜色切换
		let switchToColor = function(target) {
			let length = $bg_colors.length;
			for(var i = 0;i < length; i++){
				if(target === $bg_colors[i]){
					break;
				}
			}
			$article.css({"backgroundColor":_setting.colors[i].bgcolor,
							"color":_setting.colors[i].color});
			$bg_colors.eq(caches.colorsId).removeClass('checked');
			$bg_colors.eq(i).addClass('checked');
			caches.colorsId = i;
			store.set("caches",caches);
		}
		//字体切换触发事件		
		let fontContainer = function(){
			$font_container.on('click', '.font-item', (e) => {
				let target = e.target;
				console.log("e.target", e.target);
				switch(true) {
					case e.target === $font_items[0]:
						increaseFontSize();
						break;
					case e.target === $font_items[1]:
						decreaseFontSize();
						break;
				}
			}).on('click', '.bg-color', (e) => {
				console.log(e.target)
				switchToColor(e.target);
			})
		}
		//底部主选项事件
		let directory = function(){

		}
		//显示字体大小,颜色切换控制面板
		let fontsize = function(){
			$footer_items.eq(1).toggleClass("fontsize_on");
			$font_container.toggle();
		}
		//白天夜晚切换
		let timeSwitch = function() {
			$footer_items.eq(2).toggleClass("time_on");
			if(!caches.time){
				$article.css({"backgroundColor":_setting.colors[caches.colorsId].bgcolor,
							"color":_setting.colors[caches.colorsId].color});
				caches.time = true;
			}else{
				$article.css({"backgroundColor":_setting.colors[5].bgcolor,
							"color":_setting.colors[5].color});
				caches.time = false;
			}
			store.set("caches",caches);
		}
		//底部主选项事件触发
		let footerItemContainer = function(){
			$container.on('click', '.footer-item', (e) => {
				let target = e.target;
				console.log("e.target", e.target);
				switch(true) {
					case target === $footer_items[0]:
						//directory();
						break;
					case target === $footer_items[1]:
						fontsize();
						break;
					case target === $footer_items[2]:
						timeSwitch();
						break;						
					case target===$footer_items[3]:
						// downLoad();
						break;						
				}
			})
		}
		let articleDetail = function(){
			$mask_detail.toggle();
		}
		//顶部事件触发
		let headerContainer = function(){
			$header.on('click', '.item' ,(e)=> {
				let target = e.target;
				console.log("e.target", e.target);
				switch(true) {
					case target === $header_items[0]:
					case target === $header_items[1]:
						//goback();
						break;
					case target === $header_items[2]:
						articleDetail();
						break;
				}
			})
		}
		//滚动时隐藏边栏
		$win.scroll(function(){
			hideBanner();
		})
		headerContainer();
		chapterContainer();
		footerItemContainer();
		fontContainer();
		banner();
	}
	let main = function () {
		mountEvent();
		renderUI();
		loadChapterFrom(caches.chapter);
	}
	main();
})()

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);