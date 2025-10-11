(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
      
        document.body.addEventListener("click", function (e) {
            const target = e.target.closest(".icon-menu");
            if (target) {
                e.preventDefault();
                const headerMenu = target.closest(".header_menu");
                if (headerMenu) {
                    headerMenu.classList.toggle("active");
                }
                target.classList.toggle("active");
                document.body.classList.toggle("fixed");
            }
        });

      
        document.addEventListener("scroll", function () {
            const header = document.getElementById("header");
            if (!header) return;

            const scrolled = window.pageYOffset || document.documentElement.scrollTop;
            if (scrolled > 80) {
                header.classList.add("top-nav-fixed");
            } else {
                header.classList.remove("top-nav-fixed");
            }
        });
    });
})();


$(document).ready(function(){
  $('.services-slider').slick({
    slidesToShow: 3,
    slidesToScroll:1,        
    arrows: true,
    dots: false,  
     centerMode: false, // выключаем centerMode!
    infinite: true,
    prevArrow: $('.arrow.prev'),
  nextArrow: $('.arrow.next'),
    
  });
});