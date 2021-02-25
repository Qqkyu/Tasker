let editTaskCurID;

function normalizeDate(date) {
    /*
     * Takes date in a format of "Month dd, yyyy", for example: Feb 22, 2021
     * and returns array of length 3 with day, month and year respectively
     * in numerical representation, returns array with 3 empty strings if falsy
     * value is passed.
    */
    if(!date) {
        return ["","",""];
    }
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const arrDate = date.split(' ');    // 0: month, 1: day, 2: year
    return [arrDate[1].slice(0, -1), months.indexOf(arrDate[0]) + 1, arrDate[2]];
}

function normalizeTime(time) {
    /*
     * Takes time in a format of "hh:mm AM/PM", for example: 20:30
     * and returns array of length 2 with an hour and minutes repectively,
     * returns array with 2 empty strings if falsy value is passed.
    */
    if(!time) {
        return ["",""];
    }
    const isAM = (time.slice(-2) === "AM");
    time = time.substring(0, 5);
    if(isAM) {
        let arrTime = time.split(':');
        arrTime[0] = (parseInt(arrTime[0]) + 12).toString();
        return arrTime;
    }
    return time.split(':');
}

function descriptionValidation(description) {
    return description.length > 0;
}

function datesValidation(startDay, startMonth, startYear, endDay, endMonth, endYear) {
    if(endDay == "") {
        return true;
    }
    if(endYear < startYear) {
        return false;
    }
    if(endYear > startYear) {
        return true;
    }
    else {
        // Equal years - check months
        if(endMonth < startMonth) {
            return false;
        }
        if(endMonth > startMonth) {
            return true;
        }
        // Equal years and months - check days
        return startDay <= endDay;
    }
}

function editTask(id) {
/*
 * Function which is called after 'Edit' button was clicked on some task. Fetch task
 * with passed-in ID from database and fill modal with appropriate data.
*/
    editTaskCurID = id;
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

document.getElementById("editTaskForm").addEventListener("submit", event => {
    event.preventDefault();

    const form = new FormData(event.target);
    const description = form.get("description");
    const startDate = form.get("start-date");
    const endDate = form.get("end-date");
    const startTime = form.get("start-time");

    if(!descriptionValidation(description)) {
        return false;
    }

    // Extract dates components and save it
    const startDateArr = normalizeDate(startDate);
    const endDateArr = normalizeDate(endDate);

    if(!datesValidation(startDateArr[0], startDateArr[1], startDate[2], endDateArr[0], endDateArr[1], endDateArr[2])) {
        return false;
    }

    // Extract time components and save it
    const startTimeArr = normalizeTime(startTime);

    modifyTask(editTaskCurID, description, startDateArr[0], startDateArr[1], startDateArr[2],
        endDateArr[0], endDateArr[1], endDateArr[2], startTimeArr[0], startTimeArr[1], "");

    const section = location.href.split("/").slice(-1)[0];
    if(section === "my_day.html") {
        fillSideCardData(true);
        listMyDayTasks();
    }
    else if(section === "tasks.html") {
        fillSideCardData(true);
        listAllTasks();
    }
});
