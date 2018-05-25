
// イラスト追加ページ
$(function(){


});

// イラスト追加ボタン
function inputInsert(){

	var param = "";

	data = {
		'model'  : 'insert',
		'action' : 'insert',
		'list'   :  param
	};

	$.ajax({
		url      : '/dils/api/controller.php',
		type     : 'POST',
		dataType : 'json',
		data     :  data,
		timeout  :  1000,
	}).done(function(data, dataType){
		location.href = "/dils/html/index.html";
		alert('Success');
	}).fail(function(){
		alert('NoData');
	});
}

// 戻るボタン
function inputBackButton(){
	location.href = "/dils/html/index.html";
}

// 画像が最低1枚入っているかチェック
function checkImgHandle(){

}
