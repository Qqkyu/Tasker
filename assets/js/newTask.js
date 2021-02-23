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
    if(!isAM) {
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

document.getElementById("newTaskForm").addEventListener("submit", event => {
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

    insertTask(description, startDateArr[0], startDateArr[1], startDateArr[2],
        endDateArr[0], endDateArr[1], endDateArr[2], startTimeArr[0], startTimeArr[1], "");

    const section = location.href.split("/").slice(-1)[0];
    if(section === "calendar.html") {
        fillSideCardData(true);
        fillCalendarBody('cur');
        listUpcomingEvents();
        calendarRemoveListAllTasks();
    }
    else if(section === "my_day.html") {
        fillSideCardData(true);
        listMyDayTasks();
    }
    else if(section === "tasks.html") {
        fillSideCardData(true);
        listAllTasks();
    }
});
