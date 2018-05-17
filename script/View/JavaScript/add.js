$(function() {

	// 初期化処理
	Iniialize();

	$('#addButton').on("click", CheckInputData);

	$('#backButton').on("click", function() {
		window.history.back();
	});
});

// 初期化処理
function Iniialize() {
	var def = new $.Deferred();
	def.resolve();

	def.promise()
	.then(function() {
	    GetCompanies();
	});
}

// 検索項目の入力ミスの確認
function CheckInputData(){
	var message = "";

	// 名前を配列に
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

	if(lastKana == "" || firstKana == ""){
		message += "フリガナ : 空白です\n";
	}
	else if(!lastKana.match(/^[\u30a0-\u30ff]+$/) ||
			!firstKana.match(/^[\u30a0-\u30ff]+$/)){
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

	// 登録内容の確認
	if(message == "") {
		if(window.confirm('登録しますか？')){

			// 渡すデータの設定
			var param = $('#addForm').serializeArray();
			var data = {'model':'Customer', 'action':'add', 'data':param};

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
					alert("登録に成功しました");

					window.location.href = 'list.html';
				}
				console.log(data);
			}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
				alert("add_error:" + errorThrown);
			});
		}
	} else {
		alert(message);
	}
}


