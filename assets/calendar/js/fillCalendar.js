function monthTaskDays(month, year) {
/*
 * Fetches all tasks from given month and year and returns an array of objects consisting of information
 * about the dates of tasks of a particular month.
*/
    const tasks = fetchAllTasks("", "", month.toString(), year.toString(), "", "", "", "", "", "");
    let daysOfTasks = [];
    for(let i = 0; i < tasks.length; ++i) {
        if(tasks[i]['endDay'] !== "") {
            daysOfTasks.push({
               startDay: tasks[i]['startDay'],
               endDay: tasks[i]['endDay'],
               multiDayEvent: true
            });
        }
        else {
            daysOfTasks.push({
               day: tasks[i]['startDay'],
               multiDayEvent: false
            });
        }
    }
    return daysOfTasks;
}

function eventDays(numberOfDays, daysOfTasks) {
/*
 * Takes in array of objects from monthTaskDays() function and creates an array of length numberOfDays,
 * where every day (index) is marked one of three options:
 *  - "multi": there is at least one task which is multi-day on that day,
 *  - "single": there is at least one task which is single-day on that day,
 *  - "none": no tasks on that day.
 * Multi-day events take precedence over single-day events, so if there are two tasks on a single day and one
 * of them is multi-day when the other is single-day, multi-day option will be chosen.
 * Index 0 represents first day of the month, index 1 second day of the month etc.
*/
    const eventDays = [];
    let singleDayEvents = [], multiDayEvents = [];
    daysOfTasks.forEach(obj => {
        if(obj.multiDayEvent) {
            multiDayEvents.push(obj);
        }
        else {
            singleDayEvents.push(obj);
        }
    });

    // At the beginning mark multi-day events as they take precedence over single-day events
    multiDayEvents.forEach(obj => {
        const startDay = parseInt(obj.startDay), endDay = parseInt(obj.endDay);
        for(let i = (startDay - 1); i <= (endDay - 1); ++i) {
            eventDays[i] = "multi";
        }
    });

    // After multi-day events, mark single-day event (if multi-day event is not already marked on that day)
    singleDayEvents.forEach(obj => {
       const day = parseInt(obj.day);
       if(!eventDays[day - 1]) {
           // No multi-day event on this day, mark single-day event
           eventDays[day - 1] = "single";
       }
    });

    // Mark other days to "none" as they have no events on them
    for(let i = 0; i < numberOfDays; ++i) {
        if(!eventDays[i]) {
            eventDays[i] = "none";
        }
    }

    return eventDays;
}

function determineNextMonth(nextMonth) {
/*
 * Function takes one argument 'nextMonth' which can take 2 values resulting in 2 different outcomes:
 *  - 'prev': return previous month,
 *  - 'next': return next month,
 * If nextMonth has any different value, function will return current month.
*/
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Get current month.
    let curMonth = sessionStorage.getItem('month');
    if (curMonth) {
        if (nextMonth === 'next') {
            if (curMonth === "Dec") {
                curMonth = "Jan";
            }
            else {
                curMonth = months[months.indexOf(curMonth) + 1];
            }
        }
        else if (nextMonth === 'prev') {
            if (curMonth === "Jan") {
                curMonth = "Dec";
            }
            else {
                curMonth = months[months.indexOf(curMonth) - 1];
            }
        }
    }
    else {
        let today = new Date();
        curMonth = months[today.getMonth()];
    }
    return curMonth;
}

function determineNextYear(curMonth, nextMonth) {
/*
 * Function takes an argument 'nextMonth' which can take 2 values resulting in 2 different outcomes:
 *  - 'prev': return month previous to 'curMonth',
 *  - 'next': return month next to 'curMonth',
 * If nextMonth has any different value, function will return current year.
*/
    // Get current year.
    let curYear = sessionStorage.getItem('year');
    if (curYear) {
        if (nextMonth === 'next' && curMonth === "Jan") {
            let nextYear = parseInt(curYear) + 1;
            curYear = nextYear.toString();
        }
        else if (nextMonth === 'prev' && curMonth === "Dec") {
            let prevYear = parseInt(curYear) - 1;
            curYear = prevYear.toString();
        }
    }
    else {
        let today = new Date();
        curYear = today.getFullYear();
    }
    return curYear;
}

function HTMLInfo(monthHTML, colCounter) {
/*
 * Auxiliary function which returns object with created HTML and number of columns in current row.
*/
    this.HTML = monthHTML;
    this.columnCounter = colCounter;
}

function currentDayHTML(daysOfTasks, day, lastDay) {
/*
 * Based on the array daysOfTasks from eventDays() function create HTML for a single day which
 * is being created in main month (in particular no "calendar-table__inactive" class).
*/
    // Check for events on current day
    if(daysOfTasks[day - 1] === "multi") {
        if(day === 1 || daysOfTasks[day - 2] !== "multi") {
            // Beginning of multi-day event, insert starting multi-day event day
            return `<div class="calendar-table__col calendar-table__event calendar-table__event--long calendar-table__event--start"><div class="calendar-table__item"><span>${day}</span></div></div>`;
        }
        else if(day === lastDay || daysOfTasks[day] !== "multi") {
            // End of multi-day event, insert ending multi-day event day
            return `<div class="calendar-table__col calendar-table__event calendar-table__event--long calendar-table__event--end"><div class="calendar-table__item"><span>${day}</span></div></div>`;
        }
        else {
            // Neither starting nor ending day, insert normal event day
            return `<div class="calendar-table__col calendar-table__event calendar-table__event--long"><div class="calendar-table__item"><span>${day}</span></div></div>`;
        }
    }
    else if(daysOfTasks[day - 1] === "single") {
        return `<div class="calendar-table__col calendar-table__event"><div class="calendar-table__item"><span>${day}</span></div></div>`;
    }
    else {
        return `<div class="calendar-table__col"><div class="calendar-table__item"><span>${day}</span></div></div>`;
    }
}

function currentInactiveDayHTML(daysOfTasks, day, lastDay) {
/*
 * Based on the array daysOfTasks from eventDays() function create HTML for a single day which
 * is being created in either previous or next month (hence adding "calendar-table__inactive" class).
*/
    // Check for events on current day
    if(daysOfTasks[day - 1] === "multi") {
        if(day === 1 || daysOfTasks[day - 2] !== "multi") {
            // Beginning of multi-day event, insert starting multi-day event day
            return `<div class="calendar-table__col calendar-table__event calendar-table__event--long calendar-table__event--start calendar-table__inactive"><div class="calendar-table__item"><span>${day}</span></div></div>`;
        }
        else if(day === lastDay || daysOfTasks[day] !== "multi") {
            // End of multi-day event, insert ending multi-day event day
            return `<div class="calendar-table__col calendar-table__event calendar-table__event--long calendar-table__event--end calendar-table__inactive"><div class="calendar-table__item"><span>${day}</span></div></div>`;
        }
        else {
            // Neither starting nor ending day, insert normal event day
            return `<div class="calendar-table__col calendar-table__event calendar-table__event--long calendar-table__inactive"><div class="calendar-table__item"><span>${day}</span></div></div>`;
        }
    }
    else if(daysOfTasks[day - 1] === "single") {
        return `<div class="calendar-table__col calendar-table__event calendar-table__inactive"><div class="calendar-table__item"><span>${day}</span></div></div>`;
    }
    else {
        return `<div class="calendar-table__col calendar-table__inactive"><div class="calendar-table__item"><span>${day}</span></div></div>`;
    }
}

function createPrevMonthHTML(month, year, colCounter) {
/*
 * Create HTML for calendar body previous month empty cells with inactive days.
*/
    const prevMonth = (month === 0 ? 11 : month - 1);
    const numberOfDays = new Date(year, prevMonth + 1, 0).getDate();
    const daysOfTasks = eventDays(numberOfDays, monthTaskDays(prevMonth + 1, year));
    let prevMonthHTML = "";
    let colsToInsert = (new Date(year, month, 1).getDay()) - 1;
    if (colsToInsert === -1) {
        colsToInsert = 6;
    }
    // Create new row.
    prevMonthHTML += '<div class="calendar-table__row">';
    // Find amount of days in previous month and insert columns.
    let firstDay = (new Date(year, month, 0)).getDate() - colsToInsert + 1;
    for (let i = 0; i < colsToInsert; ++i) {
        prevMonthHTML += currentInactiveDayHTML(daysOfTasks, firstDay, numberOfDays);
        firstDay++;
        colCounter++;
    }
    return new HTMLInfo(prevMonthHTML, colCounter);
}

function createMainMonthHTML(month, year, colCounter) {
/*
 * Create HTML for calendar body main month.
*/
    let today = new Date();
    let lastDay = new Date(year, month + 1, 0).getDate();
    let mainMonthHTML = '';
    const daysOfTasks = eventDays(lastDay, monthTaskDays(month + 1, year));
    // If it's current month and year, program has to highlight current day.
    if (today.getMonth() === month && today.getFullYear() === year) {
        let day = today.getDate();
        for (let i = 1; i <= lastDay; ++i) {
            // Finish row after every 7 columns.
            if (colCounter === 7) {
                mainMonthHTML += '</div><div class="calendar-table__row">';
                colCounter = 0;
            }
            // Check if we're inserting current day.
            if (day === i) {
                mainMonthHTML += `<div class="calendar-table__col calendar-table__today"><div class="calendar-table__item"><span>${i}</span></div></div>`;
            }
            else {
                mainMonthHTML += currentDayHTML(daysOfTasks, i, lastDay);
            }
            colCounter++;
        }
    }
    else {
        for (let i = 1; i <= lastDay; ++i) {
            if (colCounter === 7) {
                mainMonthHTML += `</div><div class="calendar-table__row">`;
                colCounter = 0;
            }
            mainMonthHTML += currentDayHTML(daysOfTasks, i, lastDay);
            colCounter++;
        }
    }
    return new HTMLInfo(mainMonthHTML, colCounter);
}

function createNextMonthHTML(month, year, colCounter) {
/*
 * Create HTML for calendar body next month empty cells with inactive days.
*/
    const nextMonth = (month === 11 ? 0 : month + 1);
    const numberOfDays = new Date(year, nextMonth + 1, 0).getDate();
    const daysOfTasks = eventDays(numberOfDays, monthTaskDays(nextMonth + 1, year));
    let nextMonthHTML = "";
    let i = 1;
    while (colCounter < 7) {
        nextMonthHTML += currentInactiveDayHTML(daysOfTasks, i, numberOfDays);
        i++;
        colCounter++;
    }
    nextMonthHTML += `</div>`;
    return new HTMLInfo(nextMonthHTML, colCounter);
}

function fillCalendarBody(nextMonth) {
/*
 * Function takes one argument 'nextMonth' which can take 2 values resulting in 2 different outcomes:
 *  - 'prev': take current month and fill calendar body of a month previous to it,
 *  - 'next': take current month and fill calendar body of a month next to it,
 * If nextMonth has any different value, calendar body will be filled with current month.
 * In addition to changing calendar body function sets nextMonth in sessionStorage and year as a result
 * of changing month.
*/
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const curMonth = determineNextMonth(nextMonth);
    sessionStorage.setItem('month', curMonth);

    const curYear = determineNextYear(curMonth, nextMonth);
    sessionStorage.setItem('year', curYear.toString());

    let calendarBody = document.getElementById("calendar-body");
    calendarBody.innerHTML = "";

    const month = months.indexOf(curMonth);
    const year = parseInt(curYear);

    const prevMonthInfo = createPrevMonthHTML(month, year, 0);
    const mainMonthInfo = createMainMonthHTML(month, year, prevMonthInfo.columnCounter);
    const nextMonthInfo = createNextMonthHTML(month, year, mainMonthInfo.columnCounter);

    calendarBody.innerHTML = prevMonthInfo.HTML + mainMonthInfo.HTML + nextMonthInfo.HTML;
}