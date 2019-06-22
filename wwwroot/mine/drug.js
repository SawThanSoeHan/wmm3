function save() {
    if (!$("#frmDrug").valid()) {
        return;
    }

    var data = getInputData();

    $.ajax({
        type: "POST",
        url: "/Drug/Entry",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: data,
        cache: false,
        success: function (data) {
            if (data == "duplicated") {
                $("#pMessage").text("Name or description are duplicated.");
                $("#divError").modal('toggle');
            } else {
                $("#divSuccess").modal('toggle');
            }
        },
        error: function (xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function update() {
    if (!$("#frmDrug").valid()) {
        return;
    }

    var data = getInputData();

    $.ajax({
        type: "POST",
        url: "/Drug/Edit",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: data,
        cache: false,
        success: function (data) {
            if (data == "changed_by_another") {
                $("#pMessage").text("The data is changed by another person. Please confirm the updated data firtly.");
                $("#divError").modal('toggle');
            } else if (data == "duplicated") {
                $("#pMessage").text("Name or description are duplicated.");
                $("#divError").modal('toggle');
            } else {
                $("#divSuccess").modal('toggle');
            }
        },
        error: function (xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function setValidationRule() {
    $("#frmDrug").validate({
        ignore: "",
        rules: {
            txtName: {
                required: true,
            },
            txtDescription: {
                required: true,
            },
        }
    });
}

function getInputData() {
    var data = JSON.stringify({
        "Id": $("#hidId").val(),
        "Version": $("#hidVersion").val(),
        "Name": $("#txtName").val(),
        "Description": $("#txtDescription").val(),
        "ParentId": $("#hidParentCategoryId").val(),
        "Type": $("#hidCodeType").val(),
    });

    return data;
}


