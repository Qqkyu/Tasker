function dateTypeChanged(dateTypeCheckBox) {
    document.getElementById("end-date").disabled = !dateTypeCheckBox.checked;
}

function timeTypeChanged(timeTypeCheckBox) {
    document.getElementById("start-time").disabled = timeTypeCheckBox.checked;
}