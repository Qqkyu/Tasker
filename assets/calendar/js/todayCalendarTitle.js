function createCalendarTitle() {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let today = new Date();
    let month = months[today.getMonth()];
    let year = today.getFullYear()
    return [
        '<h2 class="calendar-container__title">',
        month,
        year,
        '</h2>'
    ].join('\n');
}

document.write(createCalendarTitle());