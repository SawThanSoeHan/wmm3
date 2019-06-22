var dataConsultation = [];
var dataMedicationPlan = [];
var dataMonitoringProgress = [];
var dataInjury = [];
var dataMedicalRecordItems = [];
var dataMedicalRecordItemMasterList = [];
var tblConsultation;
var tblMedicationPlan;
var tblMonitoringProgress;
var tblInjury;
var ConsultationEditIndex = -1;
var InjuryEditIndex = -1;
var medicationEditIndex = -1;
var monitoringProgressEditIndex = -1;
var dispositionSelectedValue = "0";
var presentingComplaintSelectedValue = "0";
var chiefComplaintSelectedValue = "0";
var transportationSelectedValue = "0";
var observationSelectedValue = "0";

function update() {
    if (!$("#frmPatient").valid() || !$("#frmRegistration").valid()) {
        return;
    }

    var data = getMedicalRecord();

    $.ajax({
        type: "POST",
        url: "/MedicalRecord/Edit",
        contentType: false,
        processData: false,
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
                data = data.split(",");
                $("#spnRegistrationNo").text(data[0]);
                $("#spnPatientCode").text(data[1]);
                $("#divSuccess").modal('toggle');
            }
        },
        error: function (xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function save() {
    if (!$("#frmPatient").valid() || !$("#frmRegistration").valid()) {
        return;
    }

    var data = getMedicalRecord();

    $.ajax({
        type: "POST",
        url: "/MedicalRecord/Entry",
        contentType: false,
        processData: false,
        data: data,
        cache: false,
        success: function (data) {
            if (data == "duplicated") {
                $("#pMessage").text("Patient code is duplicated.");
                $("#divError").modal('toggle');
            } else {
                data = data.split(",");
                $("#spnRegistrationNo").text(data[0]);
                $("#spnPatientCode").text(data[1]);
                $("#divSuccess").modal('toggle');
            }
        },
        error: function (xhr, status, error) {
            alert(xhr.responseText);
        }
    });
}

function setValidationRuleForPatient() {
    $("#frmRegistration").validate({
        ignore: "",
        rules: {
            txtRegistrationDate: {
                required: true,
                maxlength: 500
            },
        }
    });

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

function getMedicalRecord() {
    var medicalRecordItems = [];

    for (var i = 0; i < dataMedicalRecordItemMasterList.length; i++) {
        switch (dataMedicalRecordItemMasterList[i].UIControlType) {
            case "Textbox":
            case "Textarea":
            case "Select":
                if ($("#" + dataMedicalRecordItemMasterList[i].UIControlId).val())
                    medicalRecordItems.push({
                        "Code": dataMedicalRecordItemMasterList[i].Code,
                        "Value": $("#" + dataMedicalRecordItemMasterList[i].UIControlId).val(),
                    });
                break;

            case "Datetime":
                if ($("#" + dataMedicalRecordItemMasterList[i].UIControlId).val())
                    medicalRecordItems.push({
                        "Code": dataMedicalRecordItemMasterList[i].Code,
                        "Value": $("#" + dataMedicalRecordItemMasterList[i].UIControlId).val().replace(/-/g, "").replace(/ /g, "").replace(/:/g, ""),
                    });
                break;

            case "Checkbox":
                if ($("#" + dataMedicalRecordItemMasterList[i].UIControlId).is(":checked"))
                    medicalRecordItems.push({
                        "Code": dataMedicalRecordItemMasterList[i].Code,
                        "Value": $("#" + dataMedicalRecordItemMasterList[i].UIControlId).is(":checked"),
                    });
                break;  

            case "Radio":
                if ($('input:radio[name=' + dataMedicalRecordItemMasterList[i].UIControlId + ']:checked').val())
                    medicalRecordItems.push({
                        "Code": dataMedicalRecordItemMasterList[i].Code,
                        "Value": $('input:radio[name=' + dataMedicalRecordItemMasterList[i].UIControlId + ']:checked').val(),
                    });
                break;
        }
    }

    for (var i = 0; i < dataConsultation.length; i++)
    {
        dataConsultation[i].CheckedDateTime = dataConsultation[i].CheckedDateTime.replace(/-/g, "").replace(/ /g, "").replace(/:/g, "");
    }

    for (var i = 0; i < dataMonitoringProgress.length; i++) {
        dataMonitoringProgress[i].MonitoredDateTime = dataMonitoringProgress[i].MonitoredDateTime.replace(/-/g, "").replace(/ /g, "").replace(/:/g, "");
    }

    dispositionSelectedValue = "0";
    if ($('input:radio[name=disposition]:checked').val() == "OPD") {
        dispositionSelectedValue = $("#selSpecialistOPD").val();
    } else if ($('input:radio[name=disposition]:checked').val() == "Admission") {
        dispositionSelectedValue = $("#selAdmission").val();
    }

    observationSelectedValue = "0";
    if ($('input:radio[name=observation]:checked').val() == "ObservationOPD") {
        observationSelectedValue = $("#selObservationSpecialistOPD").val();
    } else if ($('input:radio[name=observation]:checked').val() == "ObservationAdmission") {
        observationSelectedValue = $("#selObservationAdmission").val();
    }

    for (var i = 0; i < dataMedicationPlan.length; i++) {
        dataMedicationPlan[i].MedicatedDate = dataMedicationPlan[i].MedicatedDate.replace(/-/g, "").replace(/ /g, "").replace(/:/g, "");
    }

    for (var i = 0; i < dataInjury.length; i++) {
        dataInjury[i].SizeHeight = dataInjury[i].SizeHeight == "" ? "0" : dataInjury[i].SizeHeight;
        dataInjury[i].SizeLength = dataInjury[i].SizeLength == "" ? "0" : dataInjury[i].SizeLength;
        dataInjury[i].SizeDepth = dataInjury[i].SizeDepth == "" ? "0" : dataInjury[i].SizeDepth;
    }

    // Create FormData object  
    var fileData = new FormData();  

    for (var i = 0, len = storedFiles.length; i < len; i++) {
        fileData.append(storedFiles[i].name, storedFiles[i]);
    }

    fileData.append('Id', $("#hidMedicalRecordId").val());
    fileData.append('FormType', $('input:radio[name=FormType]:checked').val());
    fileData.append('RegistrationNo', $("#txtRegistrationNo").val());
    fileData.append('Version', $("#hidMedicalRecordVersion").val());
    fileData.append('RegistrationDate', $("#txtRegistrationDate").val().replace(/-/g, "").replace(/ /g, "").replace(/:/g, ""));
    fileData.append('PatientId', $("#hidPatientId").val());
    fileData.append('Age', $("#txtAge").val());
    fileData.append('Patient.Id', $("#hidPatientId").val());
    fileData.append('Patient.Version', $("#hidPatientVersion").val());
    fileData.append('Patient.PatientCode', $("#txtPatientCode").val());
    fileData.append('Patient.Name', $("#txtName").val());
    fileData.append('Patient.Age', $("#txtAge").val());
    fileData.append('Patient.DOB', $("#txtDOB").val().replace(/-/g, "").replace(/ /g, "").replace(/:/g, ""));
    fileData.append('Patient.Sex', $('input:radio[name=sex]:checked').val() ? $('input:radio[name=sex]:checked').val() : "0");
    fileData.append('Patient.City', $("#selCity").val());
    fileData.append('Patient.FullAddress', $("#txtFullAddress").val());
    fileData.append('ArrivalTime', $("#txtArrivalTime").val().replace(/-/g, "").replace(/ /g, "").replace(/:/g, ""));
    fileData.append('TreatmentTime', $("#txtTreatmentTime").val().replace(/-/g, "").replace(/ /g, "").replace(/:/g, ""));
    fileData.append('DCTime', $("#txtDCTime").val().replace(/-/g, "").replace(/ /g, "").replace(/:/g, ""));
    fileData.append('TriageValue', $('input:radio[name=Triage]:checked').val() ? $('input:radio[name=Triage]:checked').val() : "0");
    fileData.append('TransportationValue', $('input:radio[name=Transportation]:checked').val() ? $('input:radio[name=Transportation]:checked').val() : "0");
    fileData.append('OtherTransportation', $("#selOtherTransporation").val());
    fileData.append('ComeInByValue', $('input:radio[name=Comeinby]:checked').val() ? $('input:radio[name=Comeinby]:checked').val() : "0");
    fileData.append('ComeFrom', $("#selHospital").val());
    fileData.append('ComeReason', $("#selReason").val());
    fileData.append('PresentingComplaint', $("#selPresentingComplaint").val());
    fileData.append('ChiefComplaint', $("#selChiefComplaint").val());
    fileData.append('DispositionValue', $('input:radio[name=disposition]:checked').val() ? $('input:radio[name=disposition]:checked').val() : "0");
    fileData.append('DispositionSelectedValue', dispositionSelectedValue);
    fileData.append('ObservationValue', $('input:radio[name=observation]:checked').val() ? $('input:radio[name=observation]:checked').val() : "0");
    fileData.append('ObservationSelectedValue', observationSelectedValue);
    fileData.append('GeneralRemarks', $("#txtGeneralRemarks").val());
    fileData.append('MedicalOfficerName', $("#txtMedicalOfficerName").val());
    fileData.append('AttachedFile', fileData);
    fileData.append('MedicalRecordItems', JSON.stringify(medicalRecordItems));
    fileData.append('Consultations', JSON.stringify(dataConsultation));
    fileData.append('MedicationPlans', JSON.stringify(dataMedicationPlan));
    fileData.append('MonitoringProgresses', JSON.stringify(dataMonitoringProgress));
    fileData.append('Injuries', JSON.stringify(dataInjury));

    return fileData;
}

function fillData() {
    if ($('input:radio[name=disposition]:checked').val() == "OPD") {
        $("#selSpecialistOPD").val(dispositionSelectedValue);
    } else if ($('input:radio[name=disposition]:checked').val() == "Admission") {
        $("#selAdmission").val(dispositionSelectedValue);
    }

    if ($('input:radio[name=observation]:checked').val() == "ObservationOPD") {
        $("#selObservationSpecialistOPD").val(observationSelectedValue);
    } else if ($('input:radio[name=observation]:checked').val() == "ObservationAdmission") {
        $("#selObservationAdmission").val(observationSelectedValue);
    }
    
    $("#selPresentingComplaint").val(presentingComplaintSelectedValue);
    $("#selChiefComplaint").val(chiefComplaintSelectedValue);
    $("#selOtherTransporation").val(transportationSelectedValue);

    for (var i = 0; i < dataMedicalRecordItems.length; i++) {
        switch (dataMedicalRecordItems[i].UIControlType) {
            case "Textbox":
            case "Select":
                $("#" + dataMedicalRecordItems[i].UIControlId).val(dataMedicalRecordItems[i].Value);
                break;

            case "Checkbox":
                $("#" + dataMedicalRecordItems[i].UIControlId).prop('checked', dataMedicalRecordItems[i].Value);
                break;

            case "Textarea":
                $("#" + dataMedicalRecordItems[i].UIControlId).html(dataMedicalRecordItems[i].Value.replace(/<br>/g, "\n"));
                break;

            case "Datetime":
                $("#" + dataMedicalRecordItems[i].UIControlId).html(dataMedicalRecordItems[i].Value);
                break;

            case "Radio":
                $('input:radio[name=' + dataMedicalRecordItems[i].UIControlId + ']').filter('[value="' + dataMedicalRecordItems[i].Value + '"]').prop('checked', true);
                break;
        }
    }
}

function showHide() {
    if ($('input:radio[name=FormType]:checked').val() == "NonTrauma") {
        $("#liInjury").hide();
        $("#liRelevantHistory").show();
        $("#divWoundMax").hide();
        $("#divFractureMax").hide();
        showTab("#tab_1");
    } else {
        $("#liInjury").show();
        $("#liRelevantHistory").hide();
        $("#divWoundMax").show();
        $("#divFractureMax").show();
        showTab("#tab_1");
    }
}

function showTab(activeTab) {
    $('#myTab a[href="' + activeTab + '"]').tab('show');
}

/* Consultation */
function setValidationRuleForConsultation() {
    $("#frmConsultation").validate({
        ignore: "",
        rules: {
            selConsultationCode: {
                required: true,
            },
            txtCheckedDateTime: {
                required: true,
            },
            txtReceivedBy: {
                required: true,
            },
        }
    });
}

function addConsultation() {
    if (!$("#frmConsultation").valid()) {
        return;
    }

    if (ConsultationEditIndex > -1) {
        dataConsultation[ConsultationEditIndex].ConsultationId = $("#selConsultationCode").val();
        dataConsultation[ConsultationEditIndex].ConsultationCode = $("#selConsultationCode option:selected").text();
        dataConsultation[ConsultationEditIndex].CheckedDateTime = $("#txtCheckedDateTime").val();
        dataConsultation[ConsultationEditIndex].ReceivedBy = $("#txtReceivedBy").val();
        dataConsultation[ConsultationEditIndex].Reason = $("#txtReason").val();
        dataConsultation[ConsultationEditIndex].Remarks = $("#txtRemarks").val();
    } else {
        var item = {
            "ConsultationId": $("#selConsultationCode").val(),
            "ConsultationCode": $("#selConsultationCode option:selected").text(),
            "CheckedDateTime": $("#txtCheckedDateTime").val(),
            "ReceivedBy": $("#txtReceivedBy").val(),
            "Reason": $("#txtReason").val(),
            "Remarks": $("#txtRemarks").val()
        };

        dataConsultation.push(item);
    }
    
    tblConsultation = bindConsultation();
    $('#divConsultation').modal('toggle');
}

function bindConsultation() {
    if (tblConsultation) {
        tblConsultation.destroy();
    }

    table = $("#tblConsultation").DataTable({
        "info": true,
        "filter": true,
        "pageLength": 20,
        "paging": false,
        "destory": true,
        "data": dataConsultation,
        "bSort": false,
        "columns": [
            { data: "ConsultationCode" },
            { data: "CheckedDateTime" },
            { data: "ReceivedBy" },
            { data: "Reason" },
            { data: "Remarks" },
            {
                data: null,
                className: "center",
            },
            {
                data: null,
                className: "center",
            }],
        "createdRow": function (row, data, dataIndex) {
            $('td:eq(5)', row).html('<a data-toggle="modal" href="#divConsultation" onclick="clearConsultations(); editConsultations(' + dataIndex + ');"><span  class="glyphicon glyphicon-edit " aria-hidden="true"></span></a>');
            $('td:eq(6)', row).html('<a data-toggle="modal" href="#divConsultationDeleteConfirmation" onclick="setRemoveConsultationIndex(' + dataIndex + ')"><span class="glyphicon glyphicon-trash " aria-hidden="true"></span></a>');
            return row;
        },
    });

    return table;
}

function clearConsultations() {
    ConsultationEditIndex = -1;
    $("#selConsultationCode").val('').trigger('change');
    $("#txtCheckedDateTime").val('');
    $("#txtReceivedBy").val('');
    $("#txtReason").val('');
    $("#txtRemarks").val('');
}

function editConsultations(rowIndex) {
    ConsultationEditIndex = rowIndex;
    var data = $('#tblConsultation').DataTable().rows().data();
    $("#selConsultationCode").val(decodeData(data.rows(rowIndex).data()[0].ConsultationId)).trigger('change');
    $("#txtCheckedDateTime").val(decodeData(data.rows(rowIndex).data()[0].CheckedDateTime));
    $("#txtReceivedBy").val(decodeData(data.rows(rowIndex).data()[0].ReceivedBy));
    $("#txtReason").val(decodeData(data.rows(rowIndex).data()[0].Reason));
    $("#txtRemarks").val(decodeData(data.rows(rowIndex).data()[0].Remarks));
}

function setRemoveConsultationIndex(rowIndex) {
    ConsultationEditIndex = rowIndex;
}

function removeConsultation() {
    dataConsultation.splice(ConsultationEditIndex, 1);
    tblConsultation = bindConsultation();
    $('#divConsultationDeleteConfirmation').modal('toggle');
}
/* Consultation */

/* Medication */
function setValidationRuleForMedication() {
    $("#frmMedicationPlan").validate({
        ignore: "",
        rules: {
            txtMedicatedDate: {
                required: true,
            },
            selDrug: {
                required: true,
            },
            txtDose: {
                required: true,
            },
            selDoseUnit: {
                required: true,
            },
            txtRoute: {
                required: true,
            },
            selFrequency: {
                required: true,
            },
        }
    });
}

function addMedication() {
    if (!$("#frmMedicationPlan").valid()) {
        return;
    }

    if (medicationEditIndex > -1) {
        dataMedicationPlan[medicationEditIndex].MedicatedDate = $("#txtMedicatedDate").val();
        dataMedicationPlan[medicationEditIndex].DrugId = $("#selDrug").val();
        dataMedicationPlan[medicationEditIndex].DrugName = $("#selDrug option:selected").text();
        dataMedicationPlan[medicationEditIndex].Dose = $("#txtDose").val();
        dataMedicationPlan[medicationEditIndex].DoseUnit = $("#selDoseUnit").val();
        dataMedicationPlan[medicationEditIndex].Route = $('input:radio[name=Route]:checked').val() ? $('input:radio[name=Route]:checked').val() : "0";
        dataMedicationPlan[medicationEditIndex].Duration = $("#selDuration").val();
        dataMedicationPlan[medicationEditIndex].Frequency = $("#selFrequency").val();
        dataMedicationPlan[medicationEditIndex].Remarks = $("#txtMedicationRemarks").val();
    } else {
        var item = {
            "MedicatedDate": $("#txtMedicatedDate").val(),
            "DrugId": $("#selDrug").val(),
            "DrugName": $("#selDrug option:selected").text(),
            "Dose": $("#txtDose").val(),
            "DoseUnit": $("#selDoseUnit").val(),
            "Route": $('input:radio[name=Route]:checked').val() ? $('input:radio[name=Route]:checked').val() : "0",
            "Duration": $("#selDuration").val(),
            "Frequency": $("#selFrequency").val(),
            "Remarks": $("#txtMedicationRemarks").val()
        };

        dataMedicationPlan.push(item);
    }

    tblMedicationPlan = bindMedication();
    $('#divMedicationModal').modal('toggle');
}

function bindMedication() {
    if (tblMedicationPlan) {
        tblMedicationPlan.destroy();
    }

    table = $("#tblMedicationPlan").DataTable({
        "info": true,
        "filter": true,
        "pageLength": 20,
        "paging": false,
        "destory": true,
        "data": dataMedicationPlan,
        "bSort": false,
        "columns": [
            { data: "MedicatedDate" },
            { data: "DrugName" },
            { data: "Dose" },
            { data: "DoseUnit" },
            { data: "Route" },
            { data: "Duration" },
            { data: "Frequency" },
            { data: "Remarks" },
            {
                data: null,
                className: "center",
            },
            {
                data: null,
                className: "center",
            }],
        "createdRow": function (row, data, dataIndex) {
            $('td:eq(8)', row).html('<a data-toggle="modal" href="#divMedicationModal" onclick="clearMedication(); editMedication(' + dataIndex + ');"><span  class="glyphicon glyphicon-edit " aria-hidden="true"></span></a>');
            $('td:eq(9)', row).html('<a data-toggle="modal" href="#divMedicationDeleteConfirmation" onclick="setRemoveMedicationIndex(' + dataIndex + ')"><span class="glyphicon glyphicon-trash " aria-hidden="true"></span></a>');
            return row;
        },
    });

    return table;
}

function clearMedication() {
    medicationEditIndex = -1;
    $("#txtMedicatedDate").val('');
    $("#selDrug").val('').trigger('change');
    $("#txtDose").val('');
    $("#selDoseUnit").val('');
    $("#txtRoute").val('');
    $("#selDuration").val('').trigger('change');
    $("#selFrequency").val('').trigger('change');
    $("#txtMedicationRemarks").val('');
}

function editMedication(rowIndex) {
    medicationEditIndex = rowIndex;
    var data = $('#tblMedicationPlan').DataTable().rows().data();
    $("#txtMedicatedDate").val(decodeData(data.rows(rowIndex).data()[0].MedicatedDate));
    $("#selDrug").val(decodeData(data.rows(rowIndex).data()[0].DrugId)).trigger('change');
    $("#txtDose").val(decodeData(data.rows(rowIndex).data()[0].Dose));
    $("#selDoseUnit").val(decodeData(data.rows(rowIndex).data()[0].DoseUnit));
    $('input:radio[name=Route]').filter('[value=' + decodeData(data.rows(rowIndex).data()[0].Route) + ']').prop('checked', true);
    $("#selDuration").val(decodeData(data.rows(rowIndex).data()[0].Duration)).trigger('change');
    $("#selFrequency").val(decodeData(data.rows(rowIndex).data()[0].Frequency)).trigger('change');
    $("#txtMedicationRemarks").val(decodeData(data.rows(rowIndex).data()[0].Remarks));
}

function setRemoveMedicationIndex(rowIndex) {
    medicationEditIndex = rowIndex;
}

function removeMedication() {
    dataMedicationPlan.splice(medicationEditIndex, 1);
    tblMedicationPlan = bindMedication();
    $('#divMedicationDeleteConfirmation').modal('toggle');
}
/* Medication */

/* Monitoring and Progress */
function setValidationRuleForMonitoringProgress() {
    $("#frmMonitoringProgress").validate({
        ignore: "",
        rules: {
            txtMonitoredDateTime: {
                required: true,
            },
        }
    });
}

function addMonitoringProgress() {
    if (!$("#frmMonitoringProgress").valid()) {
        return;
    }

    if (monitoringProgressEditIndex > -1) {
        dataMonitoringProgress[monitoringProgressEditIndex].MonitoredDateTime = $("#txtMonitoredDateTime").val();
        dataMonitoringProgress[monitoringProgressEditIndex].BP = $("#txtBP").val();
        dataMonitoringProgress[monitoringProgressEditIndex].PR = $("#txtPR").val();
        dataMonitoringProgress[monitoringProgressEditIndex].RR = $("#txtRR").val();
        dataMonitoringProgress[monitoringProgressEditIndex].SpO2 = $("#txtSpO2").val();
        dataMonitoringProgress[monitoringProgressEditIndex].Eye = $("#selMonitoringEye").val();
        dataMonitoringProgress[monitoringProgressEditIndex].Verbal = $("#selMonitoringVerbal").val();
        dataMonitoringProgress[monitoringProgressEditIndex].Motor = $("#selMonitoringMotor").val();
        dataMonitoringProgress[monitoringProgressEditIndex].GCS = $("#txtMonitoringGCS").val();
        dataMonitoringProgress[monitoringProgressEditIndex].FluidTotal = $("#txtFluidTotal").val();
        dataMonitoringProgress[monitoringProgressEditIndex].UrineOutput = $("#txtUrineOutput").val();
        dataMonitoringProgress[monitoringProgressEditIndex].Antibiotic = $("#txtAntibiotic").val();
        dataMonitoringProgress[monitoringProgressEditIndex].PainKiller = $("#txtPainKiller").val();
        dataMonitoringProgress[monitoringProgressEditIndex].Remarks = $("#txtMonitoringProgressRemarks").val();
    } else {
        var item = {
            "MonitoredDateTime": $("#txtMonitoredDateTime").val(),
            "BP": $("#txtBP").val(),
            "PR": $("#txtPR").val(),
            "RR": $("#txtRR").val(),
            "SpO2": $("#txtSpO2").val(),
            "Eye": $("#selMonitoringEye").val(),
            "Verbal": $("#selMonitoringVerbal").val(),
            "Motor": $("#selMonitoringMotor").val(),
            "GCS": $("#txtMonitoringGCS").val(),
            "FluidTotal": $("#txtFluidTotal").val(),
            "UrineOutput": $("#txtUrineOutput").val(),
            "Antibiotic": $("#txtAntibiotic").val(),
            "PainKiller": $("#txtPainKiller").val(),
            "Remarks": $("#txtMonitoringProgressRemarks").val()
        };

        dataMonitoringProgress.push(item);
    }

    tblMonitoringProgress = bindMonitoringProgress();
    $('#divMonitoringProgress').modal('toggle');
}

function bindMonitoringProgress() {
    if (tblMonitoringProgress) {
        tblMonitoringProgress.destroy();
    }

    table = $("#tblMonitoringProgress").DataTable({
        "info": true,
        "filter": true,
        "pageLength": 20,
        "paging": false,
        "destory": true,
        "data": dataMonitoringProgress,
        "bSort": false,
        "columns": [
            { data: "MonitoredDateTime" },
            { data: "BP" },
            { data: "PR" },
            { data: "RR" },
            { data: "SpO2" },
            { data: "Eye" },
            { data: "Verbal" },
            { data: "Motor" },
            { data: "GCS" },
            { data: "FluidTotal" },
            { data: "UrineOutput" },
            { data: "Antibiotic" },
            { data: "PainKiller" },
            { data: "Remarks" },
            {
                data: null,
                className: "center",
            },
            {
                data: null,
                className: "center",
            }],
        "createdRow": function (row, data, dataIndex) {
            $('td:eq(14)', row).html('<a data-toggle="modal" href="#divMonitoringProgress" onclick="clearMonitoringProgress(); editMonitoringProgress(' + dataIndex + ');"><span  class="glyphicon glyphicon-edit " aria-hidden="true"></span></a>');
            $('td:eq(15)', row).html('<a data-toggle="modal" href="#divMonitoringProgressDeleteConfirmation" onclick="setRemoveMonitoringProgressIndex(' + dataIndex + ')"><span class="glyphicon glyphicon-trash " aria-hidden="true"></span></a>');
            return row;
        },
    });

    return table;
}

function clearMonitoringProgress() {
    monitoringProgressEditIndex = -1;
    $("#txtMonitoredDateTime").val('');
    $("#txtBP").val('');
    $("#txtPR").val('');
    $("#txtRR").val('');
    $("#txtSpO2").val('');
    $("#selMonitoringEye").val('');
    $("#selMonitoringVerbal").val('');
    $("#selMonitoringMotor").val('');
    $("#txtMonitoringGCS").val('');
    $("#txtFluidTotal").val('');
    $("#txtUrineOutput").val('');
    $("#txtAntibiotic").val('');
    $("#txtPainKiller").val('');
    $("#txtMonitoringProgressRemarks").val('');
}

function editMonitoringProgress(rowIndex) {
    monitoringProgressEditIndex = rowIndex;
    var data = $('#tblMonitoringProgress').DataTable().rows().data();
    $("#txtMonitoredDateTime").val(decodeData(data.rows(rowIndex).data()[0].MonitoredDateTime));
    $("#txtBP").val(decodeData(data.rows(rowIndex).data()[0].BP));
    $("#txtPR").val(decodeData(data.rows(rowIndex).data()[0].PR));
    $("#txtRR").val(decodeData(data.rows(rowIndex).data()[0].RR));
    $("#txtSpO2").val(decodeData(data.rows(rowIndex).data()[0].SpO2));
    $("#selMonitoringEye").val(decodeData(data.rows(rowIndex).data()[0].Eye));
    $("#selMonitoringVerbal").val(decodeData(data.rows(rowIndex).data()[0].Verbal));
    $("#selMonitoringMotor").val(decodeData(data.rows(rowIndex).data()[0].Motor));
    $("#txtMonitoringGCS").val(decodeData(data.rows(rowIndex).data()[0].GCS));
    $("#txtFluidTotal").val(decodeData(data.rows(rowIndex).data()[0].FluidTotal));
    $("#txtUrineOutput").val(decodeData(data.rows(rowIndex).data()[0].UrineOutput));
    $("#txtAntibiotic").val(decodeData(data.rows(rowIndex).data()[0].Antibiotic));
    $("#txtPainKiller").val(decodeData(data.rows(rowIndex).data()[0].PainKiller));
    $("#txtMonitoringProgressRemarks").val(decodeData(data.rows(rowIndex).data()[0].Remarks));
}

function setRemoveMonitoringProgressIndex(rowIndex) {
    monitoringProgressEditIndex = rowIndex;
}

function removeMonitoringProgress() {
    dataMonitoringProgress.splice(monitoringProgressEditIndex, 1);
    tblMonitoringProgress = bindMonitoringProgress();
    $('#divMonitoringProgressDeleteConfirmation').modal('toggle');
}
/* Monitoring and Progresses */

/* Injury */
function setValidationRuleForInjury() {
    $("#frmInjury").validate({
        ignore: "",
        rules: {
            selInjuryPart: {
                required: true,
            },
        }
    });
}

function addInjury() {
    if (!$("#frmInjury").valid()) {
        return;
    }

    if (InjuryEditIndex > -1) {
        dataInjury[InjuryEditIndex].InjuryPartCode = $("#selInjuryPart").val();
        dataInjury[InjuryEditIndex].InjuryLevelCode = $("#selInjuryLevel").val();
        dataInjury[InjuryEditIndex].RegionCode = $("#selInjuryRegion").val();
        dataInjury[InjuryEditIndex].SideCode = $("#selInjurySide").val();
        dataInjury[InjuryEditIndex].SizeHeight = $("#txtSizeHeight").val();
        dataInjury[InjuryEditIndex].SizeLength = $("#txtSizeLength").val();
        dataInjury[InjuryEditIndex].SizeDepth = $("#txtSizeDepth").val();
        dataInjury[InjuryEditIndex].WoundType = $("#selInjuryWoundType").val();
        dataInjury[InjuryEditIndex].WoundTypeValue = $("#txtInjuryWoundType").val();
        dataInjury[InjuryEditIndex].Eye = $("#selInjuryEye").val();
        dataInjury[InjuryEditIndex].Lips = $("#selInjuryLip").val();
        dataInjury[InjuryEditIndex].Tense = $("#selInjuryTense").val();
        dataInjury[InjuryEditIndex].Tenderness = $("#txtTenderness").val();
        dataInjury[InjuryEditIndex].BowelSound = $("#selInjuryBowelSound").val();
        dataInjury[InjuryEditIndex].BowelSoundValue = $("#txtBowelSoundValue").val();
        dataInjury[InjuryEditIndex].SpineTenderness = $("#selInjurySpineTenderness").val();
        dataInjury[InjuryEditIndex].SpineTendernessValue = $("#txtSpineTendernessValue").val();
        dataInjury[InjuryEditIndex].AnalTone = $("#selInjuryAnalTone").val();
    } else {
        var item = {
            "InjuryPartCode" : $("#selInjuryPart").val(),
            "InjuryLevelCode" : $("#selInjuryLevel").val(),
            "RegionCode" : $("#selInjuryRegion").val(),
            "SideCode" : $("#selInjurySide").val(),
            "SizeHeight" : $("#txtSizeHeight").val(),
            "SizeLength" : $("#txtSizeLength").val(),
            "SizeDepth" : $("#txtSizeDepth").val(),
            "WoundType" : $("#selInjuryWoundType").val(),
            "WoundTypeValue" : $("#txtInjuryWoundType").val(),
            "Eye" : $("#selInjuryEye").val(),
            "Lips" : $("#selInjuryLip").val(),
            "Tense" : $("#selInjuryTense").val(),
            "Tenderness" : $("#txtTenderness").val(),
            "BowelSound" : $("#selInjuryBowelSound").val(),
            "BowelSoundValue" : $("#txtBowelSoundValue").val(),
            "SpineTenderness" : $("#selInjurySpineTenderness").val(),
            "SpineTendernessValue" : $("#txtSpineTendernessValue").val(),
            "AnalTone": $("#selInjuryAnalTone").val(),
        };

        dataInjury.push(item);
    }

    tblInjury = bindInjury();
    $('#divInjury').modal('toggle');
}

function bindInjury() {
    if (tblInjury) {
        tblInjury.destroy();
    }

    table = $("#tblInjury").DataTable({
        "info": true,
        "filter": true,
        "pageLength": 20,
        "paging": false,
        "destory": true,
        "data": dataInjury,
        "bSort": false,
        "columns": [
            { data: "InjuryPartCode" },
            { data: "InjuryLevelCode" },
            {
                data: null,
                className: "center",
            },
            {
                data: null,
                className: "center",
            }],
        "createdRow": function (row, data, dataIndex) {
            $('td:eq(2)', row).html('<a data-toggle="modal" href="#divInjury" onclick="clearInjury(); editInjury(' + dataIndex + ');"><span  class="glyphicon glyphicon-edit " aria-hidden="true"></span></a>');
            $('td:eq(3)', row).html('<a data-toggle="modal" href="#divInjuryDeleteConfirmation" onclick="setRemoveInjuryIndex(' + dataIndex + ')"><span class="glyphicon glyphicon-trash " aria-hidden="true"></span></a>');
            return row;
        },
    });

    return table;
}

function clearInjury() {
    InjuryEditIndex = -1;
    $("#selInjuryPart").val('').trigger('change');
    $("#selInjuryLevel").val('').trigger('change');
    $("#selInjuryRegion").val('').trigger('change');
    $("#selInjurySide").val('').trigger('change');
    $("#txtSizeHeight").val('');
    $("#txtSizeLength").val('');
    $("#txtSizeDepth").val('');
    $("#selInjuryWoundType").val('').trigger('change');
    $("#txtInjuryWoundType").val('');
    $("#selInjuryEye").val('').trigger('change');
    $("#selInjuryLip").val('').trigger('change');
    $("#selInjuryTense").val('').trigger('change');
    $("#txtTenderness").val('');
    $("#selInjuryBowelSound").val('').trigger('change');
    $("#txtBowelSoundValue").val('');
    $("#selInjurySpineTenderness").val('').trigger('change');
    $("#txtSpineTendernessValue").val('');
    $("#selInjuryAnalTone").val('').trigger('change');
}

function editInjury(rowIndex) {
    InjuryEditIndex = rowIndex;
    var data = $('#tblInjury').DataTable().rows().data();
    $("#selInjuryPart").val(decodeData(data.rows(rowIndex).data()[0].InjuryPartCode)).trigger('change');
    $("#selInjuryLevel").val(decodeData(data.rows(rowIndex).data()[0].InjuryLevelCode)).trigger('change');
    $("#selInjuryRegion").val(decodeData(data.rows(rowIndex).data()[0].RegionCode)).trigger('change');
    $("#selInjurySide").val(decodeData(data.rows(rowIndex).data()[0].SideCode)).trigger('change');
    $("#txtSizeHeight").val(decodeData(data.rows(rowIndex).data()[0].SizeHeight));
    $("#txtSizeLength").val(decodeData(data.rows(rowIndex).data()[0].SizeLength));
    $("#txtSizeDepth").val(decodeData(data.rows(rowIndex).data()[0].SizeDepth));
    $("#selInjuryWoundType").val(decodeData(data.rows(rowIndex).data()[0].WoundType)).trigger('change');
    $("#txtInjuryWoundType").val(decodeData(data.rows(rowIndex).data()[0].WoundTypeValue));
    $("#selInjuryEye").val(decodeData(data.rows(rowIndex).data()[0].Eye)).trigger('change');
    $("#selInjuryLip").val(decodeData(data.rows(rowIndex).data()[0].Lips)).trigger('change');
    $("#selInjuryTense").val(decodeData(data.rows(rowIndex).data()[0].Tense)).trigger('change');
    $("#txtTenderness").val(decodeData(data.rows(rowIndex).data()[0].Tenderness));
    $("#selInjuryBowelSound").val(decodeData(data.rows(rowIndex).data()[0].BowelSound)).trigger('change');
    $("#txtBowelSoundValue").val(decodeData(data.rows(rowIndex).data()[0].BowelSoundValue));
    $("#selInjurySpineTenderness").val(decodeData(data.rows(rowIndex).data()[0].SpineTenderness)).trigger('change');
    $("#txtSpineTendernessValue").val(decodeData(data.rows(rowIndex).data()[0].SpineTendernessValue));
    $("#selInjuryAnalTone").val(decodeData(data.rows(rowIndex).data()[0].AnalTone)).trigger('change');
}

function setRemoveInjuryIndex(rowIndex) {
    InjuryEditIndex = rowIndex;
}

function removeInjury() {
    dataInjury.splice(InjuryEditIndex, 1);
    tblInjury = bindInjury();
    $('#divInjuryDeleteConfirmation').modal('toggle');
}
/* Injury */

function calculateGCS(eye, verbal, motor, total) {
    var result = 0;
    if ($('#' + eye).val()) {
        result += parseInt($('#' + eye).val());
    }

    if ($('#' + verbal).val()) {
        result += parseInt($('#' + verbal).val());
    }

    if ($('#' + motor).val()) {
        result += parseInt($('#' + motor).val());
    }

    if (result != 0) {
        $('#' + total).val(String(result) + "/15");
    } else {
        $('#' + total).val("");
    }
}

function deleteAttchedFile(controlId, id, fileName) {
    var $ctrl = $("#" + controlId);
    if (confirm('Do you really want to delete this file?')) {
        $.ajax({
            url: '/MedicalRecord/DeleteFile',
            type: 'POST',
            data: { Id: id, FileStorageName: fileName }
        }).done(function (data) {
            if (data == "success") {
                $ctrl.closest('li').remove();
            }
        }).fail(function () {
            alert("There is something wrong. Please try again.");
        })

    }
}

var storedFiles = [];
$("#fileAttachment").on("change", handleFileSelect);
$("body").on("click", ".removeFile", removeFile);

function handleFileSelect(e) {
    var output = document.getElementById('divFiles');

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);

    output.innerHTML = '<ul>';
    filesArr.forEach(function (f) {
        storedFiles.push(f);

        var reader = new FileReader();
        reader.onload = function (e) {
            output.innerHTML += '<li>' + f.name + ' <a href="#" class="btn btn-sm btn-default removeFile" data-file="' + f.name + '">Remove</a></li>';            
        }
        reader.readAsDataURL(f);
    });
    output.innerHTML += '</ul>';

    $("#fileAttachment").clearFiles();
}

function removeFile(e) {
    var file = $(this).data("file");
    for (var i = 0; i < storedFiles.length; i++) {
        if (storedFiles[i].name === file) {
            storedFiles.splice(i, 1);
            break;
        }
    }
    $(this).parent().remove();
}
