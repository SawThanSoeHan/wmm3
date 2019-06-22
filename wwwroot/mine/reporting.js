function refresh() {
    bindChart("gender", "chartGender", false);
    bindChart("triage", "chartTriage", false);
    bindChart("transportation", "chartTransportation", false);
    bindChart("comeinby", "chartComeInBy", false);
    bindChart("city", "chartCity", true);
    bindChart("disposition", "chartDisposition", false);
    bindChart("specialistOPD", "chartSpecialistOPD", true);
    bindChart("admission", "chartAdmission", true);
}

function bindChart(type, chartId, needGenerateBackColor) {
    var fromDate = 0;
    var toDate = 0;

    if ($('#txtFromDate').val()) {
        fromDate = $("#txtFromDate").val().replace(/-/g, "").replace(/ /g, "").replace(/:/g, "");
    }

    if ($('#txtToDate').val()) {
        toDate = $("#txtToDate").val().replace(/-/g, "").replace(/ /g, "").replace(/:/g, "");
    }

    getData(type, chartId, fromDate, toDate, needGenerateBackColor);
}

function bindChartWithDate(type, chartId, needGenerateBackColor, fromDate, toDate) {
    getData(type, chartId, fromDate, toDate, needGenerateBackColor);
}

function getData(type, chartId, fromDate, toDate, needGenerateBackColor) {
    var data = JSON.stringify({
        "type": type,
        "fromDate": fromDate,
        "toDate": toDate
    });

    $.ajax({
        type: 'POST',
        url: '/Reporting/GetSummarizedCount', // <-- use an URL Helper to generate this url instead of hardcoding it or you will cry when you deploy your application into a virtual directory
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: data,
        cache: false,
        success: function (data) {
            showData(data, chartId, needGenerateBackColor);
        },
        error: function (xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function showData(data, chartId, needGenerateBackColor) {
    var labels = [];
    var values = [];
    var backColors = [];
    $.each(data, function (i, item) {
        labels.push(item.Label);
        values.push(item.Value);
        backColors.push(item.BackColor);
    });

    if (needGenerateBackColor) {
        backColors = ColorSequenceGenerator.createColorSequence(data.length, { lightnessStart: 80, saturationStart: 70, randomHueOffset: true }).getColors();
    }

    var ctx = document.getElementById(chartId);
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: backColors,
                borderWidth: 1,
            }]
        },
        options: {
            pieceLabel: {
                render: function (args) {
                    return args.value + ", " + args.label + ", " + args.percentage + "%";
                },                
                position: 'outside'
            }
        }
    });
}

function printReport() {
    var fromDate = 0;
    var toDate = 0;

    if ($('#txtFromDate').val()) {
        fromDate = $("#txtFromDate").val().replace(/-/g, "").replace(/ /g, "").replace(/:/g, "");
    }

    if ($('#txtToDate').val()) {
        toDate = $("#txtToDate").val().replace(/-/g, "").replace(/ /g, "").replace(/:/g, "");
    }

    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    mywindow.document.location = "/Reporting/PrintIndex?fromDate=" + fromDate + "&toDate=" + toDate;
    mywindow.focus(); // necessary for IE >= 10*/    
    mywindow.print();
    return true;
}

function printDocument() {
    window.print();
    return false;
}