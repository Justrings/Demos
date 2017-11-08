import "../node_modules/normalize.css/normalize.css/";
import "../style/tryagain.css";
import "../node_modules/owl.carousel/dist/assets/owl.carousel.min.css";
import "../node_modules/owl.carousel/dist/assets/owl.theme.default.css";
	$(document).ready(function(){
  		$(".owl-carousel").owlCarousel({
  			items: 1,
  			autoplay: true,
  			autoplayTimeout:3000,
  			autoplayHoverPause: true,
  			loop: true,
  			dots: true
  		});
	});