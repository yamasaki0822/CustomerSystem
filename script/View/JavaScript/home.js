$(function() {

	// 初期化処理
	Iniialize();

	// IDが"button"のボタンをクリックすることで
	// 指定されたところに遷移する
	$('#button').on("click", function() {
		// list.htmlがリンク先になる
		location.href = 'list.html';
	});
});

//初期化処理
function Iniialize() {

}
