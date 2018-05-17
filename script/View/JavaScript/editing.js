$(function() {

	var m_id;

	// 初期化処理
	Iniialize();

	$('#editButton').on("click", CheckInputData);

	$('#backButton').on("click", function() {
		window.history.back();
	});


});

// 初期化処理
// 編集する顧客のIDから情報を設定する
function Iniialize() {

	var def = new $.Deferred();
	def.resolve();

	def.promise()
	.then(function() {
	    GetCompanies();
	})
	.then(function() {
	    GetId();
	})
	.then(function() {
		InputCustomerData();
	});


}

// 選択された顧客のIDを取得
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

// 顧客情報を取得し、入力する
function InputCustomerData() {

	var data = {'model':'Customer', 'action':'get', 'data':m_id};

	$.ajax({
		type: "POST",
		url: "/CustomerSystem/api/controller.php",
		data: data,
		dataType: "json",
	}).done(function(data) {
		for(var i=0;i<data.length;i++){
			console.log(data[i])

			// 情報の格納
			$('#inputLastName').val(data[i].last_name);
			$('#inputFirstName').val(data[i].first_name);
			$('#inputLastKana').val(data[i].last_kana_name);
			$('#inputFirstKana').val(data[i].first_kana_name);

			$('#inputEmail').val(data[i].email);

			if(data[i].phone != "null") {
				$('#inputPhone').val(data[i].phone);
			}

			// 性別
			var elements = document.getElementsByName("gender");
			var index = data[i].gender - 1;
			elements[index].checked = true ;

			// 生年月日
			var year = Math.floor(data[i].birthday / 10000);
			var month = data[i].birthday[4] +  data[i].birthday[5];
			var day = data[i].birthday[6] +  data[i].birthday[7];
			var birthday = year + "-" + month + "-" + day;
			$('#inputBirthday').val(birthday);

			// 所属会社
			document.getElementById("selectCompany").selectedIndex = data[i].company_id;
		}
	}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
		alert("edit_error:" + errorThrown);
	});
}



function CheckInputData(){
	var message = "";

	// 名前
	var lastNameArray = $('#inputLastName').val();
	var firstNameArray = $('#inputFirstName').val();

	if(lastNameArray.length == 0 || firstNameArray.length == 0) {
		message += "名前 : 空白です\n";
	} else {
		for(var i=0; i<lastNameArray.length; i++) {
			if(lastNameArray[i].match(/^[ａ-ｚ Ａ-Ｚ 0-9 ０-９ ！-？ !-& (-/  :-@ ¥・”’|[-` {-~ ]+$/))
			{
				message += "名前 : 全角英語、数字、記号は使えません。\n";
				break;
			}
		}

		for(var i=0; i<firstNameArray.length; i++) {
			if(firstNameArray[i].match(/^[ａ-ｚ Ａ-Ｚ 0-9 ０-９ ！-？ !-& (-/  :-@ ¥・”’|[-` {-~ ]+$/))
			{
				if(message == "") {
					message += "名前 : 全角英語、数字、記号は使えません。\n";
					break;
				}
			}
		}
	}

	// フリガナ
	var lastKana = $('#inptLastKana').val();
	var firstKana = $('#inputFirstKana').val();

	if(lastKana == "" || firstKana == "") {
		message += "フリガナ : 空白です\n";
	}
	else if(!lastKana.match(/^[\u30a0-\u30ff]+$/) || !firstKana.match(/^[\u30a0-\u30ff]+$/))
	{
		message += "フリガナ : 全角カタカナで入力してください。\n";
	}
	else {

	}

	// メールアドレス
	var address = $('#inputEail').val();
	if(address != "" &&
	   !address.match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)*.([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/))
	   // !address.match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/))
	{
		message += "メールアドレス : 使用できない文字、文法。または、＠や.がありません。\n";
	}

	// 電話番号
	var phone = $('#inputPhone').val();
	if(phone != "" && !phone.match(/^[0-9]+$/)){
		message += "電話番号 : 使用できない文字があります。\n";
	}

	// 性別
	if($('[name=gender]:checked').val() === undefined){
		message += "性別 : どちらかを選択してください。\n";
	}


	// 生年月日
	if($('#inputBirthday').val() == ""){
		message += "生年月日 : 生年月日を入力してください。\n";
	}

	// 所属会社
	if($('#selectCompany').val() == ""){
		message += "所属会社 : 所属会社を選択してください。\n";
	}


	if(message == "") {
		if(window.confirm('情報を登録しますか？')){

			var param = $('#editForm').serializeArray();
			var dataArray = {id:m_id, param:param};
			var data = {'model':'Customer', 'action':'edit', 'data':dataArray};

			$.ajax({
				type: "POST",
				url: "/CustomerSystem/api/controller.php",
				data: data,
				dataType: "json",
			}).done(function(data) {
				if(data == "faled") {
					alert("登録に失敗しました。");
				}
				else {
					alert("登録に成功しました。");
					window.location.href = 'list.html';
				}
				console.log(data);
			}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
				alert("edit_error:" + errorThrown);
			});
		}
		else{

		}
	} else {
		alert(message);
	}
}