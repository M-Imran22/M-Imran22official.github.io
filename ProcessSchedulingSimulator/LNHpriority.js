let Processes = [];
let numberOfProcesses;
let ATT = 0;
let AWT = 0;
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let currentElement = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j].arrivalTime > currentElement.arrivalTime) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = currentElement;
  }

  return arr;
}
numProcInput = document.querySelector("input");

const generateFormField = () => {
  let formFeild = document.querySelector("#formFieldsContainer");
  formFeild.innerHTML = "";

  numProc = numProcInput.value;
  let div = document.querySelector("#InputOfNumberOfProcesses");
  div.style.display = "none";

  if (numProc > 1 && numProc < 11) {
    for (let i = 0; i < numProc; i++) {
      let pId = `P${i + 1}`;

      // Create container div for arrival time and burst time
      let processContainer = document.createElement("div");
      processContainer.setAttribute("id", "processContainer");

      // Arrival Time input
      const arrivalTime = document.createElement("input");
      arrivalTime.setAttribute("id", `arrivalTime${pId}`);
      arrivalTime.setAttribute("type", "number");
      arrivalTime.setAttribute("placeholder", `${pId} Arrival Time`);
      arrivalTime.setAttribute("required", true);
      arrivalTime.setAttribute("name", `arrivalTime${pId}`);

      // Burst Time input
      const burstTime = document.createElement("input");
      burstTime.setAttribute("id", `burstTime${pId}`);
      burstTime.setAttribute("type", "number");
      burstTime.setAttribute("placeholder", `${pId} burst Time`);
      burstTime.setAttribute("required", true);
      burstTime.setAttribute("min", 1);
      burstTime.setAttribute("name", `burstTime${pId}`);

      const priority = document.createElement("Input");
      priority.setAttribute("type", "number");
      priority.setAttribute("placeholder", `Priority ${pId}`);
      priority.setAttribute("id", `priority${pId}`);
      priority.setAttribute("name", `priority${pId}`);
      priority.setAttribute("required", true);

      // Append inputs to container
      processContainer.appendChild(arrivalTime);
      processContainer.appendChild(burstTime);
      processContainer.appendChild(priority);

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
};
numProcInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    generateFormField();
  }
});

function procData() {
  let formFeildDiv = document.querySelector("#formContainer");
  formFeildDiv.style.display = "none";

  for (let i = 0; i < numProc; i++) {
    let pId = `P${i + 1}`;
    let arrivalTime = document.querySelector(`#arrivalTime${pId}`).value;
    let burstTime = document.querySelector(`#burstTime${pId}`).value;
    let priority = document.querySelector(`#priority${pId}`).value;

    Processes.push({
      name: pId,
      arrivalTime: arrivalTime,
      burstTime: burstTime,
      priority: priority,
      turnArroundTime: 0,
      waitingTime: 0,
      completionTime: 0,
    });
  }
  //   console.log(processes);
}

function runSchedulingAlgorithm(event) {
  event.preventDefault();
  procData();

  Processes = insertionSort(Processes);

  let remProcesses = [...Processes];
  let currentTime = 0;

  while (remProcesses.length > 0) {
    let selectedProcess = null;
    let lowestPriority = Infinity; // Higher number indicates lower priority

    // Find the process with the lowest priority among the arrived processes
    for (let i = 0; i < remProcesses.length; i++) {
      if (
        remProcesses[i].arrivalTime <= currentTime &&
        remProcesses[i].priority < lowestPriority
      ) {
        lowestPriority = remProcesses[i].priority;
        selectedProcess = remProcesses[i];
      }
    }

    if (selectedProcess) {
      let createBox = `<div><p>${currentTime}</p><div>${selectedProcess.name}</div></div>`;
      document.getElementById("ganttChart").innerHTML += createBox;

      currentTime += selectedProcess.burstTime;
      selectedProcess.completionTime = currentTime;
      selectedProcess.turnAroundTime =
        selectedProcess.completionTime - selectedProcess.arrivalTime;
      selectedProcess.waitingTime =
        selectedProcess.turnAroundTime - selectedProcess.burstTime;

      ATT += selectedProcess.turnAroundTime;
      AWT += selectedProcess.waitingTime;

      remProcesses = remProcesses.filter((p) => p !== selectedProcess);
    } else {
      let nextArrivalTime = remProcesses[0].arrivalTime;
      let idleTime = nextArrivalTime - currentTime;
      let createBox = `<div><p>${currentTime}</p><div>Idle</div></div>`;
      document.getElementById("ganttChart").innerHTML += createBox;
      currentTime = nextArrivalTime;
    }
  }

  ATT /= Processes.length;
  AWT /= Processes.length;

  ATT = parseFloat(ATT.toFixed(3));
  AWT = parseFloat(AWT.toFixed(3));

  setTimeout(() => {
    document.querySelector("#ganttChart").classList.add("show");
  }, 500);

  let tableHTML = `<table>
                <caption>SJF Scheduluing Table</caption>
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

  for (let j = 0; j < Processes.length; j++) {
    tableHTML += `<tr>
                    <td>${Processes[j].name}</td>
                    <td>${Processes[j].arrivalTime}</td>
                    <td>${Processes[j].burstTime}</td>
                    <td>${Processes[j].completionTime}</td>
                    <td>${Processes[j].turnAroundTime}</td>
                    <td>${Processes[j].waitingTime}</td>
                </tr>`;
  }

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
    console.log("Processes with updated information:", Processes);
  }, 4000);
}
