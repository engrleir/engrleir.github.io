/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 *
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

(function (window) {
  "use strict";

  // class helper functions from bonzo https://github.com/ded/bonzo

  function classReg(className) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

  // classList support for class management
  // altho to be fair, the api sucks because it won't accept multiple classes at once
  var hasClass, addClass, removeClass;

  if ("classList" in document.documentElement) {
    hasClass = function (elem, c) {
      return elem.classList.contains(c);
    };
    addClass = function (elem, c) {
      elem.classList.add(c);
    };
    removeClass = function (elem, c) {
      elem.classList.remove(c);
    };
  } else {
    hasClass = function (elem, c) {
      return classReg(c).test(elem.className);
    };
    addClass = function (elem, c) {
      if (!hasClass(elem, c)) {
        elem.className = elem.className + " " + c;
      }
    };
    removeClass = function (elem, c) {
      elem.className = elem.className.replace(classReg(c), " ");
    };
  }

  function toggleClass(elem, c) {
    var fn = hasClass(elem, c) ? removeClass : addClass;
    fn(elem, c);
  }

  var classie = {
    // full names
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    // short names
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass,
  };

  // transport
  if (typeof define === "function" && define.amd) {
    // AMD
    define(classie);
  } else {
    // browser global
    window.classie = classie;
  }
})(window);

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
  $("body").on("click", ".page-scroll a", function (event) {
    var $anchor = $(this);
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: $($anchor.attr("href")).offset().top,
        },
        1500,
        "easeInOutExpo"
      );
    event.preventDefault();
  });
});

// Highlight the top nav as scrolling occurs
$("body").scrollspy({
  target: ".navbar-fixed-top",
});

// Closes the Responsive Menu on Menu Item Click
$(".navbar-collapse ul li a:not(.dropdown-toggle)").click(function () {
  $(".navbar-toggle:visible").click();
});

/**
 * cbpAnimatedHeader.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * https://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var cbpAnimatedHeader = (function () {
  var docElem = document.documentElement,
    header = document.querySelector(".navbar-fixed-top"),
    didScroll = false,
    changeHeaderOn = 300;

  function init() {
    window.addEventListener(
      "scroll",
      function (event) {
        if (!didScroll) {
          didScroll = true;
          setTimeout(scrollPage, 250);
        }
      },
      false
    );
  }

  function scrollPage() {
    var sy = scrollY();
    if (sy >= changeHeaderOn) {
      classie.add(header, "navbar-shrink");
      $(".scroll-top").removeClass("hidden-sm hidden-xs");
      $(".scroll-top").fadeIn(500);
    } else {
      classie.remove(header, "navbar-shrink");
      $(".scroll-top").fadeOut(500, function () {
        $(".scroll-top").addClass("hidden-sm hidden-xs");
      });
    }
    didScroll = false;
  }

  function scrollY() {
    return window.pageYOffset || docElem.scrollTop;
  }

  init();
})();
