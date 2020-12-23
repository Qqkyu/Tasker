function dateTypeChanged(dateTypeCheckBox) {
    document.getElementById("end-date").disabled = !dateTypeCheckBox.checked;
}

function timeTypeChanged(timeTypeCheckBox) {
    document.getElementById("start-time").disabled = timeTypeCheckBox.checked;
}

M.AutoInit();

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);
});