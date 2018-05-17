$(function() {

	var m_id;

	// 初期化処理
	Iniialize();

	// 削除ボタン
	$('#deleteButton').on("click", DeleteData);

	// 戻るボタン
	$('#backButton').on("click", function() {
		window.history.back();
	});
});

//初期化処理
function Iniialize() {

	var def = new $.Deferred();
	def.resolve();

	def.promise()
	.then(function() {
		GetId();
	})
	.then(function() {
		DisplayCustomer();
	});


}

function DeleteData() {
	if(window.confirm('この顧客情報を削除しますか？')){

		var data = {'model':'Customer', 'action':'delete', 'data':m_id};

		$.ajax({
			type: "POST",
			url: "/CustomerSystem/api/controller.php",
			data: data,
			dataType: "json",
		}).done(function(data) {
			if(data == "faled") {
				alert("削除に失敗しました。");
			} else {
				alert("削除に成功しました。\n一覧画面に戻ります。");

				// このあとに検索に戻るなり、データを消すなりする
				window.location.href = 'list.html';
			}
			console.log(data);
		}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
			alert("edit_error:" + errorThrown);
		});
	}
	else{

	}
}

//選択された顧客のIDを取得
function GetId() {
	// アドレスの「?」以降の引数(パラメータ)を取得
	var pram = location.search;

	// 引数がない時は処理しない
	if (!pram) {
		return false;
	}

	// 先頭の?をカット
	pram = pram.substring(1);

	// 「&」で引数を分割して配列に
	var pair = pram.split("&");

	var temp = "";
	var key = new Array();
	for (var i=0; i < pair.length; i++) {

		// 配列の値を「=」で分割
		temp=pair[i].split("=");
		keyName=temp[0];
		keyValue=temp[1];

		// キーと値の連想配列を生成
		key[keyName]=keyValue;
	}

	if (!key["id"] || key["id"]==""){
		m_id="";
 	}else{
 		m_id=key["id"];
	}
}

// 顧客情報の表示
function DisplayCustomer() {

	console.log(m_id);
	var data = {'model':'Customer', 'action':'get', 'data':m_id};
	$.ajax({
		type: "POST",
		url: "/CustomerSystem/api/controller.php",
		data: data,
		dataType: "json",
	}).done(function(data) {
		for(var i=0;i<data.length;i++){
			console.log(data[i]);

			WriteData("deleteLastName", data[i].last_name);
			WriteData("deleteFirstName", data[i].first_name);
			WriteData("deleteLastKana", data[i].last_kana_name);
			WriteData("deleteFirstKana", data[i].first_kana_name);
			WriteData("deleteEmail", data[i].email);

			if(data[i].phone != "null") {
				WriteData("deletePhone", data[i].phone);
			}

			if(data[i].gender == 1) {
				WriteData("deleteGender", "男");
			} else {
				WriteData("deleteGender", "女");
			}

			var year = Math.floor(data[i].birthday / 10000);
			var month = data[i].birthday[4] +  data[i].birthday[5];
			var day = data[i].birthday[6] +  data[i].birthday[7];
			var birthday = year + "年" + month + "月" + day + "日";
			WriteData("deleteBirthday", birthday);

			WriteData("deleteCompany", data[i].company_name);
		}
	}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
		alert("edit_error:" + errorThrown);
	});
}

// 情報の入力
function WriteData(_id, _text) {
	document.getElementById(_id).innerText = _text;
}
