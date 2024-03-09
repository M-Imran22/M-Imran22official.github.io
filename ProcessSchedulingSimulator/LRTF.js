let processes = [];
let numProc;
let currentTime = 0;
let idleTime = 0;
let ATT = 0;
let AWT = 0;

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
numProcInput = document.querySelector("input");

function getNumProc() {
  let formFeild = document.querySelector("#formFieldsContainer");
  formFeild.innerHTML = "";

  numProc = numProcInput.value;
  let div = document.querySelector("#InputOfNumberOfProcesses");
  div.style.display = "none";

  if (numProc > 1 && numProc < 11) {
    for (let i = 0; i < numProc; i++) {
      let pId = `P${i + 1}`;

      let processContainer = document.createElement("div");
      processContainer.setAttribute("id", "processContainer");

      let arrivalTime = document.createElement("input");
      arrivalTime.setAttribute("id", `arrivalTime${pId}`);
      arrivalTime.setAttribute("type", "number");
      arrivalTime.setAttribute("placeholder", `${pId} Arrival Time`);
      arrivalTime.setAttribute("required", true);
      arrivalTime.setAttribute("name", `arrivalTime${pId}`);

      let burstTime = document.createElement("input");
      burstTime.setAttribute("id", `burstTime${pId}`);
      burstTime.setAttribute("type", "number");
      burstTime.setAttribute("placeholder", `${pId} burst Time`);
      burstTime.setAttribute("required", true);
      burstTime.setAttribute("min", 1);
      burstTime.setAttribute("name", `burstTime${pId}`);

      processContainer.appendChild(arrivalTime);
      processContainer.appendChild(burstTime);

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
}

function runSchAlgo(event) {
  event.preventDefault();
  procData();

  insertionSort(processes);

  let remProcesses = [];
  let i = 0;
  let currProcess;

  while (true) {
    if (i >= processes.length && remProcesses.length === 0) {
      // Terminate loop when all processes and remaining processes are processed
      break;
    }

    if (i < processes.length && processes[i].arrivalTime <= currentTime) {
      currProcess = processes[i];
      if (!remProcesses.includes(currProcess.name)) {
        remProcesses.push(currProcess);
      }
      i++;
    } else if (i < processes.length && remProcesses.length === 0) {
      let idleTime = processes[i].arrivalTime - currentTime;
      let createBox = `<div><p>${currentTime}</p><div>Idle</div></div>`;
      document.getElementById("ganttChart").innerHTML += createBox;
      currentTime += idleTime;
    }

    if (remProcesses.length > 0) {
      // If there are remaining processes, select the one with the longest remaining burst time
      const longestRemProcess = remProcesses.reduce((min, p) =>
        p.rem_burstTime > min.rem_burstTime ? p : min
      );
      currProcess = longestRemProcess;
    }

    if (currProcess) {
      if (currProcess.rem_burstTime > 0) {
        let createBox = `<div><p id="${currProcess.name}">${currentTime}</p><div>${currProcess.name}</div></div>`;
        document.getElementById("ganttChart").innerHTML += createBox;

        currentTime++;
        currProcess.rem_burstTime--;

        if (currProcess.rem_burstTime === 0) {
          currProcess.completionTime = currentTime;
          currProcess.turnArroundTime =
            currProcess.completionTime - currProcess.arrivalTime;

          currProcess.waitingTime =
            currProcess.turnArroundTime - currProcess.burstTime;

          ATT += currProcess.turnArroundTime;
          AWT += currProcess.waitingTime;

          remProcesses = remProcesses.filter((p) => p !== currProcess); // Remove selected process from remaining processes
        }
      }
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
    <caption>LRTF Scheduluing Table</caption>
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
