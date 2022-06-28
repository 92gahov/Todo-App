var dom = {
    output: document.querySelector(".output-main"),
    divMsgs: document.getElementsByClassName("output"),
    eventField: document.getElementById("event-field"),
    dateField: document.getElementById("date-field"),
    newBtn: document.getElementById("new-btn"),
    closeModal: document.querySelector(".close"),
    modal: document.querySelector(".modal"),
    todayEvent: document.getElementById("today-event")
};

let url = "http://localhost:3000";
let events = [];

let d = new Date().getDate();
let m = new Date().getMonth() + 1;
let y = new Date().getFullYear();
d = addZero(d);
m = addZero(m);
let today = `${d}.${m}.${y}`;

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    };
    return i;
};

function display(events) {
    let divMsgs = "";
    events.forEach(event => {
        divMsgs += `
        <div class="output">
            <div class="cal-icon">
                <img src="img/calendar-solid.svg">
            </div> 
            <div class="date-output">
                <p>${event.date}</p>
            </div> 
            <div class="event-info">
                <p class="todo-item ${event.completed ? "cross" : ""}"">${event.event}</p>
            </div>  
            <div class="check">
                <img src="img/circle-check-solid.svg" data-numcheck="${event.id}" title="Finish event !">
            </div>
            <div class="undo">
                <img src="img/undo.svg" data-numundo="${event.id}" title="Undo finish event !">
            </div>
            <div class="remove">
                <img src="img/trash-can-solid.svg" data-numdel="${event.id}" title="Delete event !">
            </div>
        </div>
        `
        dom.output.innerHTML = divMsgs;
    });
};

// Get event !

function getEvents() {
    fetch(url + "/todos")
        .then(response => {
            if (!response.ok) {
                alert("HTTP error" + response);
            }
            return response.json()
        })
        .then(data => {
            events = [...data];
            for (let i = 0; i < events.length; i++) {
                if (events[i].date === today && events[i].completed === false) {
                    dom.modal.style.display = "block";
                    dom.todayEvent.innerHTML = events[i].event;
                }
            }
            if (events[0] === undefined) {
                dom.output.style.display = "none";
            }
            else {
                dom.output.style.display = "block";
            }
            display(events);
            countEvents();
        });
};

// Delete event !

function deleteEvents(id) {
    fetch(url + "/todos/" + id, {
        method: "DELETE",
    })
        .then(response => {
            if (!response.ok) {
                alert("HTTP error" + response);
            }
            return response.json();
        })
        .then(() => {
            getEvents();
        });
};

// Change event completed !

function finishEvents(id) {
    const finishEvents = {
        completed: true
    }
    fetch(url + "/todos/" + id, {
        method: "PATCH",
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(finishEvents)
    })
        .then(response => {
            if (!response.ok) {
                alert("HTTP error" + response);
            }
            getEvents();
            return response.json();
        });
};

// Undo event !

function undoEvent(id) {
    const undoEvent = {
        completed: false
    }
    fetch(url + "/todos/" + id, {
        method: "PATCH",
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(undoEvent)
    })
        .then(response => {
            if (!response.ok) {
                alert("HTTP error" + response);
            }
            getEvents();
            return response.json();
        });
};

// Add new event !

function addEvents() {
    dateVal = dom.dateField.value.split("-");
    let dateFormat = `${dateVal[2]}.${dateVal[1]}.${dateVal[0]}`
    const newEv = {
        date: dateFormat,
        event: dom.eventField.value,
        completed: false
    };
    fetch(url + "/todos", {
        method: "POST",
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(newEv)
    })
        .then(response => {
            if (!response.ok) {
                alert("HTTP error" + response);
            }
            return response.json();
        })
        .then(ev => {
            events.push(ev);
            display(events);
            getEvents();
            countEvents();
        });
};

window.onload = () => {
    getEvents();
    focusInput();
};

function focusInput() {
    dom.eventField.focus();
};


dom.output.addEventListener("click", (e) => {
    let btn = e.target;
    let deleteBtn = parseInt(btn.dataset.numdel);
    if (e.target.tagName === "IMG" && e.target.getAttribute("data-numdel")) {
        deleteEvents(deleteBtn);
    };

    let btn2 = e.target;
    let checkBtn = parseInt(btn2.dataset.numcheck);
    if (e.target.tagName === "IMG" && e.target.getAttribute("data-numcheck")) {
        finishEvents(checkBtn);
    };

    let btn3 = e.target;
    let undoBtn = parseInt(btn3.dataset.numundo);
    if (e.target.tagName === "IMG" && e.target.getAttribute("data-numundo")) {
        undoEvent(undoBtn);
    };
});

dom.newBtn.addEventListener("click", () => {
    if (dom.eventField.value === "" || dom.dateField.value === "") {
        dom.eventField.value = "Event or date field empty!!!";
        dom.eventField.style.color = "red";
        return false;
    } else if (dom.eventField.value === "Event or date field empty!!!") {
        return false;
    }
    else {
        addEvents();
        focusInput();
    }
    dom.eventField.value = "";
    dom.dateField.value = "";
});

dom.eventField.addEventListener("focus", () => {
    dom.eventField.value = "";
    dom.eventField.style.color = "black";
});

dom.closeModal.addEventListener("click", () => {
    dom.modal.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(0)' }
    ], { duration: 300 });
    setTimeout(() => {
        dom.modal.style.display = "none";
    }, 270)
});

function countEvents() {
    let count = events.length;
    let title = ""
    document.getElementById("num").innerHTML = count;
    if (events.length === 1) {
        title = "event";
    } else {
        title = "events";
    }
    document.getElementById("title").innerHTML = title;
};


























