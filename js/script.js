$(function(){
	'use strict';	
/*************** The color picker start ***************************/
	var colors = ['Blue', 'Black', 'Red', 'Green'];
	var colorListHtml = '';
	for (var i=0; i< colors.length; i++) {
		colorListHtml += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">'+ colors[i] +'</a></li>';
	}

	$('#colorDropDown').html(colorListHtml);
//////////////////// The color picker end /////////////////////////

/**** When site loads, read and store the manu object which contains info on site
navigation and pagination content address ****/
var menuObj;
var lastPageNum;
$.getJSON('data/menu.json')
	.done(function(data) {
			menuObj = data;
			//console.log(menuObj);
			/* since this function was called at page load/site load, 
			we must now make the 1st page i.e the Deals page ready */
			$('li[data-page-id="deals"]').addClass('active');
			initPage("deals");
		})
	.fail(function(e,f,g) { 
			console.log('request failed' + e + " and " + f + " and " + g);
			alert('Site cannot be loaded due to menu object loading error... Please report this...');
		});
////////////////////////////////////////////////////////////////////////////////

/************************* ALL EVENTS ****************************/
	//mobile main menu view toggle
	$('#headSharingIconsPanel').on('click', '.showHideMainMenu', function (ev) {
		ev.stopPropagation();
		$('#headNav ul').toggle(500);
	});	

	$('#pickColor').on('click', function () {
		//console.log($(this).val());
		$('#colorDropDown').toggle();
	});

	$('#colorDropDown').on('click', 'li', function (ev) {
		ev.stopPropagation();
		var color = $(this).find('a').text();
		$('#colorDropDown').hide();
		$('body').css('background-color', color);
	});

	$('#headNav').on('click', 'li[data-page-id]', function (ev) {
		if($(this).hasClass('active')) {
			ev.preventDefault();
			return;
		}
		$('li[data-page-id]').removeClass('active');
		$(this).addClass('active');
		var pageID = $(this).attr('data-page-id');
		initPage(pageID);
	});

	//pagination button click event
	$('.secPagination').on('click', 'li[data-page-num]', function () {
		if(!$(this).hasClass('active')) {			
			gotoPage($(this).attr('data-page-num'));
		}
	});

	//left double arrow is clicked, go to page 1
	$('.secPagination').on('click', '.left-arrow.double-arrow', function () {
		gotoPage(1);
		console.log('going to 1');
	});

	//left single arrow is clicked, go to thisPage-1
	$('.secPagination').on('click', '.left-arrow.single-arrow', function () {
		var currentPageNum = Number($('.secPagination li.active').attr("data-page-num"));
		gotoPage(currentPageNum-1);
		console.log('going to ' + (currentPageNum-1))
	});

	//right double arrow is clicked, go to page 1
	$('.secPagination').on('click', '.right-arrow.double-arrow', function () {
		gotoPage(lastPageNum);
		console.log('going to '+lastPageNum);
	});

	//right single arrow is clicked, go to thisPage+1
	$('.secPagination').on('click', '.right-arrow.single-arrow', function () {
		var currentPageNum = Number($('.secPagination li.active').attr("data-page-num"));
		gotoPage(currentPageNum+1);
		console.log('going to ' + (currentPageNum+1))
	});

/////////////////////////////////////////////////////////////////////

/******************* top Carousel auto rotate ********************/
	var leftArrowClicked = false;
	$('.jcarousel-control-prev').click(function () {
		leftArrowClicked = true;
	});

	function autoRightScroll () {
		if (leftArrowClicked) {
			leftArrowClicked = false;
		}
		else {
			$('.jcarousel-control-next').trigger('click');
		}

		setTimeout(autoRightScroll, 2000);
	}

	autoRightScroll();
///////////////////////////////////////////////////////////////////

/**************** ALL FUNCTIONS DEFINED BELOW **********************/	

	/* initPage function will take the pageId and make the page for us including
 	pagination and then loading the content of the 1st page
	*/
	function initPage(pageId) {
		//get the pages array for this page
		var pages = menuObj[pageId];
		var noOfPages = pages.length;
		lastPageNum = noOfPages;
		$('.secPagination').html('');
		//console.log(pages);
		//if there is only 1 page, no need to show pagination
		if(noOfPages > 1) {
			var paginationHtml = '<ul>'
								+	'<li class="left-arrow double-arrow">&laquo;</li>'
								+	'<li class="left-arrow single-arrow">&lsaquo;</li>';

			for(var i=1; i<= noOfPages; i++) {
				paginationHtml += '<li data-page-num="' + i + '">' + i + '</li>'; 
			}

			paginationHtml += 	'<li class="right-arrow single-arrow">&rsaquo;</li>'
							+	'<li class="right-arrow double-arrow">&raquo;</li>'
							+ '</ul>'

			$('.secPagination').html(paginationHtml);

			//now load the 1st page of this menu type into the content area
			$('li[data-page-num="1"]').trigger('click');
		} 
		else if (noOfPages == 1) {
			gotoPage(1)
		} 
		else {
			$('#contentContainer').html("CONTENT COMING SOON...");
		}
	}

	/* gotoPage(pageNum) function will load the content of pageNum page..
 	remember the pageAddressArray index will be pageNum-1 since array 
 	index starts from 0 */
	function gotoPage(pageNum) {
		var pageAddress = menuObj[$('li.active').attr('data-page-id')][Number(pageNum)-1];
		//console.log(pageAddress);
		//fetch content from that address
		retriveData(pageAddress);

		//mark as active
		$('li[data-page-num]').removeClass('active');
		$('li[data-page-num="'+pageNum+'"]').addClass('active');

		//showhide pagination button
		if (pageNum == 1) {
			$('.left-arrow').hide();
			$('.right-arrow').show();
		}
		else if (pageNum == lastPageNum) {
			$('.right-arrow').hide();
			$('.left-arrow').show();
		}
		else {
			$('.left-arrow').show();
			$('.right-arrow').show();
		}
	}

	/* the function to read files via ajax call */
	function retriveData(fileURL) {
		$.getJSON(fileURL)
	.done(function(data) {
			//console.log(data);
			parseNAdd(data);
		})
	.fail(function(e,f,g) { 
			console.log('retriveData failed' + e + " and " + f + " and " + g);
		});
	}

	/* this function will json data and populate page */
	function parseNAdd(data){
		console.log(data);
		//var itemsObjArray = data.dotdList;
		var itemsObjArray = data.dotdList || data;
		var itemsHTML = '';
		//console.log(jsonObj.dotdList);

		for(var i=0; i< itemsObjArray.length; i++) {
			itemsHTML += '<li class="itemBox col-sm-3 col-xs-12">'
						+	'<a href="' + itemsObjArray[i].url + '">'
						+		'<img class="itemPic" src="' + itemsObjArray[i].imageUrls[0].url + '"/>'
						+		'<div class="itemInfo">'	
						+			'<span class="itemTitle">'
						+				itemsObjArray[i].title
						+			'</span>'
						+			'<span class="itemDesc">'
						+				itemsObjArray[i].description
						+			'</span>'
						+		'</div>'
						+	'</a>'
						+'</li>';
		}

		//append the html content inside #contentContainer
		$('#contentContainer').html(itemsHTML);

		$('.icon-rupee').addClass('fa fa-inr');
	}
//////////////////////////////////////////////////////////////////////////
});

