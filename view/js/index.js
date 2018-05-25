
// イラスト一覧ページ
$(function(){
	Initialize();
    moveHeadButton();
});

function Initialize(){

	initCategory().then(function(){
		return initIllust();
	}).then(function(){
		//alert('a');
	}).catch(function(){
		alert('n');
	});

	var id = location.search;
    //alert(id.charAt(0));
    if(id.charAt(0) == '?'){
    	//alert('ee');
    	id = id.substring(1);
        $('#loginlink').html('<li></li>').attr({'id':'mypagelink'})
                       .html('<a href="mypage.html?'+id+'">MYPAGE</a>');
    }
}

function initCategory(){

	return new Promise(function(resolve, reject){

		// カテゴリの動的生成
	    categorydata = {
	    		'model'  : 'category',
	    		'action' : 'info',
	    		'list'   : 'a'
	    };

	 // idとnameの値を取得してきてます。
	    $.ajax({
	    	type:'POST',
			url:'../../api/controller.php',
			dataType:'json',
			data:categorydata,
			timeout:1000,
	    }).done(function(categorydata, dataType){

	    	for(var index = 0; index < categorydata.length; index++){
	    		$('.SearchBoxfilter').append('<input type="checkbox" name="checkbox" id="categoryid_'+ categorydata[index].id +'" value="'+ categorydata[index].id +'" checked="checked" onchange="searchCategory();">')
	            .append($('<label></label>').attr({'for':'categoryid_'+categorydata[index].id, 'class':'check_css'}).html(categorydata[index].name));
	    	}
	    	resolve();
	    }).fail(function(categorydata, dataType){;
	    	reject();
	    });
	});
}

function initIllust(){

	return new Promise(function(resolve, reject){

		var param = $('#SearchAndFilter').serializeArray();
	    data = {
	    	'model'  : 'illustration',
	    	'action' : 'index',
	    	'list'   :  param
	        }

	    $.ajax({
	    	url      : '../../api/controller.php',
	    	type     : 'POST',
	    	dataType : 'json',
	    	data     :  data,
	    	timeout  :  1000,
	    }).done(function(data, dataType){
	    	//===ただの表示===
	    	for(var index = 0; index < data.length; index++){
	    		var result = data[index].img.replace('view/', '');
	    		$('.masonry').append($('<div></div>').attr({'id':'illustid_'+data[index].id, 'class':'item', 'name':'illustration'})
	    				     .append($('<a></a>').attr({'onclick':'openLightbox('+data[index].id+',"'+result+'")'})
	    				     .html('<img src="'+result+'"'+
	    		            	   'alt="'+data[index].imgname+'">'))
	    		             .append($('<p></p>').html(data[index].imgname)));
	    		/*$('.imgbox').append('<img src="'+result+'"'+
	    				            'alt="'+data[index].imgname+'">');*/

	    	}
	        //================

	    	triming();
	    	$('.masonry').append($('<div></div>').attr({'class': 'cle' }));
	    	$('.masonry').masonry({itemSelector: '.item', columnWidth : 300 });

	    	resolve();
	    	//===============
	    }).fail(function(){
	    	alert('NoData');
	    	reject();
	    });
	});
}

//トリミング
function triming(){

	var resizeClass    = '.item img';
	var thumnailWidth  = 250;
	var thumnailHeight = 250;
	var iw, ih;

	$(resizeClass).each(function(){
		var w = $(this).width();   // 画像の幅(原寸)
		var h = $(this).height();  // 画像の高さ(原寸)

		// 横長の画像の場合
		if(w >= h){
			iw = (thumnailHeight / h * w - thumnailWidth) / 2
			$(this).height(thumnailHeight);    // 高さをサムネイルに合わせる
			$(this).css("top", 0);
			$(this).css("left", "-"+iw+"px");  // 画像のセンター合わせ
		}

		// 縦長の画像の場合
		else{
			ih = (thumnailWidth / w * h - thumnailHeight) / 2
			$(this).width(thumnailWidth);      // 幅をサムネイルに合わせる
			$(this).css("top","-"+ih+"px");    // 画像のセンター合わせ
			$(this).css("left", 0);
		}
	});
}

// ページの先頭へ戻るボタン
function moveHeadButton(){
	var topButton = $('#pagetopbutton')
	topButton.hide();

	$(window).scroll(function(){
		if($(this).scrollTop()>100){
			// 画面を100pxスクロールしたらボタン表示
			topButton.fadeIn();
		}else{
			// 画面が100より上ならボタン表示はしない
			topButton.fadeOut();
		}
	});

	topButton.on('click', function(){
		$('body,html').animate({
			scrollTop: 0},500);
		    return false;
		});
}

// フィルタ検索機能(ジャンル)
function searchCategory(){

	var param = $('#SearchAndFilter').serializeArray();
	//alert(JSON.stringify(param));

	// 必要な情報はチェックボックスの状態
	data = {
		'model'  : 'illustration',
		'action' : 'index',
		'list'   :  param
	};

	$.ajax({
		url      : '../../api/controller.php',
		type     : 'POST',
		dataType : 'json',
		data     :  data,
		timeout  :  1000,
	}).done(function(data, dataType){
		$('.item').remove();

		for(var index = 0; index < data.length; index++){
    		var result = data[index].img.replace('view/', '');
    		/*$('.masonry').append($('<div></div>').attr({'id':'illustid_'+data[index].id, 'class':'item', 'name':'illustration'})
    					.append($('<a></a>').attr({'onclick':'openLightbox('+data[index].id+',"'+result+'")'})
    					.html(  '<img src="'+result+'"'+ 'alt="'+data[index].imgname+'">')
    		            .append($('<p></p>').html(data[index].imgname));*/
    		$('.masonry').append($('<div></div>').attr({'id':'illustid_'+data[index].id, 'class':'item', 'name':'illustration'})
				     .append($('<a></a>').attr({'onclick':'openLightbox('+data[index].id+',"'+result+'")'})
				     .html('<img src="'+result+'"'+
		            	   'alt="'+data[index].imgname+'">'))
		             .append($('<p></p>').html(data[index].imgname)));
    	}

        triming();
        $('.masonry').append($('<div></div>').attr({'class': 'cle' }));
    	$('.masonry').masonry({itemSelector: '.item', columnWidth: 300 });
	}).fail(function(){
		alert('NoData');
	});
}

function moveMypage(){
	location.href = "../html/mypage.html";
}

// チェックボックス
function checkBox(id){
	if($('input[value="'+id+'"').prop('checked') == true){
		for(var index = 1; index <= id; index++){
			$('input[value="'+index+'"]').prop('checked', true);
		}
	}else{
		for(var index = 5; index >= id; index--){
			$('input[value="'+index+'"]').prop('checked', false);
		}
	}
}
