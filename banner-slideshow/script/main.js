(function() {
    let $ = function(str) {
        return document.getElementsByClassName(str);
    }

    //轮播图对象
    let Slideshow = function(className, settings, dataSource) {
        this.container = $(className)[0];
        this.dataSource = dataSource;
        this.images = this.container.getElementsByTagName('img');
        this.dots = $('dot-item');
        this.dot = null;
        this.clockId = 0;
        this.settings = Object.assign({
            time: 2000,
            autorun: true,
            controller: true,
            dots: true,
        }, settings);
    }
    Slideshow.prototype = {
        constructor: Slideshow,
        //建立HTML 结构
        establishHTML: function() {
            this.container.innerHTML = '<div class="banners"></div>' +
                '<div class="control get-right"></div>' +
                '<div class="control get-left"></div>' +
                '<div class="dots">';
        },
        //加载数据
        loadData: function() {
            let images = this.dataSource.data,
                imgStr = '',
                dotStr = '';
            this.dot = $('dots')[0];
            const len = images.length;
            for (var i = 0; i < len; i++) {
                imgStr += "<img src='" + images[i].imageURL + "' class='image_item img" + (images[i].imageId - 1) + "' alt='bannerImage'/>";
                dotStr += "<span class='dot-item dot" + (images[i].imageId - 1) + "'></span>";
            }
            $('banners')[0].innerHTML = imgStr;
            this.dot.innerHTML = dotStr;
        },
        //是否隐藏控制功能
        hideControler: function() {
            if (!this.settings.controller) {
                $('get-right')[0].classList.add('hidden');
                $('get-left')[0].classList.add('hidden');
            }
            if (!this.settings.dots) {
                this.dot.classList.add('hidden');
            }
        },
        //获得当前标记项
        getIndexNow: function() {
            const len = this.images.length;
            for (var i = 0; i < len; i++) {
                //wrong
                if (this.images[i] === $('selected')[0])
                    break;
            }
            return i;
        },
        slideToNext: function() {
            let indexNow = this.getIndexNow();
            this.images[indexNow].classList.remove('selected');
            this.dots[indexNow].classList.remove('lighton');
            if (indexNow === this.images.length - 1) {
                this.images[0].classList.add('selected');
                this.dots[0].classList.add('lighton');
            } else {
                this.images[indexNow + 1].classList.add('selected');
                this.dots[indexNow + 1].classList.add('lighton');
            }

        },
        slideToPrevious: function() {
            let indexNow = this.getIndexNow();
            this.images[indexNow].classList.remove('selected');
            this.dots[indexNow].classList.remove('lighton');
            if (indexNow === 0) {
                this.images[this.images.length - 1].classList.add('selected');
                this.dots[this.images.length - 1].classList.add('lighton');
            } else {
                this.images[indexNow - 1].classList.add('selected');
                this.dots[indexNow - 1].classList.add('lighton');
            }
        },
        slideToSelected: function(i) {
            let indexNow = this.getIndexNow();
            this.images[indexNow].classList.remove('selected');
            this.images[i].classList.add('selected');
            this.dots[indexNow].classList.remove('lighton');
            this.dots[i].classList.add('lighton');
        },
        selectedOn: function() {
            this.images[0].classList.add('selected');
            this.dots[0].classList.add('lighton');
        },
        runBanner: function() {
            if (this.settings.autorun) {
                let run = () => {
                    this.clockId = setTimeout(() => {
                        this.slideToNext();
                        run();
                    }, this.settings.time);
                };
                run();
            }
        },
        stopBanner: function() {
            clearTimeout(this.clockId);
        },
        //装载事件
        mountEvent: function() {
            this.container.addEventListener('click', (e) => {
                let target = e.target || e.srcElement,
                    controlRight = $('get-right')[0],
                    controlLeft = $('get-left')[0];
                switch (target) {
                    case controlLeft:
                        this.slideToPrevious();
                        break;
                    case controlRight:
                        this.slideToNext();
                        break;
                }
            });

            this.dot.addEventListener('mouseover', (e) => {
                let target = e.target || e.srcElement;
                if (this.dot.contains(target) && target !== this.dot) {
                    let indexNow = this.getIndexNow(),
                        length = this.dots.length,
                        selectedNow;
                    for (var i = 0; i < length; i++) {
                        if (target === this.dots[i])
                            break;
                    }
                    selectedNow = i;
                    this.slideToSelected(i);
                }
            });

            this.container.addEventListener('mouseenter', () => {
                this.stopBanner();
            })
            this.container.addEventListener('mouseleave', () => {
                this.runBanner();
            })
        },
        init: function() {
            this.establishHTML();
            this.loadData();
            this.hideControler();
            this.selectedOn();
            this.runBanner();
            this.mountEvent();
        }
    };
    let template = {
        'data|5-8': [{
            'imageURL': function() {
                return Mock.Random.image('500x200', Mock.Random.color());
            },
            'imageId|+1': 1,
        }]
    };
    Mock.setup({
        timeout: 1500
    });
    Mock.mock(/\.json/, template);

    let init = function() {
        let xhr = new XMLHttpRequest(),
        	loadingImgURL = './image/loading.gif';
        xhr.onreadystatechange = function() {
        	let imageURLCache = [];
        	let repalceImages = function(dataSource) {
        			data = dataSource.data;
        		let length = data.length;
 	 			for (let i = 0; i < length; i++) {
 	 				imageURLCache.push(data[i].imageURL);
 	 				data[i].imageURL = loadingImgURL;
 	 			}
 	 		}
 	 		let loadImages = function(imagesDom, imageURLCache) {
 	 			let length = imagesDom.length;
 	 			for (let i = 0; i < length; i++) {
 	 				let imgPlaceholder = new Image();
 	 					imgPlaceholder.addEventListener('load', ()=>{
 	 						imagesDom[i].src = imgPlaceholder.src;
 	 					})
 	 					imgPlaceholder.src = imageURLCache[i];
 	 			}
  			}

            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    let dataSource = JSON.parse(xhr.responseText);
                    	repalceImages(dataSource);
                    let slideShow = new Slideshow('slideshow', {}, dataSource);
                   		slideShow.init();
                   		loadImages(slideShow.images,imageURLCache);

                } else {
                    new Error('get xhr failed!');
                }
            }
        }
        xhr.open("get", "hello.json", true);
        xhr.send(null);
    };
    init();
})();