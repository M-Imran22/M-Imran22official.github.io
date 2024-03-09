let ATT = 0;
let AWT = 0;
let numberOfProcesses;
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
};

numProcInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    generateFormField();
  }
});

function runSchedulingAlgorithm(event) {
  event.preventDefault();
  document.getElementById("formContainer").style.display = "none";
  let numberOfProcesses = parseInt(
    document.getElementById("numProcesses").value,
    10
  );
  // Get form inputs
  let Processes = [];

  // Retrieve the values from the dynamically generated input fields
  for (let i = 1; i <= numberOfProcesses; i++) {
    const processId = "P" + i;
    const arrivalTime = parseInt(
      document.getElementById(`arrivalTime${processId}`).value,
      10
    );
    const burstTime = parseInt(
      document.getElementById(`burstTime${processId}`).value,
      10
    );

    Processes.push({
      name: processId,
      arrivalTime,
      burstTime,
      turnAroundTime: 0,
      waitingTime: 0,
      completionTime: 0,
    });
  }
  Processes = insertionSort(Processes);
  // console.log(Processes);

  let currentTime = 0;
  let idleTime = 0;
  for (let i = 0; i < Processes.length; i++) {
    console.log(currentTime);
    const currentProcess = Processes[i];
    if (
      currentProcess.arrivalTime == currentTime ||
      currentProcess.arrivalTime < currentTime
    ) {
      currentProcess.completionTime = currentTime + currentProcess.burstTime;
      currentProcess.turnAroundTime =
        currentProcess.completionTime - currentProcess.arrivalTime;
      currentProcess.waitingTime =
        currentProcess.turnAroundTime - currentProcess.burstTime;

      ATT += currentProcess.turnAroundTime;
      AWT += currentProcess.waitingTime;

      let createBox = `<div><p id="${currentProcess.name}">${currentTime}</p><div>${currentProcess.name}</div></div>`;
      document.getElementById("ganttChart").innerHTML += createBox;
      currentTime = currentProcess.completionTime;
    } else if (currentProcess.arrivalTime > currentTime) {
      idleTime = currentProcess.arrivalTime - currentTime;
      let createBox = `<div><p>${currentTime}</p><div>Idle</div></div>`;
      document.getElementById("ganttChart").innerHTML += createBox;
      currentTime += idleTime;
      i--;
    }
  }

  ATT /= Processes.length;
  AWT /= Processes.length;

  ATT = parseFloat(ATT.toFixed(3));
  AWT = parseFloat(AWT.toFixed(3));

  let createBox = `<div><p>${
    Processes[Processes.length - 1].completionTime
  }</p></div>`;
  document.getElementById("ganttChart").innerHTML += createBox;
  setTimeout(() => {
    document.querySelector("#ganttChart").classList.add("show");
  }, 500);
  let tableHTML = `<table>
    <caption>FCFS Scheduluing Table</caption>
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

  for (let i = 0; i < numberOfProcesses; i++) {
    tableHTML += `<tr>
        <td>${Processes[i].name}</td>
        <td>${Processes[i].arrivalTime}</td>
        <td>${Processes[i].burstTime}</td>
        <td>${Processes[i].completionTime}</td>
        <td>${Processes[i].turnAroundTime}</td>
        <td>${Processes[i].waitingTime}</td>
    </tr>`;
  }

  tableHTML += `<tr>
        <td colspan="3"> <b>Average Turn Around Time: ${ATT}</b></td>
        <td colspan="3"><b>Average Waiting Time: ${AWT}</b></td>
             </tr>`;

  tableHTML += "</table>";

  document.getElementById("table").innerHTML = tableHTML;
  console.log(tableHTML);
  setTimeout(() => {
    document.querySelector("table").classList.add("show");
  }, 500);
  setTimeout(() => {
    console.log("Processes with updated information:", Processes);
  }, 4000);
}
