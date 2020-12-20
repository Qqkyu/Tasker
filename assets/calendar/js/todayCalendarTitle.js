function createCalendarTitle() {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var today = new Date();
    var month = months[today.getMonth()];
    var year = today.getFullYear()
    return [
        '<h2 class="calendar-container__title">',
        month,
        year,
        '</h2>'
    ].join('\n');
}

document.write(createCalendarTitle());