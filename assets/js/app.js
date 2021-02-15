function createDate(day, month, year) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let date = "";
    date += (day.length === 1 ? "0" + day + " " : day + " ");
    date += months[month - 1] + " "
    date += year;
    return date;
}

function fillSideCardData() {
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
            document.getElementById("side-card-date").innerText = task["timeHour"] + ":" + task["timeMinute"];
        }
        else {
            document.getElementById("side-card-time").style.display = "none";
        }
    }
}