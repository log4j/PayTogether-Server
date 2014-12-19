/**************************************/
/* run this function if window resize */
/**************************************/

var widthLess1024 = function(){
  
  if ($(window).width() < 1024) {
    //make sidebar collapsed
    //$('#sidebar, #navbar').addClass('collapsed');
    $('#navigation').find('.dropdown.open').removeClass('open');
    $('#navigation').find('.dropdown-menu.animated').removeClass('animated');

    //move content if navigation is collapsed
      
      /**
       * disabled by yangmang
        
    if ($('#sidebar').hasClass('collapsed')) {
      $('#content').animate({left: "0px",paddingLeft: "55px"},150);
    } else {
      $('#content').animate({paddingLeft: "55px"},150);
    };
    
    */
  }

  else {
    //make navigation not collapsed
    $('#sidebar, #navbar').removeClass('collapsed');

    //move content if navigation is not collapsed
      /**
       * disabled by yangmang
       *
    if ($('#sidebar').hasClass('collapsed')) {
      $('#content').animate({left: "210px",paddingLeft: "265px"},150);
    } else {
      $('#content').animate({paddingLeft: "265px"},150);
    };
    */
  }  

};

var widthLess768 = function(){
  if ($(window).width() < 768) {     
    //paste top navbar objects to sidebar
    if($('.collapsed-content .search').length === 1) {
      $('#main-search').appendTo('.collapsed-content .search');
    }
    if($('.collapsed-content li.user').length === 0) {
      $( ".collapsed-content li.search" ).after($( "#current-user" ));
    }
  }

  else {
    //show content of top navbar
    $('#current-user').show();
    
    //remove top navbar objects from sidebar
    if($('.collapsed-content .search').length === 2) {
      $( ".nav.refresh" ).after($( "#main-search" ));
    }
    if($('.collapsed-content li.user').length === 1) {
      $( ".quick-actions >li:last-child" ).before($( "#current-user" ));
    }
  }  
}

$(function(){

	/********************/
  /* INITIALIZE MMENU */
  /********************/

	

	/************************************************/
  /* ADD ANIMATION TO TOP MENU & SUBMENU DROPDOWN */
  /************************************************/

	$('.quick-actions .dropdown').on('show.bs.dropdown', function(e){
    $(this).find('.dropdown-menu').addClass('animated fadeInDown');
    $(this).find('#user-inbox').addClass('animated bounceIn');
  });

  $('#navigation .dropdown').on('show.bs.dropdown', function(e){
    $(this).find('.dropdown-menu').addClass('animated fadeInLeft');
  });

  /*********************************/
  /* INITIALIZE SIDEBAR BAR CHARTS */
  /*********************************/

  $('#sales-chart').sparkline([5,6,7,2,1,4,6,8,10,14], {
    width: '60px',
    type: 'bar',
    height: '40px',
    barWidth: '6px', 
    barSpacing: 1,
    barColor: '#d9544f',
  });

  $('#balance-chart').sparkline([5,6,7,2,1,4,6,8,10,14], {
    width: '60px',
    type: 'bar',
    height: '40px',
    barWidth: '6px', 
    barSpacing: 1,
    barColor: '#418bca',
  });

  /****************************/
  /* SIDEBAR PARTS COLLAPSING */
  /****************************/

  $('#sidebar .sidebar-toggle').on('click', function(){
  	var target = $(this).data('toggle');

  	$(target).toggleClass('collapsed');
  });

  /*********************************/
	/* INITIALIZE SIDEBAR NICESCROLL */
	/*********************************/
  
	$("#sidebar").niceScroll({
	  cursorcolor: '#000000',
	  zindex: 999999,
	  bouncescroll: true,
	  cursoropacitymax: 0.4,
	  cursorborder: '',
	  cursorborderradius: 0,
	  cursorwidth: '7px',
	  railalign: 'left',
	  railoffset: {top:45,left:0}
	});

	/*****************************/
  /* INITIALIZE MAIN NICESCROLL*/
  /*****************************/

  $("#content").niceScroll({
    cursorcolor: '#000000',
    zindex: 999999,
    bouncescroll: true,
    cursoropacitymax: 0.4,
    cursorborder: '',
    cursorborderradius: 7,
    cursorwidth: '7px',
    background: 'rgba(0,0,0,.1)',
    autohidemode: false,
    railpadding: {top:0,right:2,left:2,bottom:0}
  });


	/************************************/
	/* SIDEBAR MENU DROPDOWNS FUNCTIONS */
	/************************************/

	$('#navigation .dropdown.open').data('closable', false);

	$('#navigation .dropdown').on({
	  "shown.bs.dropdown": function() {
	    $(this).data('closable', false);
	    // resize scrollbar
	    $("#sidebar").getNiceScroll().resize();
	  },
	  "click": function(e) {
	    $(this).data('closable', true);
	    if (!$(this).hasClass('open')) {
	      $('li.dropdown.open').removeClass('open');
	    }

	    if ($('#sidebar').hasClass('collapsed')) {
		    // Avoid having the menu to close when clicking
		    e.stopPropagation();
	    }
	    // resize scrollbar
	    $("#sidebar").getNiceScroll().resize();
	  },
	  "hide.bs.dropdown": function() {
	    return $(this).data('closable');
	    // resize scrollbar
	    $("#sidebar").getNiceScroll().resize();
	  }
	});

	/*******************************/
  /* SIDEBAR COLLAPSING FUNCTION */
  /*******************************/
    /*
    disabled by yangmang
    
  $('.sidebar-collapse a').on('click', function(){
    // Add or remove class collapsed
    $('#sidebar, #navbar').toggleClass('collapsed');

    $('#navigation').find('.dropdown.open').removeClass('open');
    $('#navigation').find('.dropdown-menu.animated').removeClass('animated');
    $('#sidebar > li.collapsed').removeClass('collapsed');
    
    if ($('#sidebar').hasClass('collapsed')) {
      if ($(window).width() < 1024) {
        //if width is less than 1024px move content to left 0px
        $('#content').animate({left: "0px"},150)
      }
      else {
        //if width is not less than 1024px give padding 55px to content
        $('#content').animate({paddingLeft: "55px"},150)
      }

    } else {

      if ($(window).width() < 1024) {
        //if width is less than 1024px move content to left 210px
        $('#content').animate({left: "210px"},150)
      }
      else {
        //if width is not less than 1024px give padding 265px to content
        $('#content').animate({paddingLeft: "265px"},150)
      }
    }

  });
  */

  /**************************/
  /* SIDEBAR CLASS TOGGLING */
  /**************************/

  $('#navigation .menu > li').hover(function(){
     $(this).addClass('hovered');
     $('#sidebar').addClass('open');
  }, function(){
     $(this).removeClass('hovered');
     $('#sidebar').removeClass('open');
  });

  /**************************************/
  /* run this function after page ready */
  /**************************************/

  widthLess1024();
  widthLess768();

  /***************************************/
  /* run this functions if window resize */
  /***************************************/

  $(window).resize(function() {
    widthLess1024();
    widthLess768();
  });

  /**************/
  /* ANIMATIONS */
  /**************/

  //animate numbers with class .animate-number with data-value attribute
  $(".animate-number").each(function() {
    var value = $(this).data('value');
    var duration = $(this).data('animation-duration');
   
    $(this).animateNumbers(parseFloat(value).toFixed(2), true, duration, "linear", "$");
  });
   
  //animate progress bars
  $('.animate-progress-bar').each(function(){
    var progress =  $(this).data('percentage');
   
    $(this).css('width', progress);
  })

  /**********************************/
  /* color scheme changing function */
  /**********************************/

  $('#color-schemes li a').click(function(){
    var scheme = $(this).attr('class');
    var lastClass = $('body').attr('class').split(' ').pop();

    $('body').removeClass(lastClass).addClass(scheme);
  });

  /*******************************/
  /* VIDEO BACKGROUND INITIALIZE */
  /*******************************/



  /*************************/
  /* page refresh function */
  /************************/

  $('.page-refresh').click(function() {
    location.reload();
  });

  /**************************/
  /* block element function */
  /**************************/

  function elBlock(el) {    
    $(el).block({
      message: '<div class="el-reloader"></div>',
      overlayCSS: {
        opacity: 0.6,
        cursor: 'wait',
        backgroundColor: '#000000',
      },
      css: {
        padding: '5px',
        border: '0',
        backgroundColor: 'transparent'
      }
    });
  };
   
  /****************************/
  /* unblock element function */
  /****************************/

  function elUnblock(el) {
    $(el).unblock();
  };

  /*************************/
  /* tile refresh function */
  /*************************/

  $('.tile-header .controls .refresh').click(function() { 
    var el = $(this).parent().parent().parent();
    elBlock(el);
    window.setTimeout(function() {
      elUnblock(el);
    }, 1000);

    return false;
  });

  /************************/
  /* tile remove function */
  /************************/

  $('.tile-header .controls .remove').click(function() {
    $(this).parent().parent().parent().addClass('animated fadeOut');
    $(this).parent().parent().parent().attr('id', 'el_remove');
     setTimeout( function(){      
      $('#el_remove').remove(); 
     },500);

     return false;
  });

  /************************/
  /* tile minimize function */
  /************************/

  $('.tile-header .controls .minimize').click(function() {
    $(this).parent().parent().parent().toggleClass('minimized');

     return false;
  });

})

/******************/
/* page preloader */
/******************/
$(window).load(function() { 
  $("#loader").delay(800).fadeOut(400); 
  $(".mask").delay(800).fadeOut(400, function(){
    widthLess1024();
    widthLess768();
  });
});