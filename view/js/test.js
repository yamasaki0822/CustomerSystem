$(function() {

	$('#userButton').on("click", createUser);

	$('#loginButton').on("click", loginUser);

});

function createUser() {


	// ユーザーの新規登録
	var array = $('#userForm').serializeArray();
	var data ={'model':'user', 'action':'register', 'list':array};

	// 作品一覧取得
	//var test = {};
	//var data ={'model':'illustration', 'action':'index', 'list':test};

	// カテゴリー取得
	// var data ={'model':'category', 'action':'get', 'list':test};

	console.log(data);

	$.ajax({
		type: "POST",
		url: "/dils_test/api/controller.php",
		data: data,
		dataType: "json",
	}).done(function(data) {
		console.log(data);

	}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
		alert("error_:" + errorThrown);
	});
}

function loginUser() {


	// ユーザーのログイン
	var array = $('#userForm').serializeArray();
	var data ={'model':'user', 'action':'login', 'list':array};
	console.log(data);

	$.ajax({
		type: "POST",
		url: "/dils_test/api/controller.php",
		data: data,
		dataType: "json",
	}).done(function(data) {
		console.log(data);

	}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
		alert("error_:" + errorThrown);
	});
}