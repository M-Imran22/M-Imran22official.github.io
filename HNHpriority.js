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
    getNumProc();
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
    const priority = parseInt(
      document.getElementById(`priority${processId}`).value,
      10
    );

    Processes.push({
      name: processId,
      arrivalTime,
      burstTime,
      priority,
      turnAroundTime: 0,
      waitingTime: 0,
      completionTime: 0,
    });
  }
  Processes = insertionSort(Processes);
  setTimeout(() => {
    console.log("Processes with updated information:", Processes);
  }, 2000);

  let groupedProcesses = {};

  Processes.forEach((process) => {
    let arrivalTime = process.arrivalTime;
    if (!groupedProcesses[arrivalTime]) {
      groupedProcesses[arrivalTime] = [];
    }
    groupedProcesses[arrivalTime].push(process);
  });

  let uniqueAT = Object.keys(groupedProcesses);
  console.log("Unique Arrival Times:", uniqueAT);

  arrayOfObjects = uniqueAT.map((arrivalTime) => {
    return {
      arrivalTime: arrivalTime,
      processes: groupedProcesses[arrivalTime],
    };
  });

  // Sort arrayOfObjects based on burst time within each group
  arrayOfObjects.forEach((group) => {
    group.processes.sort((a, b) => a.priority - b.priority);
  });

  // Sort the array itself based on the burst time of the first process in each group
  arrayOfObjects.sort(
    (a, b) => a.processes[0].priority - b.processes[0].priority
  );

  console.log("Before sorted arrayOfObjects:", arrayOfObjects);

  function sortByArrivalTime(data) {
    // Sort the main array based on arrivalTime
    data.sort((a, b) => parseInt(a.arrivalTime) - parseInt(b.arrivalTime));

    return data;
  }

  arrayOfObjects = sortByArrivalTime(arrayOfObjects);
  console.log("Sorted Array Of Objects:", arrayOfObjects);

  let currentTime = 0;
  let idleTime = 0;
  for (let i = 0; i < arrayOfObjects.length; i++) {
    for (let j = arrayOfObjects[i].processes.length - 1; j >= 0; j--) {
      console.log(currentTime);
      const currentProcess = arrayOfObjects[i].processes[j];
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
        j++;
      }
    }
  }

  // let createBox = `<div><p>${arrProcesses.completionTime}</p></div>`;
  //         document.getElementById('ganttChart').innerHTML+= createBox;
  setTimeout(() => {
    document.querySelector("#ganttChart").classList.add("show");
  }, 500);
  let tableHTML = `<table>
                <caption>High Number High Priority Scheduluing Table</caption>
                <thead>
                    <tr>
                        <th>Process ID</th>
                        <th>Arrival Time</th>
                        <th>Burst Time</th>
                        <th>Priority</th>
                        <th>Completion Time</th>
                        <th>Turn Around Time</th>
                        <th>Waiting Time</th>
                    </tr>
                </thead>
            `;

  for (let i = 0; i < arrayOfObjects.length; i++) {
    for (let j = 0; j < arrayOfObjects[i].processes.length; j++) {
      tableHTML += `<tr>
                    <td>${arrayOfObjects[i].processes[j].name}</td>
                    <td>${arrayOfObjects[i].processes[j].arrivalTime}</td>
                    <td>${arrayOfObjects[i].processes[j].burstTime}</td>
                    <td>${arrayOfObjects[i].processes[j].priority}</td>
                    <td>${arrayOfObjects[i].processes[j].completionTime}</td>
                    <td>${arrayOfObjects[i].processes[j].turnAroundTime}</td>
                    <td>${arrayOfObjects[i].processes[j].waitingTime}</td>
                </tr>`;
    }
  }
  ATT = Math.fround(ATT / numberOfProcesses);
  AWT = Math.fround(AWT / numberOfProcesses);
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
    console.log("Processes with updated information:", arrayOfObjects);
  }, 4000);
}
