
// デザイナー新規登録ページ
$(function(){

});

// 新規登録ページ情報
// 登録ボタン押したとき
function inputRegistrationButton(){

	// バリデーションチェックの関数を呼び出す
	//checkValidation();


	data = new FormData($('#previewform').get(0));
	data.append('model', 'user');
	data.append('action', 'register');

	var param = [ $('#username').val(), $('#password').val() ];
	data.append('list', param);

    $.ajax({
    	url         : '../../api/controller.php',
    	type        : 'POST',
    	dataType    : 'json',
    	processData : false,
    	contentType : false,
    	data        :  data,
    	timeout     :  1000,
    }).done(function(data, dataType){
    	location.href = "../html/index.html";
        alert(data);
    }).fail(function(){
    	alert('Nodata');
    });
}

// 一覧画面へ移動
function moveIndex(){
    location.href = "../html/index.html";
}

// Vue.jsの処理
new Vue({
	el: '#previewbox',
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
			triming();
		},
		// アップロードした画像を表示
		createImage(file){
			var reader = new FileReader();
			reader.onload = (e) => {
				// まずは表示
				this.uploadedImage = e.target.result;
			};
			reader.readAsDataURL(file);
		},
	},
})

//トリミング
function triming(){

	var resizeClass    = '.item img';
	var thumnailWidth  = 200;
	var thumnailHeight = 200;
	//var iw, ih;

	$(resizeClass).each(function(){

		/*var w = $(this).width();
		var h = $(this).height();

		if(w >= h){
			iw = (thumnailHeight/h*w-thumnailWidth)/2
			$(this).height(thumnailHeight);
			$(this).css("top",0);
            $(this).css("left","-"+iw+"px");
		}
		else{
			ih = (thumnailWidth/w*h-thumnailHeight)/2
			$(this).css("top","-"+ih+"px");
            $(this).css("left",0);
		}*/

		//====固定値====
		$(this).height(thumnailHeight);
		$(this).width(thumnailWidth);
		$(this).css("height", 200+"px");
		$(this).css("top", -60+"px");
		$(this).css("width", 200+"px");
		$(this).css("left", -70+"px");
        //==============
	});
}

// トリミング
/*function triming(img){
	// class="previewbox"のimgタグに適用
	var $image = $('.previewbox > img'),replaced;

	// 何か適用している
	//console.log($image);

	//console.log(img.images);

	// crop options
	$(img.images).cropper({ aspectRatio : 4 / 4 });


    //var data = $('#img').cropper('onFileChange');
	var data = $(img.images).cropper('onFileChange');

    console.log(data);

    console.log(data.width);
    console.log(data.height);
    console.log(data.x);
    console.log(data.y);

    // 切り抜きした画像のデータ
    // このデータを元に画像の切り抜きが行われる
    var image = {
    		width  : Math.round(data.width),
    		height : Math.round(data.height),
    		x      : Math.round(data.x),
    		y      : Math.round(data.y)
    };

    return image;
}
}*/

/*var vm =  new Vue({
		el: '#previewbox',
	data: {
		message: '',
		inputMessage: ''
	},
	methods: {
		// getMessageを発火させると文字列が代入される
		getMessage: function(){
			this.message = this.inputMessage
		}
	  }
	})*/

/*new Vue({
	el: '#previewbox',
	data: {
		message: 'TEST'
	}
})*/


// バリデーションチェック
function checkValidation(){

    validationName();
    validationPassword();
}

// ユーザ名
function validationName(){

	var name = "";

	if(name != ""){
		if(!name.match(/^[\u3040-\u30ff\u30a0-\u30ff\u30e0-\u9fcf]+$/)){
    		alert('ユーザ名 : 全角文字のみです');
    	}
	}else{
		alert('ユーザ名 : 空白文字が入っています。');
	}
}

// パスワード
function validationPassword(){

	var password = "";

	if(password.length < 8){
		alert('パスワード : 最低8文字必要です。');
	}
}
