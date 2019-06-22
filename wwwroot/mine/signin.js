function enter(e) {
    var key = e.which | e.keyCode;
    if (key == 13)  // the enter key code
    {
        signin();
    }
}

function signin() {
    if (!$("#frmSignIn").valid()) {
        return;
    }

    var data = getInputData();

    $.ajax({
        type: "POST",
        url: "/User/SignIn",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: data,
        cache: false,
        success: function (data) {
            if (data) {
                $("#spnMessage").text(data);
                $("#divAlert").toggle();
            }
            else {
                document.location = '/Reporting/Dashboard';
            }
        },
        error: function (xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function setValidationRule() {
    $("#frmSignIn").validate({
        ignore: "",
        rules: {
            txtUserName: {
                required: true,
            },
            txtPassword: {
                required: true,
            },
        }
    });
}

function getInputData() {
    var data = JSON.stringify({
        "UserName": $("#txtUserName").val(),
        "Password": $("#txtPassword").val(),
    });

    return data;
}

