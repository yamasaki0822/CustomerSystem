
$(function(){

	$('.illustbox').on('click', '.imgbox', function(){

		//alert('aaa');
	    var id = $(this).attr("id");


	    viewInitialize(id);
	    $(".lightbox_view").fadeIn(100);

	});

	$(".close").click(function(){

	    $(".lightbox_view").fadeOut(100);

	});
});

// 初期化(編集画面での表示)
function viewInitialize(illustid){
	// アドレスの「?」以降のパラメータを取得
    var id = location.search;
    id = id.substring(1);

    alert('!!');

    var param={ 'user' : id, 'illust' : illustid };

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
    	for(var index = 0; index < 20; index++){
            $('.illustbox').append($('<li></li>')
                          .append($('<div></div>').attr({'class': 'imgbox'}))
                          .append($('<div></div>').attr({'class': 'textbox'})
                          .append($('<p>作品タイトル</p>'))
                          .append($('<p>カテゴリー</p>').attr({'class':'category'}))));

        }
    	//alert('Success');
    }).fail(function(){
    	alert('Nodata');
    });
}

// ライトボックスを開く
function openLightbox(id,pass){

	data = {
		'model'  : 'evaluation',
		'action' : 'index',
		'list'   :  id
	}

	//alert(JSON.stringify(id));

	$.ajax({
        url      : '../../api/controller.php',
        type     : 'POST',
        dataType : 'json',
        data     :  data,
        timeout  :  1000,
	}).done(function(data, dataType){
		$('.imgbox').append('<img class="lightboxview" id="lightboxid_"'+id+'"  src="'+pass+'">')
		$(".lightbox_view, #lightboxid_"+id+"").fadeIn();   // 第1引数・・・背景？(class)  第2引数・・・拡大写真(class)
		$('body').addClass("overflow");
		lightboxtriming();

		var intaverage = Math.floor(data[0].review);

		for(var index = 0; index < data.length; index++){
			$('.commentbox').append($('<dl class="lightboxview"></dl>')
                            .append($('<dt></dt>').html(data[index].created_at))
                            .append($('<dd></dd>').html(data[index].comment)));
		}

		var intaverage =  6 - Math.floor(data[0].review);
		if(intaverage != 6){
			$('#star'+intaverage+'').attr({'checked': 'checked'});
		}

		// 見えないようにしている
		$('.idmem').append($('<input type="radio" name="illustid" value="'+id+'" class="id" checked="checked" display:none>'));
	}).fail(function(){
        alert('no');
	})
}

function lightboxtriming(){
	var resizeClass    = '.imgbox img';
	var thumnailHeight = 700;
	var thumnailWidth  = 750;
	var iw, ih;

	$(resizeClass).each(function(){
		/*var w = $(this).width();   // 画像の幅(原寸)
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
		}*/

		//====固定値====
		$(this).height(thumnailHeight);
		$(this).width(thumnailWidth);
		$(this).css("height", 700+"px");
		$(this).css("top", 0);
		$(this).css("width", 750+"px");
		$(this).css("left", 0);
        //==============
	});
}

// 評価送信
function sendEvaluation(){
    var param = $('#sendeva').serializeArray();
    alert(JSON.stringify(param));

    data = {
    	'model'  : 'evaluation',
    	'action' : 'insert',
    	'list'   :  param
    };

    $.ajax({
    	type     : 'POST',
    	url      : '../../api/controller.php',
    	dataType : 'json',
    	data     :  data,
    	timeout  :  1000,
    }).done(function(data, dataType){
    	//alert('Success');
    }).fail(function(){
    	alert('Fail');
    });
}

// ライトボックスを閉じる
function closeLightbox(){
	var memid = $('.id').val();

	//alert(memid);
	$(".lightbox_view, #lightboxid_"+memid+"").fadeOut();
	$('.lightboxview').remove();
	$('.id').remove();
	$('body').removeClass("overflow");
}
