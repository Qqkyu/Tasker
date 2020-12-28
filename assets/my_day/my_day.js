M.AutoInit();

function dateTypeChanged(dateTypeCheckBox) {
    document.getElementById("end-date").disabled = !dateTypeCheckBox.checked;
}

function timeTypeChanged(timeTypeCheckBox) {
    document.getElementById("start-time").disabled = timeTypeCheckBox.checked;
}

document.addEventListener('DOMContentLoaded', function() {
    var options = {
        opacity: 0.8,
    }
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);
});

document.addEventListener('DOMContentLoaded', function() {
    var options = {
        defaultDate: new Date(),
        setDefaultDate: true
    }
    var elems = document.querySelectorAll('.datepicker');
    var instance = M.Datepicker.init(elems, options);
});

document.addEventListener('DOMContentLoaded', function() {
    var options = {
        defaultTime: 'now'
    }
    var elems = document.querySelectorAll('.timepicker');
    var instance = M.Timepicker.init(elems, options);
});
