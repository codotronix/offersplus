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

/************* Content Loading Function Calls Start **************/
	//get page id to know which page we are in
	var pageID = $('#headNav ul li.active').attr('data-page-id');
	//clear the contentContainer for new loading
	$('#contentContainer').html('');

	if (pageID == 'dailyDeals') {
		loadDailyDeals();
	}
//////////////////////////////////////////////////////////////////

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
		$('#contentContainer').html('');

		//load page checking the pageID
		if (pageID == 'dailyDeals') {
			loadDailyDeals();
		}
		else if (pageID == 'fashion') {
			loadFashion();
		}
	});

/////////////////////////////////////////////////////////////////////

/**************** ALL FUNCTIONS DEFINED BELOW **********************/
	/*this is the main calling function for daily deals tab*/
	function loadDailyDeals() {
		//load Flipkart Daily Deals
		var fileURL = 'data/flipkart/dealsOfTheDay.json';		
		retriveData(fileURL, parseNAdd);
	}

	/*this is the main calling function for fashion tab*/
	function loadFashion() {
		var fileURL = 'data/zovi/test.json';
		retriveData(fileURL, parseNAdd);
	}

	/* the function to read files via ajax call */
	function retriveData(fileURL, callBackFn) {
		$.ajax({
			url: fileURL,
			method: 'GET',
			dataType: 'json',
			success: function(data) {
				//console.log(data);
				if (callBackFn && typeof(callBackFn) === 'function') {
					callBackFn(data);
				}
			},
			fail: function(msg) {
				//console.log(msg);
			}
		});
	}

	/* this function will parse Fk Daily deals data and populate page */
	function parseNAdd(data){
		console.log(data);
		//var itemsObjArray = data.dotdList;
		var itemsObjArray = data.dotdList || data;
		var itemsHTML = '';
		//console.log(jsonObj.dotdList);

		for(var i=0; i< itemsObjArray.length; i++) {
			itemsHTML += '<li class="itemBox col-sm-3 col-xs-11">'
						+	'<a target="_blank" href="' + itemsObjArray[i].url + '">'
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
		$('#contentContainer').append(itemsHTML);

		$('.icon-rupee').addClass('fa fa-inr');
	}
/////////////////////////////////////////////////////////////////////
})