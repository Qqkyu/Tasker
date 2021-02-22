function createTime(hour, minute) {
    let time = "";
    time += (hour.length === 1 ? "0" + hour + ":" : hour + ":");
    time += (minute.length === 1 ? "0" + minute : minute);
    return time;
}

function createEventListDate(day, month) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let date = "";
    date += (day.length === 1 ? "0" + day + " " : day + " ");
    date += months[month - 1] + " "
    return date;
}

function eventsContainerHTML(tasks) {
/*
 * Create HTML for listing events from current month which have a starting date of today or later.
*/
    let HTML = "", description, time, startDate, endDate;
    HTML += `<span class="events__title">Upcoming events this month</span>`;
    for(let i = 0; i < tasks.length; ++i) {
        const timeSpecified = (tasks[i]['timeHour'] !== "");
        const endDateSpecified = (tasks[i]['endDay'] !== "");
        if(tasks[i]['isDone'] === "1") {
            description = `<strike>${tasks[i]['description']}</strike>`;
            startDate = `<strike>${createEventListDate(tasks[i]['startDay'], tasks[i]['startMonth'])}</strike>`;
            if(endDateSpecified) {
                endDate = `<strike>${createEventListDate(tasks[i]['endDay'], tasks[i]['endMonth'])}</strike>`;
            }
            if(timeSpecified) {
                time = `<strike>${createTime(tasks[i]['timeHour'], tasks[i]['timeMinute'])}</strike>`;
            }
        }
        else {
            description = tasks[i]['description'];
            startDate = createEventListDate(tasks[i]['startDay'], tasks[i]['startMonth']);
            if(endDateSpecified) {
                endDate = createEventListDate(tasks[i]['endDay'], tasks[i]['endMonth']);
            }
            if(timeSpecified) {
                time = createTime(tasks[i]['timeHour'], tasks[i]['timeMinute']);
            }
        }
        HTML += `<ul class="events__list">` +
                `<li class="events__item">` +
                `<div class="events__item--left">` +
                `<span class="events__name">${tasks[i]['description']}</span>` +
                `<span class="events__date">${startDate}`;
        HTML += (endDateSpecified ? ` - ${endDate}</span>` : `</span>`);
        HTML += `</div>`;
        if(timeSpecified) {
            HTML += `<span class="events__tag">${time}</span>`;
        }
        else {
            HTML += `<span class="events__tag events__tag--highlighted">All day</span>`;
        }
        HTML += `</li>` +
                `</ul>`;
    }
    return HTML;
}

function listUpcomingEvents() {
/*
 * List events from current month which have a starting date of today or later.
*/
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const tasks = fetchMonthTasksSinceDay(day.toString(), month.toString(), year.toString());
    document.getElementById("events-container").innerHTML = eventsContainerHTML(tasks);
}