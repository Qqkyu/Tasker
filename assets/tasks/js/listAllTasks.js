function createDate(day, month, year) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let date = "";
    date += (day.length === 1 ? "0" + day + " " : day + " ");
    date += months[month - 1] + " "
    date += year;
    return date;
}

function createTime(hour, minute) {
    let time = "";
    time += (hour.length === 1 ? "0" + hour + ":" : hour + ":");
    time += (minute.length === 1 ? "0" + minute : minute);
    return time;
}

function tasksMarkTaskAsUndone(id) {
    markAsUndone(id);
    fillSideCardData(true);
    listAllTasks();
    document.getElementById(`tasks-mark-button-${id}`).onclick = function() { tasksMarkTaskAsDone(id); };
    document.getElementById(`tasks-mark-button-${id}`).innerHTML = `<i class="material-icons right">done</i>Mark as done`;
}

function tasksMarkTaskAsDone(id) {
    markAsDone(id);
    fillSideCardData(true);
    listAllTasks();
    document.getElementById(`tasks-mark-button-${id}`).onclick = function() { tasksMarkTaskAsUndone(id); };
    document.getElementById(`tasks-mark-button-${id}`).innerHTML = `<i class="material-icons right">done</i>Mark as undone`;
}

function tasksRemoveTask(id) {
    document.getElementById(`tasks-task-${id}`).classList.add("scale-out");
    setTimeout(function() {
        removeTask(id);
        fillSideCardData(true);
        listAllTasks();
    }, 500);
}

function createTasksContainerHTML(tasks) {
    let HTML = "", description, time, startDate, endDate;
    for(let i = 0; i < tasks.length; ++i) {
        const timeSpecified = (tasks[i]['timeHour'] !== "");
        const endDateSpecified = (tasks[i]['endDay'] !== "");
        if(tasks[i]['isDone'] === "1") {
            description = `<strike>${tasks[i]['description']}</strike>`;
            startDate = `<strike>${createDate(tasks[i]['startDay'], tasks[i]['startMonth'], tasks[i]['startYear'])}</strike>`;
            if(endDateSpecified) {
                endDate = `<strike>${createDate(tasks[i]['endDay'], tasks[i]['endMonth'], tasks[i]['endYear'])}</strike>`;
            }
            if(timeSpecified) {
                time = `<strike>${createTime(tasks[i]['timeHour'], tasks[i]['timeMinute'])}</strike>`;
            }
        }
        else {
            description = tasks[i]['description'];
            startDate = createDate(tasks[i]['startDay'], tasks[i]['startMonth'], tasks[i]['startYear']);
            if(endDateSpecified) {
                endDate = createDate(tasks[i]['endDay'], tasks[i]['endMonth'], tasks[i]['endYear']);
            }
            if(timeSpecified) {
                time = createTime(tasks[i]['timeHour'], tasks[i]['timeMinute']);
            }
        }
        HTML += `<div class="card blue-grey darken-1 hoverable scale-transition" id="tasks-task-${tasks[i]['id']}">` +
            `      <div class="card-content white-text side-card">` +
            `        <p class="card-main-text"><i class="small material-icons left">description</i>${description}</p>` +
            `        <p class="card-main-text"><i class="small material-icons left">date_range</i>${startDate}`;
        if(endDateSpecified) {
            HTML += ` - ${endDate}`;
        }
        HTML += '</p>' +
                `<p class="card-main-text"><i class="small material-icons left">timer</i>`;
        HTML += (timeSpecified ? `${time}` : 'Unspecified');
        HTML +=   `  </div>` +
            `  <div class="card-action side-card">`;
        if(tasks[i]['isDone'] === "0") {
            HTML += `<button class="waves-effect waves-light btn" onclick="tasksMarkTaskAsDone(${tasks[i]['id']});" id="tasks-mark-button-${tasks[i]['id']}">` +
                    `<i class="material-icons right">done</i>Mark as done`;
        }
        else {
            HTML += `<button class="waves-effect waves-light btn" onclick="tasksMarkTaskAsUndone(${tasks[i]['id']});" id="tasks-mark-button-${tasks[i]['id']}">` +
                    `<i class="material-icons right">done</i>Mark as undone`
        }
        HTML+= ` </button>` +
            `    <button class="waves-effect waves-light btn">` +
            `      <i class="material-icons right">edit</i>Edit` +
            `    </button>` +
            `    <button class="waves-effect waves-light btn" onclick="tasksRemoveTask(${tasks[i]['id']});">` +
            `      <i class="material-icons right">clear</i>Remove` +
            `    </button>` +
            `  </div>` +
            `</div>`;
    }
    return HTML;
}

function listAllTasks() {
    const tasks = fetchAllTasks();
    document.getElementById("task-cards-container").innerHTML = createTasksContainerHTML(tasks);
}