
$(function() {
	// GetCompanies();
});

// 所属会社のセレクトボックス作成
function GetCompanies() {
	var param = null;
	var data = {'model':'Company', 'action':'get'};

	$.ajax({
		type: "POST",
		url: "/CustomerSystem/api/controller.php",
		data: data,
		dataType: "json",
	}).done(function(data) {
		for(var i=0;i<data.length;i++){
		    let op = document.createElement("option");
		    op.value = data[i].id;
		    op.text = data[i].name;
		    document.getElementById("selectCompany").appendChild(op);
		  }
	}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
		alert("Companies_error:" + errorThrown);
	});
}

