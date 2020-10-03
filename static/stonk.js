window.onload = () => {
  init();
  /*
    Test Code
      addPanel();
      addPanel();
      addPanel();
      openPanelsInEveryOrder(["1", "2", "3", "4"]);
  */
  // loadData();
};

function init() {
  let modalElements = document.querySelectorAll(".modal");
  let dropdownElements = document.querySelectorAll(".dropdown-trigger");
  modalElements.forEach((modal) => {
    if (modal.id == "add-ticker-modal") {
      M.Modal.init(modal, {
        onCloseEnd: function () {
          modal.querySelector("label").classList.remove("active");
          document.querySelector("#search").value = "";
          let results = document.querySelector("#search-results");
          results.innerHTML = "";
          results.setAttribute("items", "0");
          document.querySelector("#search-results").innerHTML = "";
          this.timedRequest.stop();
        },
        onOpenEnd: function () {
          if (!this.timedRequest) {
            this.timedRequest = new TimedRequest(this);
          } else {
            this.timedRequest.start();
          }
        },
      });
    } else {
      M.Modal.init(modal);
    }
  });
  M.Dropdown.init(dropdownElements, {
    coverTrigger: false,
    constrainWidth: false,
  });
}

function getTickers(string) {
  return new Promise((resolve, reject) => {
    fetch("http://localhost:5000/yf/search/tickers", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        term: string,
      }),
      method: "POST",
    })
      .then((res) => {
        res.json().then((data) => {
          resolve(data);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getData(ticker, start, end, frequency) {
  return new Promise((resolve, reject) => {
    fetch("http://localhost:5000/yf/get/tickers", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticker: ticker,
        start: start,
        end: end,
        frequency: frequency,
      }),
      method: "POST",
    })
      .then((res) => {
        res.json().then((d) => {
          resolve(d);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function _addPanel(pID, nID, appendableNodes, removableNodes, containerNode) {
  appendableNodes[0].classList.remove("hide");
  appendableNodes[1].classList.remove("hide");
  appendableNodes[0].insertAdjacentHTML("beforeend", panel(pID));
  appendableNodes[1].insertAdjacentHTML("beforeend", panel(nID));
  removableNodes.forEach((node) => node.remove());
  if (containerNode) {
    containerNode.classList.add("hide");
  }
}

function _removePanel(nID, removableNodes, appendableNode) {
  appendableNode.classList.remove("hide");
  appendableNode.insertAdjacentHTML("beforeend", panel(nID));
  removableNodes.forEach((node) => {
    node.children[0].remove();
    node.children[0].remove();
    node.classList.add("hide");
  });
}

function addPanel() {
  let canvasWrapper = document.querySelector("#canvas-wrapper");
  let canvasCount = parseInt(canvasWrapper.getAttribute("canvas-count"));
  if (canvasCount < 4) {
    if (canvasCount == 1) {
      let topPanel = document.querySelector("#top-panel-container");
      let bottomPanel = document.querySelector("#bottom-panel-container");
      bottomPanel.classList.add("hide");
      topPanel.classList.add("h-100");
    }
    switch (canvasCount) {
      case 1:
        canvasWrapper.children[0].classList.remove("hide");
        canvasWrapper.children[1].classList.remove("hide");
        _addPanel(
          "1",
          "2",
          [
            canvasWrapper.children[0].children[0],
            canvasWrapper.children[1].children[0],
          ],
          [canvasWrapper.children[2], canvasWrapper.children[3]]
        );
        canvasWrapper.classList.add("half");
        break;
      case 2:
        canvasWrapper.classList.remove("half");
        canvasWrapper.children[1].classList.add("half");
        canvasWrapper.children[0].classList.remove("flex-col");
        _addPanel(
          "1",
          "3",
          [
            canvasWrapper.children[0].children[1],
            canvasWrapper.children[0].children[2],
          ],
          [
            canvasWrapper.children[0].children[0].children[0],
            canvasWrapper.children[0].children[0].children[1],
          ],
          canvasWrapper.children[0].children[0]
        );
        break;
      case 3:
        canvasWrapper.children[1].classList.remove("half");
        let extPanel =
          document.querySelector("#btn-panel3") == null
            ? "3"
            : document.querySelector("#btn-panel4") == null
            ? "4"
            : document.querySelector("#btn-panel2") != null
            ? "2"
            : null;
        let cpPanel;
        if (extPanel == "4" || extPanel == "2") {
          cpPanel = extPanel == "4" ? "2" : "4";
          canvasWrapper.children[1].classList.remove("flex-col");
          _addPanel(
            cpPanel,
            extPanel,
            [
              canvasWrapper.children[1].children[1],
              canvasWrapper.children[1].children[2],
            ],
            [
              canvasWrapper.children[1].children[0].children[0],
              canvasWrapper.children[1].children[0].children[1],
            ],
            canvasWrapper.children[1].children[0]
          );
        } else {
          if (document.querySelector("#btn-panel2") == null) {
            canvasWrapper.children[1].classList.remove("flex-col");
            _addPanel(
              "4",
              "2",
              [
                canvasWrapper.children[1].children[2],
                canvasWrapper.children[1].children[1],
              ],
              [
                canvasWrapper.children[1].children[0].children[0],
                canvasWrapper.children[1].children[0].children[1],
              ],
              canvasWrapper.children[1].children[0]
            );
          } else {
            canvasWrapper.children[0].classList.remove("flex-col");
            _addPanel(
              "1",
              extPanel,
              [
                canvasWrapper.children[0].children[1],
                canvasWrapper.children[0].children[2],
              ],
              [
                canvasWrapper.children[0].children[0].children[0],
                canvasWrapper.children[0].children[0].children[1],
              ],
              canvasWrapper.children[0].children[0]
            );
          }
        }
        break;
    }
    canvasWrapper.setAttribute("canvas-count", (canvasCount + 1).toString());
    init();
  }
}

function swapAndRemovePanelData(removedPanelID, copiedPanelID, swap = true) {
  if (swap) panelData[removedPanelID] = { ...panelData[copiedPanelID] };
  panelData[copiedPanelID].data = null;
  panelData[copiedPanelID].tickers = [];
  panelData[copiedPanelID].indicators = [];
}

function removePanel() {
  // Function is way too long and redundant, refactor it later
  let i = this.id.split("close-panel")[1],
    canvasWrapper = document.querySelector("#canvas-wrapper"),
    canvasCount = parseInt(canvasWrapper.getAttribute("canvas-count")),
    tInnerHTML,
    tChart;
  if (canvasCount > 1) {
    if (canvasCount == 2) {
      let topPanel = document.querySelector("#top-panel-container"),
        bottomPanel = document.querySelector("#bottom-panel-container");
      bottomPanel.classList.remove("hide");
      topPanel.classList.remove("h-100");
    }
    switch (i) {
      case "1":
        if (canvasCount == 2) {
          let p2 = document.querySelector("#btn-panel2");
          if (p2) {
            tInnerHTML = p2.innerHTML;
          } else {
            tInnerHTML = document.querySelector("#btn-panel4").innerHTML;
          }
          canvasWrapper.children[0].classList.add("hide");
          canvasWrapper.children[1].classList.add("hide");
          _removePanel(
            "1",
            [
              canvasWrapper.children[1].children[0],
              canvasWrapper.children[0].children[0],
            ],
            canvasWrapper
          );
          swapAndRemovePanelData("panel1", "panel2");
          document.querySelector("#btn-panel1").innerHTML = tInnerHTML;
          tChart = document.querySelector("#chart1");
          drawChart("1", panelData.panel1.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel1.tickers[0].color,
            size: panelData.panel1.tickers[0].size,
          });
        } else if (
          canvasCount == 3 &&
          document.querySelector("#btn-panel3") == null
        ) {
          tInnerHTML = document.querySelector("#btn-panel2").innerHTML;
          let tInnerHTML2 = document.querySelector("#btn-panel4").innerHTML;
          canvasWrapper.children[0].classList.add("flex-col");
          _removePanel(
            "4",
            [
              canvasWrapper.children[1].children[1],
              canvasWrapper.children[1].children[2],
            ],
            canvasWrapper.children[1].children[0]
          );
          swapAndRemovePanelData("panel1", "panel4");
          document.querySelector("#btn-panel4").innerHTML = tInnerHTML;
          document.querySelector("#btn-panel1").innerHTML = tInnerHTML2;
          tChart = document.querySelector("#chart4");
          drawChart("4", panelData.panel2.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel2.tickers[0].color,
            size: panelData.panel2.tickers[0].size,
          });
          tChart = document.querySelector("#chart1");
          drawChart("1", panelData.panel1.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel1.tickers[0].color,
            size: panelData.panel1.tickers[0].size,
          });
        } else {
          tInnerHTML = document.querySelector("#btn-panel3").innerHTML;
          canvasWrapper.children[0].classList.add("flex-col");
          _removePanel(
            "1",
            [
              canvasWrapper.children[0].children[2],
              canvasWrapper.children[0].children[1],
            ],
            canvasWrapper.children[0].children[0]
          );
          swapAndRemovePanelData("panel1", "panel3");
          document.querySelector("#btn-panel1").innerHTML = tInnerHTML;
          tChart = document.querySelector("#chart1");
          drawChart("1", panelData.panel1.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel1.tickers[0].color,
            size: panelData.panel1.tickers[0].size,
          });
        }
        break;
      case "2":
        if (canvasCount == 2) {
          canvasWrapper.children[0].classList.add("hide");
          canvasWrapper.children[1].classList.add("hide");
          _removePanel(
            "1",
            [
              canvasWrapper.children[0].children[0],
              canvasWrapper.children[1].children[0],
            ],
            canvasWrapper
          );
          swapAndRemovePanelData(null, "panel2", false);
          swapAndRemovePanelData(null, "panel3", false);
          tChart = document.querySelector("#chart1");
          drawChart("1", panelData.panel1.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel1.tickers[0].color,
            size: panelData.panel1.tickers[0].size,
          });
        } else if (
          canvasCount == 3 &&
          document.querySelector("#btn-panel4") == null
        ) {
          tInnerHTML = document.querySelector("#btn-panel1").innerHTML;
          canvasWrapper.children[0].classList.add("flex-col");
          _removePanel(
            "3",
            [
              canvasWrapper.children[0].children[1],
              canvasWrapper.children[0].children[2],
            ],
            canvasWrapper.children[0].children[0]
          );
          swapAndRemovePanelData(null, "panel2", false);
          let tInnerHTML2 = document.querySelector("#btn-panel3").innerHTML;
          document.querySelector("#btn-panel3").innerHTML = tInnerHTML;
          document.querySelector("#btn-panel2").innerHTML = tInnerHTML2;
          tChart = document.querySelector("#chart2");
          drawChart("2", panelData.panel3.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel3.tickers[0].color,
            size: panelData.panel3.tickers[0].size,
          });
          tChart = document.querySelector("#chart3");
          drawChart("3", panelData.panel1.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel1.tickers[0].color,
            size: panelData.panel1.tickers[0].size,
          });
        } else {
          canvasWrapper.children[1].classList.add("flex-col");
          _removePanel(
            "4",
            [
              canvasWrapper.children[1].children[2],
              canvasWrapper.children[1].children[1],
            ],
            canvasWrapper.children[1].children[0]
          );
          swapAndRemovePanelData(null, "panel2", false);
          tChart = document.querySelector("#chart4");
          drawChart("4", panelData.panel4.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel4.tickers[0].color,
            size: panelData.panel4.tickers[0].size,
          });
        }
        break;
      case "3":
        if (canvasCount == 2) {
          let p2 = document.querySelector("#btn-panel2");
          if (p2) {
            tInnerHTML = p2.innerHTML;
          } else {
            tInnerHTML = document.querySelector("#btn-panel4").innerHTML;
          }
          canvasWrapper.children[0].classList.add("hide");
          canvasWrapper.children[1].classList.add("hide");
          _removePanel(
            "1",
            [
              canvasWrapper.children[0].children[0],
              canvasWrapper.children[1].children[0],
            ],
            canvasWrapper
          );
          swapAndRemovePanelData("panel1", "panel3");
          document.querySelector("#btn-panel1").innerHTML = tInnerHTML;
          tChart = document.querySelector("#chart1");
          drawChart("1", panelData.panel1.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel1.tickers[0].color,
            size: panelData.panel1.tickers[0].size,
          });
        } else if (
          canvasCount == 3 &&
          document.querySelector("#btn-panel1") == null
        ) {
          /*
            By design this scenario will never happen no matter
            what order panels are opened and closed in
            keeping this block here till testing confirms it
          */
        } else {
          canvasWrapper.children[0].classList.add("flex-col");
          _removePanel(
            "1",
            [
              canvasWrapper.children[0].children[1],
              canvasWrapper.children[0].children[2],
            ],
            canvasWrapper.children[0].children[0]
          );
          swapAndRemovePanelData(null, "panel3", false);
          tChart = document.querySelector("#chart1");
          drawChart("1", panelData.panel1.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel1.tickers[0].color,
            size: panelData.panel1.tickers[0].size,
          });
        }
        break;
      case "4":
        if (canvasCount == 2) {
          canvasWrapper.children[0].classList.add("hide");
          canvasWrapper.children[1].classList.add("hide");
          _removePanel(
            "1",
            [
              canvasWrapper.children[0].children[0],
              canvasWrapper.children[1].children[0],
            ],
            canvasWrapper
          );
          swapAndRemovePanelData(null, "panel4", false);
          swapAndRemovePanelData(null, "panel3", false);
          swapAndRemovePanelData(null, "panel2", false);
          tChart = document.querySelector("#chart1");
          drawChart("1", panelData.panel1.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel1.tickers[0].color,
            size: panelData.panel1.tickers[0].size,
          });
        } else if (
          canvasCount == 3 &&
          document.querySelector("#btn-panel2") == null
        ) {
          tInnerHTML = document.querySelector("#btn-panel1").innerHTML;
          canvasWrapper.children[0].classList.add("flex-col");
          _removePanel(
            "3",
            [
              canvasWrapper.children[0].children[1],
              canvasWrapper.children[0].children[2],
            ],
            canvasWrapper.children[0].children[0]
          );
          swapAndRemovePanelData(null, "panel4", false);
          let tInnerHTML2 = document.querySelector("#btn-panel3").innerHTML;
          document.querySelector("#btn-panel3").innerHTML = tInnerHTML;
          document.querySelector("#btn-panel4").innerHTML = tInnerHTML2;
          tChart = document.querySelector("#chart4");
          drawChart("4", panelData.panel3.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel3.tickers[0].color,
            size: panelData.panel3.tickers[0].size,
          });
          tChart = document.querySelector("#chart3");
          drawChart("3", panelData.panel1.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel1.tickers[0].color,
            size: panelData.panel1.tickers[0].size,
          });
        } else {
          canvasWrapper.children[1].classList.add("flex-col");
          _removePanel(
            "2",
            [
              canvasWrapper.children[1].children[1],
              canvasWrapper.children[1].children[2],
            ],
            canvasWrapper.children[1].children[0]
          );
          swapAndRemovePanelData(null, "panel4", false);
          tChart = document.querySelector("#chart2");
          drawChart("2", panelData.panel2.data, {
            width: tChart.parentElement.offsetWidth,
            height: tChart.parentElement.offsetHeight,
            color: panelData.panel2.tickers[0].color,
            size: panelData.panel2.tickers[0].size,
          });
        }
        break;
    }
    showCharts();
    canvasWrapper.setAttribute("canvas-count", (canvasCount - 1).toString());
    init();
  }
}

function openDateModal() {
  let dateModal = document.querySelector("#date-range-modal");
  M.Modal.getInstance(dateModal).open();
  if (this.innerText === "DATE RANGE") {
    let dates = [...dateModal.getElementsByTagName("input")];
    let dRef = new Date();
    dRef.setDate(31);
    dRef.setMonth(2);
    dates[0].defaultValue = `${dRef.getFullYear() - 1}-03-31`;
    dates[1].defaultValue = `${dRef.getFullYear()}-03-31`;
  }
  dateModal.setAttribute("target", `${this.id}`);
}

function setDate() {
  let dateModal = document.querySelector("#date-range-modal");
  let dates = [...dateModal.getElementsByTagName("input")];
  if (
    dates[0].value.trim().length > 0 &&
    dates[1].value.trim().length > 0 &&
    Date.parse(dates[1].value) > Date.parse(dates[0].value)
  ) {
    const target = document.querySelector(
      `#${dateModal.getAttribute("target")}`
    );
    target.style.minWidth = "16rem";
    target.innerText = `${new Date(dates[0].value).toLocaleDateString(
      "default",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    )} - ${new Date(dates[1].value).toLocaleDateString("default", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }
}

function datedropdownHandler(id) {
  document.querySelector(
    `#date-drop-val${id.parentElement.id.split("date-dropdown")[1]}`
  ).innerText = this.innerText;
}

function switchGraphType(pid, path, type) {
  let i = pid.split("chart-type-dropdown")[1];
  document
    .querySelector("#graph-type-path" + i)
    .setAttribute("d", path.getAttribute("d"));
  document.querySelector("#graph-type" + i).innerText = type;
}

class TimedRequest {
  constructor(modalInstance) {
    this.modalInstance = modalInstance;
    this.start();
  }
  start() {
    this.intervalID = setInterval(searchTicker.bind(this), 1000);
  }
  stop() {
    clearInterval(this.intervalID);
  }
}

function searchTicker() {
  let searchResults = document.querySelector("#search-results");
  let searchText = document.querySelector("#search").value.trim();
  if (searchText.length > 0) {
    getTickers(searchText)
      .then((data) => {
        if (data && this.modalInstance.isOpen) {
          searchResults.setAttribute("items", "1");
          searchResults.innerHTML = "";
          data.forEach((d) => {
            searchResults.insertAdjacentHTML(
              "beforeend",
              `
                <div class="bg-1 s-div d-flex">
                  <div class="w-50 d-flex flex-col pl-3 c-2">
                    <p class="font-bold">${d.symbol}</p>
                    <p class="font-smaller">${d.name}</p>
                    <p class="font-smaller">${d.typeDisp} - ${d.exchDisp}</p>
                  </div>
                  <div
                    class="w-50 d-flex justify-end align-center pr-3"
                  >
                    <a
                      href="#!"
                      onclick="handover.call(this, 'add-ticker-modal', '${d.name}', '${d.symbol}')"
                      class="modal-close waves-effect waves-light btn teal darken-4"
                      >ADD</a
                    >
                  </div>
                </div>
              `
            );
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (searchResults.getAttribute("items") === "1") {
    searchResults.innerHTML = "";
    searchResults.setAttribute("items", "0");
  }
}

function openTickerModal(newInstance, windowID) {
  if (!newInstance) {
    //add comparison ticker to window with specified window id
  } else {
    let windows = parseInt(
      document.querySelector("#canvas-wrapper").getAttribute("canvas-count")
    );
    if (!isNaN(windows) && windows > 0 && windows < 4) {
      M.Modal.getInstance(document.querySelector("#add-ticker-modal")).open();
    }
  }
}

function handover(from, name, symbol) {
  M.Modal.getInstance(document.querySelector(`#${from}`)).close();
  let optionName = document.querySelector("#option-name");
  optionName.innerText = `${name} (${symbol})`;
  optionName.setAttribute("sym", symbol);
  M.Modal.getInstance(document.querySelector("#options-modal")).open();
}

function switchLine(line) {
  let selLine = document.querySelector(".sel-line");
  line.style.backgroundColor = selLine.style.backgroundColor;
  selLine.classList.remove("sel-line");
  selLine.style.backgroundColor = "gray";
  line.classList.add("sel-line");
}

function pickColor(color) {
  document.querySelector("#option-color").style.backgroundColor =
    color.style.backgroundColor;
  document.querySelector(".sel-line").style.backgroundColor =
    color.style.backgroundColor;
}

function loadData() {
  let ticker = document.querySelector("#option-name").getAttribute("sym");
  let cc = parseInt(
    document.querySelector("#canvas-wrapper").getAttribute("canvas-count")
  );
  let panelIndex;
  if (cc < 4) {
    if (!panelData.panel1.data) {
      panelIndex = "1";
    } else {
      addPanel();
      showCharts();
      let tChart = document.querySelector("#chart1");
      drawChart("1", panelData.panel1.data, {
        width: tChart.parentElement.offsetWidth,
        height: tChart.parentElement.offsetHeight,
        color: panelData.panel1.tickers[0].color,
        size: panelData.panel1.tickers[0].size,
      });
      if (!panelData.panel2.data) {
        panelIndex = "2";
      } else if (!panelData.panel3.data) {
        panelIndex = "3";
        tChart = document.querySelector("#chart2");
        drawChart("2", panelData.panel2.data, {
          width: tChart.parentElement.offsetWidth,
          height: tChart.parentElement.offsetHeight,
          color: panelData.panel2.tickers[0].color,
          size: panelData.panel2.tickers[0].size,
        });
      } else if (!panelData.panel4.data) {
        panelIndex = "4";
        tChart = document.querySelector("#chart2");
        drawChart("2", panelData.panel2.data, {
          width: tChart.parentElement.offsetWidth,
          height: tChart.parentElement.offsetHeight,
          color: panelData.panel2.tickers[0].color,
          size: panelData.panel2.tickers[0].size,
        });
        tChart = document.querySelector("#chart3");
        drawChart("3", panelData.panel3.data, {
          width: tChart.parentElement.offsetWidth,
          height: tChart.parentElement.offsetHeight,
          color: panelData.panel3.tickers[0].color,
          size: panelData.panel3.tickers[0].size,
        });
      }
    }
  } else {
    return;
  }
  document.querySelector(`#loading${panelIndex}`).classList.remove("hide");
  M.Modal.getInstance(document.querySelector("#options-modal")).close();
  getData(ticker, "2019-03-31", "2020-03-31")
    .then((data) => {
      document.querySelector(`#loading${panelIndex}`).classList.add("hide");
      data = data.map((d) => {
        return {
          ...d,
          date: new Date(d.date),
        };
      });
      let c = document.querySelector(".sel-line");
      panelData[`panel${panelIndex}`].data = data;
      panelData[`panel${panelIndex}`].tickers.push({
        ticker: ticker,
        color: c.style.backgroundColor,
        size: c.style.height,
      });
      addTickerBtn(panelIndex, c.style.backgroundColor, ticker);
      let chart = document.querySelector(`#chart${panelIndex}`);
      document
        .querySelector(`#x-axis-val${panelIndex}`)
        .classList.remove("hide");
      document
        .querySelector(`#y-axis-val${panelIndex}`)
        .classList.remove("hide");
      document
        .querySelector(`#data-legend${panelIndex}`)
        .classList.remove("hide");
      drawChart(panelIndex, data, {
        width: chart.parentElement.offsetWidth,
        height: chart.parentElement.offsetHeight,
        color: c.style.backgroundColor,
        size: c.style.height,
        type: "line",
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function addTickerBtn(index, color, ticker) {
  document.querySelector(`#btn-panel${index}`).insertAdjacentHTML(
    "beforeend",
    `
      <a
        class="bg-1 ml-3 d-flex justify-center align-center btn btn-small"
        href="#"
        style="
          min-width: 6rem;
          border-radius: var(--s1);
          border-left: 3px solid ${color};
        "
        ><span class="font-bolder c-2">${ticker}</span>
      </a>
    `
  );
}
