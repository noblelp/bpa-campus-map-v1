// Documentation Reference - http://coderepo.demo.finalsite.com/the-build/sass/pages

// ================================
// BPA - Campus Map V1 - JS
// ================================

require('../../js/internal/columns.js');

import {
    $body,
    notComposeMode,
    $window
} from '../../js/include/config-vars.js';


var $mapSlideshow = $('.fsSlideshow.map-slideshow-element');
var $mapBreakpoint = 900; //should match breakpoint in sass partial

BPA_CAMPUS_MAP_V1 = {

  init () {

    if (notComposeMode) {

      if ($('.campus-map.point-plotter').length) {
        this.plotPoints();
      } else {
        this.legend();
        this.mapContainer();
      }

      this.arrangePoints();
    }
  },

  legend () {

    var listLength = $('.map-legend .fsListLevel1 > li').length;

    if (listLength < 5) {
      $('.map-legend .fsListLevel1').addClass('small');
    } else if (listLength < 11){
      $('.map-legend .fsListLevel1').addClass('medium');
    } else {
      $('.map-legend .fsListLevel1').addClass('large');
    }

  },

  plotPoints () {

    //This is for the fsDraftMode functionality where you can click on the map and get the coordinates.
    $(document).on('click', ".copyButton" , function() {
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val($(".html-markup").text()).select();
      document.execCommand("copy");
      $temp.remove();
      $(".copyButton").addClass("success").html("Copied");
    });

    $(window).on('load', function() {
      var container = $(".map-container > header");
      var containerWidth = container.width();
      var containerHeight = container.height();
      function getRelativeCoordinates(e,f) {

        //Remove the old popup if it exists
        if($(".coordinates-popup").length) {
          $(".coordinates-popup").remove();
        }

        //Grab the offset position of the map container to the document window
        var posXX = f.offset().left,
            posYY = f.offset().top
        ;

        //Do math to see what position the mouse is in relative to the map container. Convert to %
        finalX = (((e.pageX - posXX) / containerWidth) * 100).toFixed(2);
        finalY = (((e.pageY - posYY) / containerHeight) * 100).toFixed(2);

        console.log(finalY);

        //Put it in the popup
        $('<div class="coordinates-popup"><span class="html-markup">&lt;div data-posx="'+finalX+'" data-posy="'+finalY+'"&gt;LOCATION TITLE&lt;/div&gt;</span><button class="copyButton">Copy</button></div>').prependTo('.map-container');
      }

      $(".point-plotter .map-container > header").on("click",function(event) {
        getRelativeCoordinates(event,container);
      });
    });

  },

  arrangePoints () {

    $('.map-points .fsElementFooterContent > div').addClass('point-coordinates');

    $('.map-points .fsResourceCollectionLink').wrapInner('<span />');

    $('.map-points .point-coordinates').each(function(i) {
      var mapPointsX = $(this).attr('data-posx');
      var mapPointsY = $(this).attr('data-posy');
      $('.map-points .fsListLevel1 > li.fsListItem').eq(i).css({
        "left": mapPointsX+"%",
        "top": mapPointsY+"%"
      });
    });

    $('.map-points').appendTo('.map-container > header');


    $('.map-legend .fsListLevel1 > li.fsListItem').each(function(i) {
      $(this).on('click', function() {
        $('.map-points .fsListLevel1 > li.fsListItem').removeClass('active-point');
        $('.map-points .fsListLevel1 > li.fsListItem').eq(i).addClass('active-point');
      });
    });


    $('.map-points .fsListLevel1 > li.fsListItem').on('click', function() {
      $('.map-points .fsListLevel1 > li.fsListItem').removeClass('active-point');
      $(this).addClass('active-point');
    });

  },

  mapContainer () {

    $('.map-container > .fsElementContent').prepend('<button class="close-map">close</button>');

    $('.fsResourceCollectionLink').on('click', function() {

      $('.map-container').addClass('active');

      $('html, body').animate({
        scrollTop: $(".map-slideshow-element").offset().top - 30
      }, 700);

    });

    $(document).on('click', function(event) {
        if (!$(event.target).closest('.map-slideshow-element, .map-legend .fsStyleDefaultList, .fsResourceCollectionLink').length) {
            $('.map-container').removeClass('active');
            $('.map-points .fsListLevel1 > li.fsListItem').removeClass('active-point');
        }
    });

  },

  gridSlideshow () {

    var $mapSlideshow = $('.map-slideshow-element');

    $mapSlideshow.find('article.fsResource').each(function() {
      var $picture = $(this).find('figure > picture');
      var $title = $(this).find('.fsTitle');
      var $caption = $(this).find('figcaption');
      var $figure = $(this).find('figure');
      
      $picture.append($title);
      // $('<div class="dots-wrapper"></div>').insertAfter($picture);
    });

    var checkSlider = setInterval(function() {
      if( $('.map-slideshow-element article img').length) {
        clearInterval(checkSlider);
        $mapSlideshow.find('.fsListItems.fsStyleOneColumn').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 400,
          fade: true,
          cssEase: 'linear',
          responsive: [
            {
              breakpoint: $mapBreakpoint,
              settings: {
                adaptiveHeight: true
              }
            }
          ]
        });

        $mapSlideshow.addClass('show');
      } else {
        $mapSlideshow.addClass('empty');
      }
    },250);

  },

}; //end BPA_CAMPUS_MAP_V1


BPA_CAMPUS_MAP_V1.init();

slideshowAJAXSuccess = function onAJAXSuccess(event, xhr, options, data){
  BPA_CAMPUS_MAP_V1.gridSlideshow();
},

$(document).ajaxSuccess(slideshowAJAXSuccess);






