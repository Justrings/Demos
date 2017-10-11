var mark = (function(){

	var init = function(num, selector) {
		var $rating = $(selector),
		$items = $rating.find('.ratingItem');
		
		markOn(num, $items);

		console.log([$rating]);
		$rating.on('mouseover', '.ratingItem', function() {
			markOn($(this).index(), $items);
		}).on('click', '.ratingItem', function() {
			num = $(this).index();
		}).on('mouseout', function() {
			markOn(num, $items);
		});
	};

	var markOn = function(num,$items) {
		 $items.each(function(index) {
	 		if(index <= num){
	 			$(this).addClass('marked');
	 		}else{
	 			$(this).removeClass('marked');
	 		}
		 });
		};

	return {
		init: init
	};

})();

mark.init(2,'.rating');
mark.init(3,'.rating2');
















/*var rateContainer = document.getElementsByClassName('rating')[0],
	rateItems = rateContainer.children;
	flag = false;

var getItem = function(target) {
	for(var i = 0; i < rateItems.length; i++){
		if(target === rateItems[i])
			return i;
	}
};
var handler = function(e) {
	var target = e.target;
		if(target.tagName.toLowerCase() !== 'li'){
			return;
		}else if(flag){
			return;
		}
	var i = getItem(target);
		
	switch(e.type) {
		case 'click':
			console.log('您已成功评分!!!');
			flag = true; 
			break;
		case 'mouseover':
			for(var j = 0; j < rateItems.length; j++){
				if(j <= i){
					rateItems[j].classList.add('marked');
					console.log(j);
				}else{
					rateItems[j].classList.remove('marked');
				}
			}
			break;
	}
} ;

rateContainer.addEventListener('mouseover',handler);
rateContainer.addEventListener('click', handler);
rateContainer.addEventListener('mouseout', handler);*/