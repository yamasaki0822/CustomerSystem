
// 一ページ当たりの表示数
const DRAW_COUNT = 10;

$(function() {

	var m_pageNo;			// 現在のページ数
	var m_pageMax;			// 最大ページ数
	var m_serchConditions;	// 検索する条件
	var getData;			// jsonで取得したデータ

	// 初期化処理
	Iniialize();

	var date = new Date();
	var year =date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var zero;
	var today = year + "-" + month + "-" + day;
	console.log(today);


	// 画面の切り替え
	// ホーム画面
	$('#homeButton').on("click", {value : 'home'}, ChangeScene);
	// 新規登録画面
	$('#addButton').on("click", {value : 'add'}, ChangeScene);
	// 編集画面
	$(document).on("click", ".editButton", {value : 'editing'}, ChangeScene);
	// 削除画面
	$(document).on("click", ".deleteButton", {value : 'delete'}, ChangeScene);

	$('#listButton').on("click", {value : 'list'}, ChangeScene);


	// 検索ボタン
	$('#serchButton').on("click", SerchData);

	// IDのソートボタン
	$('#sortIdButton').on("click", {value:'#sortIdButton', name:'id'}, ChangeSortButton);
	//名前のソートボタン
	$('#sortNameButton').on("click", {value:'#sortNameButton', name:'last_kana_name'}, ChangeSortButton);

	// ページャーボタン
	$('#pageBack').on("click", {value: -1}, UpdatePage);	// 一つ前のページ
	$('#pageNext').on("click", {value: 1}, UpdatePage);		// 一つ後のページ
	$('#jumpButton').on("click", JumpPage);					// 特定のページへ
});


// -------------------------------------------------------------
// 初期化処理
// -------------------------------------------------------------
function Iniialize() {

	// 初期化
	m_pageNo = 1;

	// Deferredオブジェクトの生成
	var def = new $.Deferred();

	// 状態を強制的にrosolveにする
	// 本来はエラーかどうかで変更するべき
	def.resolve();

	// 直列処理の実行
	def.promise()
	.then(function() {
		// 所属会社のプルダウンメニューを作成
	    GetCompanies();
	})
	.then(function() {

		// 渡すデータの設定
		var param = $('#listForm').serializeArray();
		var dataArray = {param:param, target:'id', state:'asc'};
		var data = {'model':'Customer', 'action':'serch', 'data':dataArray};

		// 検索内容の保存(別のやり方を検討)
		m_serchConditions = param;

		// 顧客情報の取得
		GetCustomers(data);
	});


}
// -------------------------------------------------------------
//
// -------------------------------------------------------------

// -------------------------------------------------------------
// 検索しデータの取得
// -------------------------------------------------------------
function SerchData() {

	m_pageNo = 1;

	// 全角半角数字、記号のチェック
	if(CheckInputData()){

		// 渡すデータの設定
		var param = $('#listForm').serializeArray();
		var dataArray = {param:param, target:'id', state:'asc'};
		var data = {'model':'Customer', 'action':'serch', 'data':dataArray};

		// 検索内容の保存(別のやり方を検討)
		m_serchConditions = param;

		// 顧客情報の取得、表示
		GetCustomers(data);
	}

	// ソートボタンの初期化
	$('#sortIdButton').val("▲");
	$('#sortNameButton').val("―");

	document.getElementById("pageNumber").innerText = m_pageNo;
}
// -------------------------------------------------------------
//
// -------------------------------------------------------------


// 顧客情報の取得
function GetCustomers(_data) {

	console.log(_data);

	$.ajax({
		type: "POST",
		url: "/CustomerSystem/api/controller.php",
		data: _data,
		dataType: "json",
	}).done(function(data) {
		console.log(data);

		getData = data;
		DeleteLines();

		// 顧客情報の表示(nullが返ってきたときのエラーチェック)
		if(data != null) {
			// ページ数の計算
			m_pageMax = Math.ceil(data.length / DRAW_COUNT);
			DisPlayData(data);
			DrawPageButtons();
		}
	}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
		alert("add_error:" + errorThrown);
	});
}

// 顧客情報の表示
function DisPlayData(_data) {

	// 初期値、限界値の設定
	var num = m_pageNo * DRAW_COUNT;
	var startNum = num - DRAW_COUNT;
	var limit = Math.min(num, _data.length);

	// テーブル内の行(顧客情報)を削除
	DeleteLines();

	for(var i= startNum; i<limit; i++) {
		// ID
		var id = _data[i].id;

		// 名前
		var name = _data[i].last_name + "&nbsp" + _data[i].first_name;
		var kana = _data[i].last_kana_name + "&nbsp" + _data[i].first_kana_name;
		var names = kana + "<br>" + name;

		// メールアドレス、電話番号
		if(_data[i].email == "") {
			_data[i].email = "-----------------";
		}
		// 電話番号がnull、0なら表示しない
		if(_data[i].phone == null || _data[i].phone == "null") {
			_data[i].phone = "-----------------";
		}
		var contacts = _data[i].email + "<br>" + _data[i].phone;

		// 所属会社名
		var company = _data[i].company_name;

		// 登録、更新日時
		if(_data[i].updated_at == null) {
			_data[i].updated_at = "-----------------";
		}
		var logs = _data[i].created_at + "<br>" + _data[i].updated_at;

		// 編集、削除ボタン
		var editButton = '<button class="editButton" type="button" value=' + id + '>'+
							'<font size="2">編集</font></button>';
		var deleteButton = '<button class="deleteButton" type="button" value=' + id + '>'+
							'<font size="2">削除</font></button>';

		$('#customersTable').append(
			$('<tr>').append(
				$('<td colspan="2">').append(id).addClass('id'),
				$('<td colspan="2">').append(names).addClass('names'),
				$('<td>').append(contacts).addClass('contacts'),
				$('<td>').append(company).addClass('company'),
				$('<td>').append(logs).addClass('logs'),
				$('<td>').append(editButton).addClass('edit'),
				$('<td>').append(deleteButton).addClass('delete')
			)
		);
	}
}


// 画面遷移
function ChangeScene(_event) {

	// IDの取得
	var id = $(this).val();
	var url;

	// value値が空白かどうかを調べる
	if(id == "") {
		url = _event.data.value + '.html';
	} else {
		// 選択した顧客のIDをURLに追加
		var data= "id=" + id;
		url = _event.data.value + '.html?' + data;
	}
	window.location.href = url;
}

// 検索項目の入力ミスの確認
function CheckInputData(){
	if(($('#lastNameData').val().match(/^[\u30a0-\u30ff]+$/) ||
	    $('#lastNameData').val() == "") &&
	   ($('#firstNameData').val().match(/^[\u30a0-\u30ff]+$/) ||
	    $('#firstNameData').val() == "")) {
		return true;
	}
	else {
		alert("全角カタカナで入力してください。");
		return false;
	}


}

//-----------------------------------------------------------------------------------

// ソート
function ChangeSortButton(_event){
	var target;		// ソートするカラム
	var state;		// 昇順、降順

	// 表示文字とソート内容の保存
	if($(_event.data.value).val() == "▼" || $(_event.data.value).val() == "―") {
		$(_event.data.value).val("▲");
		target = _event.data.name;
		state = 'asc';
	}else {
		$(_event.data.value).val("▼");
		target = _event.data.name;
		state = 'desc';
	}

	if(_event.data.value == '#sortIdButton') {
		$('#sortNameButton').val("―");
	}
	else {
		$('#sortIdButton').val("―");
	}


	var dataArray = {param:m_serchConditions, target:target, state:state};
	var data = {'model':'Customer', 'action':'serch', 'data':dataArray};

	// データの取得
	GetCustomers(data);

	// ページ番号を1に戻す
	m_pageNo = 1;
	document.getElementById("pageNumber").innerText = m_pageNo;
}

//-----------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------

// 表示ページの更新
function UpdatePage(_event){
	m_pageNo += _event.data.value;
	document.getElementById("pageNumber").innerText = m_pageNo;
	DrawPageButtons();
	DisPlayData(getData);
}

// 特定ページへの更新
function JumpPage(){
	var pageNo = $('#inputPageNumber').val();

	// 未入力、数値かのチェック
	if(pageNo == "" || isNaN(pageNo)) {
		$('#inputPageNumber').val("");
		return false;
	} else {
		// 領域外の値を戻す
		if(pageNo <= 0) {
			pageNo = 1;
		}
		else if(pageNo >= m_pageMax) {
			pageNo = m_pageMax;
		} else {
			// val()で取得した値が文字になっているため数値に変換
			pageNo = Number(pageNo);
		}

		m_pageNo = pageNo;

		// 表示テキスト更新
		document.getElementById("pageNumber").innerText = m_pageNo;
		// 入力値のクリア
		$('#inputPageNumber').val("");

		DisPlayData(getData);
	}
	DrawPageButtons();
}

// ページャーのボタン表示、非表示
function DrawPageButtons(){
	if(m_pageMax == 1) {
		$("#pageBack").prop("disabled", true);
		$("#pageNext").prop("disabled", true);
	}
	else if(m_pageNo == 1) {
		$("#pageBack").prop("disabled", true);
		$("#pageNext").prop("disabled", false);
	}
	else if(m_pageNo == m_pageMax){
		$("#pageBack").prop("disabled", false);
		$("#pageNext").prop("disabled", true);
	}
	else {
		$("#pageBack").prop("disabled", false);
		$("#pageNext").prop("disabled", false);
	}
}

//-----------------------------------------------------------------------------------

//テーブルの削除
function DeleteLines() {
	var table = document.getElementById("customersTable");
    var len = table.rows.length;

    for (var i = len-1; i > 0; i--) {
        table.deleteRow(1);		// 0を選択すると、<th>が削除される
    }
}
