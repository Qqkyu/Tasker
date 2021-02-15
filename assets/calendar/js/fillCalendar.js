function determineNextMonth(nextMonth) {
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
    this.HTML = monthHTML;
    this.columnCounter = colCounter;
}

function createPrevMonthHTML(month, year, colCounter) {
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
        prevMonthHTML += `<div class="calendar-table__col calendar-table__inactive"><div class="calendar-table__item"><span>${firstDay}</span></div></div>`;
        firstDay++;
        colCounter++;
    }
    return new HTMLInfo(prevMonthHTML, colCounter);
}

function createMainMonthHTML(month, year, colCounter) {
    let today = new Date();
    let lastDay = new Date(year, month + 1, 0).getDate();
    let mainMonthHTML = '';
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
                mainMonthHTML += `<div class="calendar-table__col"><div class="calendar-table__item"><span>${i}</span></div></div>`;
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
            mainMonthHTML += `<div class="calendar-table__col"><div class="calendar-table__item"><span>${i}</span></div></div>`;
            colCounter++;
        }
    }
    return new HTMLInfo(mainMonthHTML, colCounter);
}

function createNextMonthHTML(month, year, colCounter) {
    let nextMonthHTML = "";
    let i = 1;
    while (colCounter < 7) {
        nextMonthHTML += `<div class="calendar-table__col  calendar-table__inactive"><div class="calendar-table__item"><span>${i}</span></div></div>`;
        i++;
        colCounter++;
    }
    nextMonthHTML += `</div>`;
    return new HTMLInfo(nextMonthHTML, colCounter);
}

function fillCalendarBody(nextMonth) {
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