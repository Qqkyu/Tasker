function editTask(id) {
/*
 * Function which is called after 'Edit' button was clicked on some task. Fetch task
 * with passed-in ID from database and fill modal with appropriate data.
*/
    const task = fetchTaskByID(id);

    // Description
    document.getElementById("edit-description").innerText = task['description'];

    // Start date - set input field as well as datepicker
    let elem = document.querySelector('#edit-start-date');
    let instance = M.Datepicker.getInstance(elem);
    // Set datepicker pop-up
    instance.setDate(new Date(task['startYear'], parseInt(task['startMonth']) - 1, task['startDay']));
    // Set datepicker label
    instance._finishSelection();

    // End date - set input field, datepicker and multi-day event checkbox
    if(task['endYear']) {
        elem = document.querySelector('#edit-end-date');
        instance = M.Datepicker.getInstance(elem);
        // Set datepicker pop-up
        instance.setDate(new Date(task['endYear'], parseInt(task['endMonth']) - 1, task['endDay']));
        // Set datepicker label
        instance._finishSelection();
        // Check multi-day event checkbox
        document.getElementById("multi-day-event-checkbox").checked = true;
        // Make input enabled
        document.getElementById("edit-end-date").disabled = false;
    }
    else {
        elem = document.querySelector('#edit-end-date');
        instance = M.Datepicker.getInstance(elem, {
            defaultDate: new Date(),
            setDefaultDate: true
        });
        // Set datepicker label
        instance._finishSelection();
        // Uncheck multi-day event checkbox
        document.getElementById("multi-day-event-checkbox").checked = false;
        // Make input disabled
        document.getElementById("edit-end-date").disabled = true;
    }

    // Time - set input field, timepicker
    if(task['timeHour']) {
        // Set timepicker and its label
        elem = document.querySelector('#edit-start-time');
        instance = M.Timepicker.getInstance(elem);
        instance.clear();
        instance.destroy();
        instance = M.Timepicker.init(elem, {
            defaultTime: task['timeHour'] + ":" + task['timeMinute']
        });
        instance._updateTimeFromInput();
        instance.done();
        // Uncheck all-day event checkbox
        document.getElementById("all-day-event-checkbox").checked = false;
        // Make input enabled
        document.getElementById("edit-start-time").disabled = false;
    }
    else {
        // Set timepicker and its label to current time
        elem = document.querySelector('#edit-start-time');
        instance = M.Timepicker.getInstance(elem);
        instance.clear();
        instance.destroy();
        instance = M.Timepicker.init(elem, {
            defaultTime: 'now'
        });
        instance._updateTimeFromInput();
        instance.done();
        // Check all-day event checkbox
        document.getElementById("all-day-event-checkbox").checked = true;
        // Make input disabled
        document.getElementById("edit-start-time").disabled = true;
    }

    M.updateTextFields();
}
