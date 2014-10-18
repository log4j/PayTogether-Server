/**************************************/
/* run this function if window resize */
/**************************************/

var widthLess1024 = function(){
  
  if ($(window).width() < 1024) {
    //make sidebar collapsed
    $('#sidebar, #navbar').addClass('collapsed');
    $('#navigation').find('.dropdown.open').removeClass('open');
    $('#navigation').find('.dropdown-menu.animated').removeClass('animated');

    //move content if navigation is collapsed
    if ($('#sidebar').hasClass('collapsed')) {
      $('#content').animate({left: "0px",paddingLeft: "55px"},150);
    } else {
      $('#content').animate({paddingLeft: "55px"},150);
    };
  }
  else {
    //make navigation not collapsed
    $('#sidebar, #navbar').removeClass('collapsed');
    
  } 
  
  $("#content").css("padding-left","25px");

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
  $("#content").css("padding-left","25px");
  
}

$(function(){

	/********************/
  /* INITIALIZE MMENU */
  /********************/

	$("#mmenu").mmenu({
    position: "right",
    zposition: 'next',
    moveBackground: false
  });

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
  /*
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
	*/
	/*****************************/
  /* INITIALIZE MAIN NICESCROLL*/
  /*****************************/

	/************************************/
	/* SIDEBAR MENU DROPDOWNS FUNCTIONS */
	/************************************/

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
   
    $(this).animateNumbers(value, true, duration, "linear");
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
  $("#loader").delay(500).fadeOut(300); 
  $(".mask").delay(800).fadeOut(300, function(){
    //widthLess1024();
    //widthLess768();
  });
});