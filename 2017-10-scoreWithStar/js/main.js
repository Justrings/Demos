
function markOn($rating, options){
	var deafultSetting = {
		n: 3,
		readOnly: false,
		half: true,
		onceSign: true,
	};
	this.options = $.extend({}, deafultSetting, options);
	this.$rating = $rating;
	this.n = options.n;
	this.$rateItems = this.$rating.find('.ratingItem');
	this.len = this.$rateItems.length;
}
markOn.prototype.lightOn = function ($rateItems, n) {
	if(this.options.half){
		var m = Math.floor(n) - 0;
		n = n - Math.floor(n);
		console.log(['m:'+m,'n:'+n]);
		$rateItems.each(function(index) {
			if(index <= m){
				console.log('000000');
				if(index < m){
					$(this).addClass('marked').removeClass('halfMarked');
				}else{
					if(n<0.5&&n>0){
						$(this).removeClass('marked').addClass('halfMarked');
					}else{
						$(this).removeClass('halfMarked').addClass('marked');
					}
				}
			}else{
				$(this).removeClass('marked').removeClass('halfMarked');
			}
		});
	}else{
		$rateItems.each(function(index) {
			if(index <= n){
				$(this).addClass('marked');
			}else{
				$(this).removeClass('marked');
			}
		});
	}
};
markOn.prototype.port = function(){
		var self = this;
		var indexHalf = 0;
		this.lightOn(this.$rateItems, this.n);
		this.$rating.on('mousemove', '.ratingItem', function(event) {
				if(self.options.half){
					indexHalf = (event.pageX-$(this).offset().left+1)/32;
				}
			self.lightOn(self.$rateItems, $(this).index()+indexHalf);
			 }).on('click', '.ratingItem', function(event) {
				if(self.options.readOnly){
					console.log("readOnly");
					return;
				}
				if(self.options.onceSign){
					self.options.onceSign = false;
					self.lightOn(self.$rateItems, $(this).index()+indexHalf);
					self.n = $(this).index()+indexHalf;
				}else{
					console.log("all reversed");
				}
			 }).on('mouseout', '.ratingItem', function(event) {
			 	console.log(indexHalf);
				self.lightOn(self.$rateItems, self.n);
			 });
	};
markOn.prototype.init = function(){
	var self = this;
	this.port(this.$rating, this.n);
};

var mark = new markOn($(".rating"),{n: 3,});
mark.init();

var mark2 = new markOn($(".rating2"),{n: 2,})
mark2.init();