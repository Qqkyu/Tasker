let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Get current month.
let curMonth = sessionStorage.getItem('month');
if (curMonth) {
    if(fillCalendar.attr('nextMonth') === 'next') {
        if (curMonth === "Dec") {
            curMonth = "Jan";
        }
        else {
            curMonth = months[months.indexOf(curMonth) + 1];
        }
    }
    else {
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
sessionStorage.setItem('month', months[curMonth]);

// Get current year.
let curYear = sessionStorage.getItem('year');
if (curYear) {
    if(fillCalendar.attr('nextMonth') === 'next' && curMonth === "Dec") {
        ++curYear;
        sessionStorage.setItem('year', curYear.toString());
    }
    else if(fillCalendar.attr('nextMonth') === 'prev' && curMonth === "Jan") {
        --curYear;
        sessionStorage.setItem('year', curYear.toString());
    }
}
else {
    let today = new Date();
    curYear = today.getFullYear();
    sessionStorage.setItem('year', curYear.toString());
}

function fillPrevMonth(month, year, colCounter) {
    // Find first day of the month so we know how many columns to insert.
    let colsToInsert = (new Date(year, month, 1).getDay()) - 1;
    if (colsToInsert === -1) {
        colsToInsert = 6;
    }
    // Create new row.
    document.write([
        '<div class="calendar-table__row">'
    ].join('\n'));
    // Find amount of days in previous month and insert columns.
    let firstDay = (new Date(year, month, 0)).getDate() - colsToInsert + 1;
    for (let i = 0; i < colsToInsert; ++i) {
        document.write([
            '<div class="calendar-table__col calendar-table__inactive"><div class="calendar-table__item"><span>',
            firstDay,
            '</span></div></div>'
        ].join('\n'));
        firstDay++;
        colCounter++;
    }
    return colCounter;
}

function fillMainMonth(month, year, colCounter) {
    let lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; ++i) {
        if (colCounter === 7) {
            document.write([
                '</div>',
                '<div class="calendar-table__row">'
            ].join('\n'));
            colCounter = 0;
        }
        document.write([
            '<div class="calendar-table__col"><div class="calendar-table__item"><span>',
            i,
            '</span></div></div>'
        ].join('\n'));
        colCounter++;
    }
    return colCounter;
}

function fillNextMonth(month, year, colCounter) {
    let i = 1;
    while (colCounter < 7) {
        document.write([
            '<div class="calendar-table__col  calendar-table__inactive"><div class="calendar-table__item"><span>',
            i,
            '</span></div></div>'
        ].join('\n'));
        i++;
        colCounter++;
    }
    document.write([
        '</div>'
    ].join('\n'));
}

function fillCalendar(month, year) {
    let colCounter = 0;
    colCounter = fillPrevMonth(month, year, colCounter);
    colCounter = fillMainMonth(month, year, colCounter);
    fillNextMonth(month, year, colCounter);
}

fillCalendar(months.indexOf(curMonth), parseInt(curYear));