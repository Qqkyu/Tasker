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

function smoothTransition() {
    let sideCard = document.getElementById("side-card");
    sideCard.classList.remove("scale-in");
    sideCard.classList.add("scale-out");
    setTimeout(function () {
        sideCard.classList.remove("scale-out");
        sideCard.classList.add("scale-in");
    }, 500);
}

function fillSideCardData() {
    smoothTransition();
    let task = fetchClosestTask();
    if(Object.keys(task).length === 0) {
        // Currently no future tasks in database
        document.getElementById("side-card").style.visibility = "hidden";
    }
    else {
        document.getElementById("side-card-description").innerText = task["description"];

        let date = createDate(task["startDay"], task["startMonth"], task["startYear"]);
        if(task["endDay"] !== "") {
            date += " - " + createDate(task["endDay"], task["endMonth"], task["endYear"]);
        }
        document.getElementById("side-card-date").innerText = date;

        if(task["timeHour"] !== "") {
            document.getElementById("side-card-time").innerText = createTime(task["timeHour"], task["timeMinute"]);
        }
        else {
            document.getElementById("side-card-time").style.display = "none";
        }

        document.getElementById("reminder-mark-as-done-btn").onclick = function() {
            markAsDone(task["id"]);
            fillSideCardData();
        };
    }
}