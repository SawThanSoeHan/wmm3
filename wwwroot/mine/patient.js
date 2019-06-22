function save() {
    if (!$("#frmPatient").valid()) {
        return;
    }

    var data = getPatient();

    $.ajax({
        type: "POST",
        url: "/Patient/Entry",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: data,
        cache: false,
        success: function (data) {
            if (data == "duplicated") {
                $("#pMessage").text("Patient code is duplicated.");
                $("#divError").modal('toggle');
            } else {
                $("#spnPatientCode").text(data);
                $("#divSuccess").modal('toggle');
            }
        },
        error: function (xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function update() {
    if (!$("#frmPatient").valid()) {
        return;
    }

    var data = getPatient();

    $.ajax({
        type: "POST",
        url: "/Patient/Edit",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: data,
        cache: false,
        success: function (data) {
            if (data == "changed_by_another") {
                $("#pMessage").text("The data is changed by another person. Please confirm the updated data firtly.");
                $("#divError").modal('toggle');
            } else if (data == "duplicated") {
                $("#pMessage").text("Patient code is duplicated.");
                $("#divError").modal('toggle');
            } else {
                $("#spnPatientCode").text(data);
                $("#divSuccess").modal('toggle');
            }
        },
        error: function (xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function setValidationRuleForPatient() {
    $("#frmPatient").validate({
        ignore: "",
        rules: {
            txtPatientCode: {
                required: true,
                maxlength: 100
            },
            txtName: {
                required: true,
                maxlength: 500
            },
            txtAge: {
                required: true,
            },
            txtDOB: {
                required: true,
                date: true,
            },
        }
    });
}

function getPatient() {
    var data = JSON.stringify({
        "Id": $("#hidId").val(),
        "Version": $("#hidVersion").val(),
        "PatientCode": $("#txtPatientCode").val(),
        "Name": $("#txtName").val(),
        "Age": $("#txtAge").val(),
        "DOB": $("#txtDOB").val().replace(/-/g, "").replace(/ /g, "").replace(/:/g, ""),
        "Sex": $('input:radio[name=sex]:checked').val(),
        "City": $("#selCity").val(),
        "FullAddress": $("#txtFullAddress").val(),
    });

    return data;
}

