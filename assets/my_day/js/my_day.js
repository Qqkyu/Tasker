M.AutoInit();

function dateTypeChanged(dateTypeCheckBox) {
    document.getElementById("end-date").disabled = !dateTypeCheckBox.checked;
}

function timeTypeChanged(timeTypeCheckBox) {
    document.getElementById("start-time").disabled = timeTypeCheckBox.checked;
}

document.addEventListener('DOMContentLoaded', function() {
    M.Modal.init(document.querySelectorAll('.modal'), {
        opacity: 0.8
    });

    M.Datepicker.init(document.querySelectorAll('.datepicker'), {
        defaultDate: new Date(),
        setDefaultDate: true
    });

    M.Timepicker.init(document.querySelectorAll('.timepicker'), {
        defaultTime: 'now'
    });
});
