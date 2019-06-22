function update() {
    if (!$("#frmUser").valid()) {
        return;
    }

    var data = getInput();

    $.ajax({
        type: "POST",
        url: "/User/Edit",
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

function save() {
    if (!$("#frmUser").valid()) {
        return;
    }

    var data = getInput();

    $.ajax({
        type: "POST",
        url: "/User/Entry",
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

function setValidationRule() {
    $("#frmUser").validate({
        ignore: "",
        rules: {
            txtName: {
                required: true,
                maxlength: 500
            },
            txtPassword: {
                required: true,
            },
        }
    });
}

function getInput() {
    var data = JSON.stringify({
        "Id": $("#hidId").val(),
        "Version": $("#hidVersion").val(),
        "Name": $("#txtName").val(),
        "Password": $("#txtPassword").val(),
    });

    return data;
}

