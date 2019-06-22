

function ShowReport() {
    var url = "";

    var rdoCheck = $('input:radio[name=TimeType]:checked').val();
    if (rdoCheck == "Date") {
        url = "../Reports/Viewer/AdmissionListReport.aspx?timeType=Date&fromDate=" + $("#txtFromDate").val() + "&toDate=" + $("#txtToDate").val();
    }else if (rdoCheck == "Month") {
        url = "../Reports/Viewer/AdmissionListReport.aspx?timeType=Month&fromDate=" + $("#txtFromMonth").val() + "&toDate=" + $("#txtToMonth").val();
    } else {
        url = "../Reports/Viewer/AdmissionListReport.aspx?timeType=Year&fromDate=" + $("#txtFromYear").val() + "&toDate=" + $("#txtToYear").val();
    }

    var myframe = document.getElementById("ifrmReportViewer_Admission");
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

