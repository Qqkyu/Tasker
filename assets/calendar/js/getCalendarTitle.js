document.open();

let fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let monthsAbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let nextMonthType = document.getElementById("calendar-title").getAttribute("nextMonth")

function createCalendarTitle() {
    let month = monthsAbr.indexOf(sessionStorage.getItem('month'));
    let year = parseInt(sessionStorage.getItem('year'));
    if(nextMonthType === 'next') {
        if (month === 11) {
            document.write([
                '<h2 class="calendar-container__title">January',
                (year + 1).toString(),
                '</h2>'
            ].join('\n'));
        }
        else {
            document.write([
                '<h2 class="calendar-container__title">',
                fullMonths[month + 1],
                year.toString(),
                '</h2>'
            ].join('\n'));
        }
    }
    else {
        if (month === 0) {
            document.write([
                '<h2 class="calendar-container__title">December',
                (year - 1).toString(),
                '</h2>'
            ].join('\n'));
        }
        else {
            document.write([
                '<h2 class="calendar-container__title">',
                fullMonths[month - 1],
                year.toString(),
                '</h2>'
            ].join('\n'));
        }
    }
}

createCalendarTitle();
document.close();
