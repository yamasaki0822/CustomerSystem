
// デザイナー詳細ページ
$(function(){
    Initialize();
});

/*// 初期化
function Initialize(){
	// アドレスの「?」以降のパラメータを取得
	var adrsid = location.search;
	// 先頭の「?」をカット
	adrsid = adrsid.substring(1);
	id = unescape(adrsid);

	data = {
		'model'  : 'designer',
		'action' : 'info',
		'list'   : id
	};

	$.ajax({
		url      : '/dils/api/controller.php',
		type     : 'POST',
		dataType : 'json',
		data     :  data,
		timeout  :  1000,
	}).done(function(data, dataType){
		// ここで値を取得し、表示する
		//alert('Success');
	}).fail(function(){
		alert('NoData');
	});
}*/

// 初期化処理
function Initialize(){

	// URLからIDの取得
	var id = location.search;

	CreateCategory().then(function(){
		return InitIllust(id);
	}).then(function(){
		//alert('a');
	}).catch(function(){
		alert('n');
	});

	if(id.charAt(0) == '?'){
    	id = id.substring(1);
        $('#loginlink').html('<li></li>').attr({'id':'mypagelink'})
                       .html('<a href="mypage.html?'+id+'">MYPAGE</a>');
    }


}

// カテゴリーボックスの生成
function CreateCategory(){

	return new Promise(function(resolve, reject){
	    var data = {
	    		'model'  : 'category',
	    		'action' : 'info',
	    		'list'   : null,
	    };

	    $.ajax({
	    	type:'POST',
			url:'../../api/controller.php',
			dataType:'json',
			data:data,
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

// ユーザー情報と作品一覧の表示
function InitIllust(_id){

	return new Promise(function(resolve, reject){

		var param = {'id' : 21, 'array' : $('#SearchAndFilter').serializeArray()};
	    var data = {
	    	'model'  : 'user',
	    	'action' : 'illustIndex',
	    	'list'   :  param,
	    }

	    //console.log(param);

	    $.ajax({
	    	url      : '../../api/controller.php',
	    	type     : 'POST',
	    	dataType : 'json',
	    	data     :  data,
	    	timeout  :  1000,
	    }).done(function(data, dataType){
	    	console.log(data);
	    	//===ただの表示===
	    	/*for(var index = 0; index < data.length; index++){
	    		var result = data[index].img.replace('view/', '');
	    		$('.masonry').append($('<div></div>').attr({'id':'illustid_'+data[index].id, 'class':'item', 'name':'illustration'})
	    				     .append($('<a></a>').attr({'onclick':'openLightbox('+data[index].id+',"'+result+'")'})
	    				     .html('<img src="'+result+'"'+
	    		            	   'alt="'+data[index].imgname+'">'))
	    		             .append($('<p></p>').html(data[index].imgname)));


	    	}
	        //================

	    	triming();
	    	$('.masonry').append($('<div></div>').attr({'class': 'cle' }));
	    	$('.masonry').masonry({itemSelector: '.item', columnWidth : 300 });
	    	*/
	    	resolve();
	    	//===============
	    }).fail(function(){
	    	alert('NoData');
	    	reject();
	    });
	});
}

// 前のページへ移動(戻るボタン)
function moveBackButton(){
	location.href = "/dils/view/html/designerindex.html";
}

// ソート時のボタン(非同期)
function sortButton(){
	var param = "";

	data = {
		'model'  : 'indexsort',
		'action' : 'sort',
		'list'   :  param
	};

	$.ajax({
		url      : '/dils/api/controller.php',
		type     : 'POST',
		dataType : 'json',
		data     :  data,
		timeout  :  1000,
	}).done(function(data, dataType){
		alert('Success');
	}).fail(function(){
		alert('NoData');
	});
}

//フィルタ検索機能(ジャンル)(非同期)
function searchCategory(){

	var category = $('#category_id').val();

	$.ajax({
		url      : '/dils/api/controller.php',
		type     : 'POST',
		dataType : 'json',
		data     :  data,
		timeout  :  1000,
	}).done(function(data, dataType){
		alert('Success');
	}).fail(function(){
		alert('NoData');
	});
}

// イラストが選択された後の処理
function selectIllustration(){

}
