
// デザイナー一覧ページ
$(function(){
	Initialize();
});

// 初期化
// デザイナー一覧を表示している
function Initialize(){
	data = {
		'model'  : 'user',
		'action' : 'index',
		'list'   : 'a'
	};

	$.ajax({
		type:'POST',
		url:'../../api/controller.php',
		dataType:'json',
		data:data,
		timeout:1000,
	}).done(function(data, dataType){
		for(var index = 0; index < data.length; index++){
			var result = data[index].img.replace('view/', '');
			var id = data[index].id;
			$('#listbox').append($('<li></li>')
					     .append($('<a></a>').attr({'onclick':'moveDesignerDetails('+id+')'})
					    		 .html('<img src="'+result+'"'+ 'alt="'+data[index].imgname+'">'))
					     .append($('<div></div>').attr({'class':'createname'}).html(data[index].imgname))
					     .append($('<p></p>').html(data[index].userName))

			);
		}
		//alert(data.length);
	}).fail(function(XMLHttpRequest, textStatus, errorThrown){
		alert('n');
	});
}

// 制作者検索
function searchDesigner(){

}

// 制作者詳細へ移動
// 引数・・・制作者ID
function moveDesignerDetails(id){
	var param = id;
	location.href = "../html/designerdetails.html?"+param;
}