var userIds = [];
var tblUserList;
var tblAssignedUserList;

function bindRoleList(id) {
    $(id).DataTable({
        "processing": true,
        "serverSide": true,
        "info": true,
        "filter": true,
        "pageLength": 50,
        "responsive": true,
        buttons: [
            'pageLength'
        ],
        "ajax": {
            "type": "POST",
            "url": '/Role/SelectList',
            "contentType": 'application/json; charset=utf-8',
            'data': function (data) { return data = JSON.stringify(data); },
            cache: false,
            'error': function (msg) {
                document.write(msg.responseText);
            }
        },
        "columns": [
            { "data": "Name", },
            { "data": "Description", },
            {
                "data": null, "orderable": false,
                "render": function (data, type, row, meta) {
                    return '<a href="/Role/AssignedUserList?roleId=' + data.Id + '"><span class="fa fa-users" aria-hidden="true"></span></a>';
                }
            }, ],
        "order": [0, "asc"]
    });
}

function bindUserList(roleId) {
    if (tblUserList) {
        tblUserList.destroy();
    }

    tblUserList = $("#tblUserList").DataTable({
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
            "url": '/User/SelectList?excludeIds=' + userIds.map(Number),
            "contentType": 'application/json; charset=utf-8',
            'data': function (data) { return data = JSON.stringify(data); },
            cache: false,
            'error': function (msg) {
                document.write(msg.responseText);
            }
        },
        "columns": [
            { "data": "Name", },
            {
                "data": null, "orderable": false,
                "render": function (data, type, row, meta) {
                    return '<a href="#" onclick="addUser(' + roleId + ', ' + data.Id + ')"><span class="fa fa-plus-circle" aria-hidden="true"></span></a>';
                }
            }, ],
        "order": [0, "asc"]
    });
}

function bindAssignedUserList(roleId) {
    if (tblAssignedUserList) {
        tblAssignedUserList.destroy();
    }

    tblAssignedUserList = $("#tblSelectedUserList").DataTable({
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
            url: "/Role/SelectAssignedUserList?roleId=" + roleId,
            "contentType": 'application/json; charset=utf-8',
            'data': function (data) { return data = JSON.stringify(data); },
            cache: false,
            'error': function (msg) {
                document.write(msg.responseText);
            }
        },
        "columns": [
            { "data": "Name", },
            {
                "data": null, "orderable": false,
                "render": function (data, type, row, meta) {
                    userIds.push(data.UserId);
                    return '<a href="#" onclick="removeUser(' + roleId + ', ' + data.Id + ', \'' + data.VersionStringValue + '\')"><span class="fa fa-remove" aria-hidden="true"></span></a>';
                }
            }, ],
        "order": [0, "asc"],
        "drawCallback": function (settings) {
            bindUserList(roleId);
        }
    });
}

function addUser(roleId, userId) {
    var data = JSON.stringify({
        "roleId": roleId,
        "userId": userId,
    });

    $.ajax({
        type: "POST",
        url: "/Role/AddUser",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: data,
        cache: false,
        success: function (data) {
            if (data == "success") {
                location.reload();
            } else {
                alert(data);
            }
        },
        error: function (xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function removeUser(roleId, id, version) {
    var data = JSON.stringify({
        "Id": id,
        "VersionStringValue": version,
    });

    $.ajax({
        type: "POST",
        url: "/Role/RemoveUser",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: data,
        cache: false,
        success: function (data) {
            if (data == "success") {
                location.reload();
            } else {
                alert(data);
            }
        },
        error: function (xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}