document.open();
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let type = document.getElementById("main-cal-section").getAttribute("nextMonth")

// Get current month.
let curMonth = sessionStorage.getItem('month');
if (curMonth) {
    if(type === 'next') {
        if (curMonth === "Dec") {
            curMonth = "Jan";
        }
        else {
            curMonth = months[months.indexOf(curMonth) + 1];
        }
    }
    else if(type === 'prev') {
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
sessionStorage.setItem('month', curMonth);

// Get current year.
let curYear = sessionStorage.getItem('year');
if (curYear) {
    if(type === 'next' && curMonth === "Jan") {
        let nextYear = parseInt(curYear) + 1;
        curYear = nextYear.toString();
        sessionStorage.setItem('year', nextYear.toString());
    }
    else if(type === 'prev' && curMonth === "Dec") {
        let prevYear = parseInt(curYear) - 1;
        curYear = prevYear.toString();
        sessionStorage.setItem('year', prevYear.toString());
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
    let today = new Date();
    let lastDay = new Date(year, month + 1, 0).getDate();
    // If it's current month and year, program has to highlight current day.
    if(today.getMonth() === month && today.getFullYear() === year) {
        let day = today.getDate();
        for (let i = 1; i <= lastDay; ++i) {
            // Finish row after every 7 columns.
            if (colCounter === 7) {
                document.write([
                    '</div>',
                    '<div class="calendar-table__row">'
                ].join('\n'));
                colCounter = 0;
            }
            // Check if we're inserting current day.
            if(day === i) {
                document.write([
                    '<div class="calendar-table__col calendar-table__today"><div class="calendar-table__item"><span>',
                    i,
                    '</span></div></div>'
                ].join('\n'));
            }
            else {
                document.write([
                    '<div class="calendar-table__col"><div class="calendar-table__item"><span>',
                    i,
                    '</span></div></div>'
                ].join('\n'));
            }
            colCounter++;
        }
    }
    else {
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
document.close();
