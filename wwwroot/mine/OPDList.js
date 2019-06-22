function submit() {
    $("#txtFromDate").val($("#txtFromDate").val().replace(/-/g, ""));
    $("#txtToDate").val($("#txtToDate").val().replace(/-/g, ""));
    $("#txtFromMonth").val($("#txtFromMonth").val().replace(/-/g, ""));
    $("#txtToMonth").val($("#txtToMonth").val().replace(/-/g, ""));
    $("#frmOPDListGraph").submit();
}

function ShowReport() {
    var url = "";

    var rdoCheck = $('input:radio[name=TimeType]:checked').val();
    if (rdoCheck == "Date") {
        url = "../Reports/Viewer/OPDListReport.aspx?timeType=Date&fromDate=" + $("#txtFromDate").val() + "&toDate=" + $("#txtToDate").val();
    }else if (rdoCheck == "Month") {
        url = "../Reports/Viewer/OPDListReport.aspx?timeType=Month&fromDate=" + $("#txtFromMonth").val() + "&toDate=" + $("#txtToMonth").val();
    } else {
        url = "../Reports/Viewer/OPDListReport.aspx?timeType=Year&fromDate=" + $("#txtFromYear").val() + "&toDate=" + $("#txtToYear").val();
    }

    var myframe = document.getElementById("ifrmReportViewer_OPD");
    if (myframe !== null) {
        if (myframe.src) {
            myframe.src = url;
        }
        else if (myframe.contentWindow !== null && myframe.contentWindow.location !== null) {
            myframe.contentWindow.location = url;
        }
        else { myframe.setAttribute('src', url); }
    }

    return false;
}

function showHide() {
    if ($('input:radio[name=TimeType]:checked').val() == "Date") {
        $("#divMonth").hide();
        $("#divYear").hide();
        $("#divDate").show();
    }else if ($('input:radio[name=TimeType]:checked').val() == "Month") {
        $("#divMonth").show();
        $("#divYear").hide();
        $("#divDate").hide();
    } else {
        $("#divMonth").hide();
        $("#divYear").show();
        $("#divDate").hide();
    }
}