let processes = [];
let numProc;
let currentTime = 0;
let idleTime = 0;
let ATT = 0;
let AWT = 0;
let timeQ;

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let currentElement = arr[i];
    let j = i - 1;

    // Ensure 'arrivalTime' property exists and is comparable
    while (
      j >= 0 &&
      typeof arr[j].arrivalTime === "number" &&
      typeof currentElement.arrivalTime === "number" &&
      arr[j].arrivalTime > currentElement.arrivalTime
    ) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = currentElement;
  }
  return arr;
}

// function createQueue() {
//   const items = [];

//   function enqueue(element) {
//     return items.push(element);
//   }

//   function dequeue() {
//     if (isEmpty()) {
//       console.log("Queue is Empty");
//     } else {
//       return items.shift();
//     }
//   }

//   function isEmpty() {
//     return items.length === 0;
//   }

//   function size() {
//     return items.length;
//   }

//   return { enqueue, dequeue, isEmpty, size, items };
// }

numProcInput = document.querySelector("input");

function getNumProc() {
  let formFeild = document.querySelector("#formFieldsContainer");
  formFeild.innerHTML = "";

  numProc = numProcInput.value;
  let div = document.querySelector("#InputOfNumberOfProcesses");
  div.style.display = "none";

  if (numProc > 1 && numProc < 11) {
    timeQ = document.createElement("input");
    timeQ.setAttribute("type", "number");
    timeQ.setAttribute("placeholder", `Enter the Time Quantum `);
    timeQ.setAttribute("required", true);
    timeQ.setAttribute("name", `timeQ`);
    timeQ.setAttribute("id", `timeQ-input`);
    timeQ.setAttribute("min", 1);

    formFeild.appendChild(timeQ);
    for (let i = 0; i < numProc; i++) {
      let pId = `P${i + 1}`;

      // Create container div for arrival time and burst time
      let processContainer = document.createElement("div");
      processContainer.setAttribute("id", "processContainer");

      // Arrival Time input
      let arrivalTime = document.createElement("input");
      arrivalTime.setAttribute("id", `arrivalTime${pId}`);
      arrivalTime.setAttribute("type", "number");
      arrivalTime.setAttribute("placeholder", `${pId} Arrival Time`);
      arrivalTime.setAttribute("required", true);
      arrivalTime.setAttribute("name", `arrivalTime${pId}`);

      // Burst Time input
      let burstTime = document.createElement("input");
      burstTime.setAttribute("id", `burstTime${pId}`);
      burstTime.setAttribute("type", "number");
      burstTime.setAttribute("placeholder", `${pId} burst Time`);
      burstTime.setAttribute("required", true);
      burstTime.setAttribute("min", 1);
      burstTime.setAttribute("name", `burstTime${pId}`);

      // Append inputs to container
      processContainer.appendChild(arrivalTime);
      processContainer.appendChild(burstTime);

      // Append container to form
      formFeild.appendChild(processContainer);
    }

    let formBtn = document.createElement("input");
    formBtn.setAttribute("type", "submit");
    formBtn.setAttribute("value", "Submit");
    formBtn.setAttribute("id", "submitData");
    formBtn.setAttribute("class", "form-buttons");

    formFeild.appendChild(formBtn);
  } else {
    let errorDiv = document.createElement("div");
    errorDiv.innerText =
      "Number of process must be greater then 1 and less the 11";
    errorDiv.setAttribute("class", "inputError");

    formFeild.appendChild(errorDiv);

    setTimeout(() => {
      location.reload();
    }, 2000);
  }
}

let numProcBtn = document.querySelector("#numProcBtn");
numProcBtn.addEventListener("click", getNumProc);
numProcInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    getNumProc();
  }
});

function procData() {
  let formFeildDiv = document.querySelector(".formContainer");
  formFeildDiv.style.display = "none";

  for (let i = 0; i < numProc; i++) {
    let pId = `P${i + 1}`;
    let arrivalTime = document.querySelector(`#arrivalTime${pId}`).value;
    let burstTime = document.querySelector(`#burstTime${pId}`).value;

    processes.push({
      name: pId,
      arrivalTime: arrivalTime,
      burstTime: burstTime,
      rem_burstTime: burstTime,
      turnArroundTime: 0,
      waitingTime: 0,
      completionTime: 0,
    });
  }
  // console.log(processes);
}

function runSchAlgo(event) {
  event.preventDefault();

  procData();
  insertionSort(processes);

  // let queue = createQueue();
  // for (let proc of processes) {
  //   queue.enqueue(proc);
  // };

  for (let i = 0; i < processes.length; i++) {
    let currProcess = processes[i];
    console.log("current time:", currentTime);

    if (currProcess.arrivalTime <= currentTime) {
      if (currProcess.rem_burstTime > 0) {
        const executeTime = Math.min(currProcess.rem_burstTime, timeQ.value);
        let createBox = `<div><p id="${currProcess.name}">${currentTime}</p><div>${currProcess.name}</div></div>`;
        document.getElementById("ganttChart").innerHTML += createBox;

        currentTime += executeTime;
        currProcess.rem_burstTime -= executeTime;

        if (currProcess.rem_burstTime == 0) {
          currProcess.completionTime = currentTime;
          currProcess.turnArroundTime =
            currProcess.completionTime - currProcess.arrivalTime;

          currProcess.waitingTime =
            currProcess.turnArroundTime - currProcess.burstTime;

          ATT += currProcess.turnArroundTime;
          AWT += currProcess.waitingTime;
        }

        if (
          processes[i + 1] !== undefined &&
          processes[i + 1].arrivalTime > currentTime
        ) {
          idleTime = processes[i + 1].arrivalTime - currentTime;
          currentTime += idleTime;
          console.log("Idle time:", idleTime);
        }

        if (currProcess.rem_burstTime > 0) {
          processes.push(currProcess);
        }
      }
    } else if (processes[i].arrivalTime > currentTime) {
      idleTime = processes[i].arrivalTime - currentTime;
      let createBox = `<div><p>${currentTime}</p><div>Idle</div></div>`;
      document.getElementById("ganttChart").innerHTML += createBox;
      currentTime += idleTime;
      console.log("idle time:", idleTime);
      i--;
    }
  }
  let createBox = `<div><p>${
    processes[processes.length - 1].completionTime
  }</p></div>`;
  document.getElementById("ganttChart").innerHTML += createBox;
  setTimeout(() => {
    document.querySelector("#ganttChart").classList.add("show");
  }, 500);

  let tableHTML = `<table>
    <caption>Round Robin Scheduluing Table</caption>
    <thead>
        <tr>
            <th>Process ID</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>Completion Time</th>
            <th>Turn Around Time</th>
            <th>Waiting Time</th>
        </tr>
    </thead>
 `;

  for (let i = 0; i < numProc; i++) {
    tableHTML += `<tr>
        <td>${processes[i].name}</td>
        <td>${processes[i].arrivalTime}</td>
        <td>${processes[i].burstTime}</td>
        <td>${processes[i].completionTime}</td>
        <td>${processes[i].turnArroundTime}</td>
        <td>${processes[i].waitingTime}</td>
    </tr>`;
  }
  ATT = Math.fround(ATT / numProc);
  AWT = Math.fround(AWT / numProc);
  tableHTML += `<tr>
        <td colspan="3"> <b>Average Turn Around Time: ${ATT}</b></td>
        <td colspan="3"><b>Average Waiting Time: ${AWT}</b></td>
             </tr>`;

  tableHTML += "</table>";

  document.getElementById("table").innerHTML = tableHTML;

  setTimeout(() => {
    document.querySelector("table").classList.add("show");
  }, 500);
  setTimeout(() => {
    console.log("Processes with updated information:", processes);
  }, 4000);
}
