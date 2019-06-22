function update() {
    if (!$("#frmMasterCode").valid()) {
        return;
    }

    var data = getInput();

    $.ajax({
        type: "POST",
        url: "/MasterCode/Edit",
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
    if (!$("#frmMasterCode").valid()) {
        return;
    }

    var data = getInput();

    $.ajax({
        type: "POST",
        url: "/MasterCode/Entry",
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
    $("#frmMasterCode").validate({
        ignore: "",
        rules: {
            selCodeType: {
                required: true,
            },
            txtName: {
                required: true,
                maxlength: 500
            },
            txtDescription: {
                required: true,
            },
        }
    });
}

function getInput() {
    var data = JSON.stringify({
        "Id": $("#hidId").val(),
        "Version": $("#hidVersion").val(),
        "CodeType": $("#selCodeType").val(),
        "Name": $("#txtName").val(),
        "Description": $("#txtDescription").val(),
    });

    return data;
}


function fillData(codeTypeValue) {
    $("#selCodeType").val(codeTypeValue);
}

function refresh() {
    $('#tblMasterCodeList').DataTable().ajax.reload();
}

var tblMasterCode;
function bindGrid(id) {
    if (tblMasterCode) {
        tblMasterCode.destroy();
    }

    tblMasterCode = $(id).DataTable({
                    "processing": true,
                    "serverSide": true,
                    "info": true,
                    "filter": true,
                    "destory": true,
                    "pageLength": 50,
                    "responsive": true,
                    buttons: [
                        'pageLength'
                    ],
                    "ajax": {
                        "type": "POST",
                        "url": '/MasterCode/SelectList?codeType=' + $("#selCodeType").val(),
                        "contentType": 'application/json; charset=utf-8',
                        'data': function (data) { return data = JSON.stringify(data); },
                        cache: false,
                        'error': function (msg) {
                            document.write(msg.responseText);
                        }
                    },
                    "columns": [
                        { "data": "CodeType", },
                        { "data": "Name", },
                        { "data": "Description", },
                        {
                            "data": null, "orderable": false,
                            "render": function (data, type, row, meta) {
                                return '<a href="/MasterCode/Edit?Id=' + data.Id + '"><span class="fa fa-edit" aria-hidden="true"></span></a>';
                            }
                        }, ],
                    "order": [0, "asc"]
                });
}

