function todayCalendarTitle() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const today = new Date();
    const month = months[today.getMonth()];
    const year = today.getFullYear()
    document.getElementById("calendar-title").innerHTML = `<h2 class="calendar-container__title">${month} ${year}</h2>`;
}

function createCalendarTitle(nextMonth) {
    const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthsAbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const month = monthsAbr.indexOf(sessionStorage.getItem('month'));
    const year = parseInt(sessionStorage.getItem('year'));
    let calendarTitle = document.getElementById("calendar-title");
    if(nextMonth === 'next') {
        if(month === 11) {
            calendarTitle.innerHTML = `<h2 class="calendar-container__title">January ${(year + 1).toString()}</h2>`;
        }
        else {
            calendarTitle.innerHTML = `<h2 class="calendar-container__title">${fullMonths[month + 1]} ${year.toString()}</h2>`;
        }
    }
    else {
        if(month === 0) {
            calendarTitle.innerHTML = `<h2 class="calendar-container__title">December ${(year - 1).toString()}</h2>`;
        }
        else {
            calendarTitle.innerHTML = `<h2 class="calendar-container__title">${fullMonths[month - 1]} ${year.toString()}</h2>`;
        }
    }
}
