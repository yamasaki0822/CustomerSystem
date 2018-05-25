
// マイページ
$(function(){
    Initialize();
});

// 初期化
function Initialize(){
	// アドレスの「?」以降のパラメータを取得
    var id = location.search;
    id = id.substring(1);


    var param = { 'id' : id };

    data= {
    	'model'  : 'user',
    	'action' : 'illustIndex',
    	'list'   :  param
    }

    $.ajax({
    	url      : '../../api/controller.php',
    	type     : 'POST',
    	dataType : 'json',
    	data     :  data,
    	timeout  :  1000,
    }).done(function(data, dataType){
    	//$('#mypageicon').html('<img id="mypageicon" v-show>')
    	//alert(data);
    	var result = data[0].iconPath.replace('view/', '');
    	$('#mypagepreview').append($('<img src="'+result+'">'));
    	$('.penname').html(data[0].username);

    	alert(data.length);
    	for(var index = 0; index < data.length; index++){
            $('.illustbox').append($('<li></li>')
                          .append($('<div></div>').attr({'class': 'imgbox'})
                          .append($('<img src="'+result+'">')))
                          .append($('<div></div>').attr({'class': 'textbox'})
                          .append($('<p>作品タイトル</p>'))
                          .append($('<p>カテゴリー</p>').attr({'class':'category'}))));
        }



    	triming();
    	illusttriming();
    	//alert(JSON.stringify(data[0].username));
    }).fail(function(){
    	alert('Nodata');
    });
}

// イラストのライトボックスを開く(編集)
function openIllustLightbox(){

}

function editUserName(){
	var name = window.prompt("ユーザ名を入力してください","");

	$('.penname').html(name);
}

// アイコン
//Vue.jsの処理
new Vue({
	el: '#mypagebox',   // ここを変更
	data() {
		return {
			uploadedImage: '',
		};
	},
	methods: {
		onFileChange(e){
			var files = e.target.files || e.dataTransfer.files;
			if(!files.length)
				return;
			this.createImage(files[0]);
		},
		// アップロードした画像を表示
		createImage(file){
			var reader = new FileReader();
			reader.onload = (e) => {
				// まずは表示
				this.uploadedImage = e.target.result;
			};
			triming();
			reader.readAsDataURL(file);
		},
	},
})

//トリミング
function triming(){

	var resizeClass    = '.creatoricon img';
	var thumnailWidth  = 150;
	var thumnailHeight = 150;

	$(resizeClass).each(function(){

		$(this).height(thumnailHeight);
		$(this).width(thumnailWidth);
		$(this).css("height", 150+"px");
		$(this).css("top", 0);
		$(this).css("width", 150+"px");
		$(this).css("left", 0);

	});
}

function illusttriming(){

	var resizeClass = '.imgbox img';
	var thumnailWidth  = 150;
	var thumnailHeight = 150;

	$(resizeClass).each(function(){

		$(this).height(thumnailHeight);
		$(this).width(thumnailWidth);
		$(this).css("height", 150+"px");
		$(this).css("top", 0);
		$(this).css("width", 150+"px");
		$(this).css("left", 0);

	});
}

// アカウント編集登録
function sendAccountEdit(){

	//data = new FormData($('#mypageiconform').get(0));
	data = new FormData($('#mypageiconform').get(0));
	data.append('model', 'user');
	data.append('action', 'register');

	var id = location.search;
    id = id.substring(1);

	data.append('list', id);

    $.ajax({
    	url         : '../../api/controller.php',
    	type        : 'POST',
    	dataType    : 'json',
    	processData : false,
    	contentType : false,
    	data        :  data,
    	timeout     :  1000,
    }).done(function(data, dataType){
    	location.href = "../html/index.html?"+id;
        //alert(data);
    }).fail(function(){
    	alert('Nodata');
    });
}

// 編集画面へ
function moveEdit(){

	var id = location.search;
	id = id.substring(1);

	location.href = "../html/edit.html?"+id;
}

// 削除ボタンを押したとき
function inputDeleteButton(){
	// アドレスの「?」以降のパラメータを取得
    var id = location.search;
    id = id.substring(1);

    data= {
    	'model'  : 'mypage',
    	'action' : 'mypage',
    	'list'   :  id
    }

    $.ajax({
    	url      : '../../api/controller.php',
    	type     : 'POST',
    	dataType : 'json',
    	data     :  data,
    	timeout  :  1000,
    }).done(function(data, dataType){
        alert('Success');
    }).fail(function(){
    	alert('Nodata');
    });
}

