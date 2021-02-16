function createTime(hour, minute) {
    let time = "";
    time += (hour.length === 1 ? "0" + hour + ":" : hour + ":");
    time += (minute.length === 1 ? "0" + minute : minute);
    return time;
}

function createMyDayContainerHTML(tasks) {
    let HTML = "", description, time;
    for(let i = 0; i < tasks.length; ++i) {
        let timeSpecified = (tasks[i]['timeHour'] !== "");
        if(tasks[i]['isDone'] === "1") {
            description = `<strike>${tasks[i]['description']}</strike>`;
            if(timeSpecified) {
                time = `<strike>${createTime(tasks[i]['timeHour'], tasks[i]['timeMinute'])}</strike>`;
            }
        }
        else {
            description = tasks[i]['description'];
            if(timeSpecified) {
                time = createTime(tasks[i]['timeHour'], tasks[i]['timeMinute']);
            }
        }
        HTML += `<div class="card blue-grey darken-1 hoverable">` +
                `  <div class="card-content white-text side-card">` +
                `    <p class="card-main-text"><i class="small material-icons left">description</i>${description}</p>`;
        if(timeSpecified) {
            HTML += `<p class="card-main-text"><i class="small material-icons left">timer</i>${time}</p>`;
        }
        HTML +=   `  </div>` +
                  `  <div class="card-action side-card">` +
                  `    <button class="waves-effect waves-light btn" onclick="markAsDone(${tasks[i]['id']}); fillSideCardData(true); listMyDayTasks();">` +
                  `      <i class="material-icons right">done</i>Mark as done` +
                  `    </button>` +
                  `    <button class="waves-effect waves-light btn">` +
                  `      <i class="material-icons right">edit</i>Edit` +
                  `    </button>` +
                  `    <button class="waves-effect waves-light btn" onclick="removeTask(${tasks[i]['id']}); fillSideCardData(true); listMyDayTasks();">` +
                  `      <i class="material-icons right">clear</i>Remove` +
                  `    </button>` +
                  `  </div>` +
                  `</div>`;
    }
    return HTML;
}

function listMyDayTasks() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const tasks = fetchAllTasks("", day.toString(), month.toString(), year.toString(), "", "", "", "", "", "");
    document.getElementById("my-day-task-container").innerHTML = createMyDayContainerHTML(tasks);
}