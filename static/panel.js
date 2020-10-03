const panelData = {
  panel1: {
    data: null,
    tickers: [],
    indicators: [],
  },
  panel2: {
    data: null,
    tickers: [],
    indicators: [],
  },
  panel3: {
    data: null,
    tickers: [],
    indicators: [],
  },
  panel4: {
    data: null,
    tickers: [],
    indicators: [],
  },
};

function panel(index) {
  let tickerBtn = "";
  let thisPanel = panelData[`panel${index}`];
  if (thisPanel.data) {
    tickerBtn = `<a
      class="bg-1 ml-3 d-flex justify-center align-center btn btn-small"
      href="#"
      style="
        min-width: 6rem;
        border-radius: var(--s1);
        border-left: 3px solid ${thisPanel.tickers[0].color};
      "
      ><span class="font-bolder c-2">${thisPanel.tickers[0].ticker}</span>
    </a>`;
  }
  return `
    <div
      class="w-100 d-flex bg-3"
      style="
        height: calc(4rem - 6px);
        border-top: 2px solid var(--c6);
        border-bottom: 1px solid #99aab5;
      "
    >
      <div class="h-100 d-flex ml-2 btn-wrap-1" style="width: 90%;">
        <div
          id="btn-panel${index}"
          class="w-100 h-100 d-flex align-center"
          style="overflow-x: scroll;"
        >
          <a
            class="c-2 bg-1 btn-small waves-effect waves-light"
            href="#"
            id="date-range${index}"
            onclick="openDateModal.call(this)"
            style="min-width: 8rem;"
          >
            Date Range
          </a>
          <a
            class="bg-1 ml-3 d-flex justify-center align-center dropdown-trigger btn btn-small"
            href="#"
            data-target="date-dropdown${index}"
            style="min-width: 8rem;"
            ><span id="date-drop-val${index}">1 min</span>
            <span class="material-icons ml-1">
              arrow_drop_down
            </span></a
          >
          <ul id="date-dropdown${index}" class="dropdown-content">
            <li>
              <a
                href="#!"
                onclick="datedropdownHandler.call(this, this.parentElement)"
                >2 mins</a
              >
            </li>
            <li>
              <a
                href="#!"
                onclick="datedropdownHandler.call(this, this.parentElement)"
                >5 mins</a
              >
            </li>
            <li>
              <a
                href="#!"
                onclick="datedropdownHandler.call(this, this.parentElement)"
                >15 mins</a
              >
            </li>
            <li>
              <a
                href="#!"
                onclick="datedropdownHandler.call(this, this.parentElement)"
                >30 mins</a
              >
            </li>
            <li>
              <a
                href="#!"
                onclick="datedropdownHandler.call(this, this.parentElement)"
                >1 hour</a
              >
            </li>
            <li>
              <a
                href="#!"
                onclick="datedropdownHandler.call(this, this.parentElement)"
                >4 hours</a
              >
            </li>
            <li>
              <a
                href="#!"
                onclick="datedropdownHandler.call(this, this.parentElement)"
                >1 day</a
              >
            </li>
            <li>
              <a
                href="#!"
                onclick="datedropdownHandler.call(this, this.parentElement)"
                >1 month</a
              >
            </li>
            <li>
              <a
                href="#!"
                onclick="datedropdownHandler.call(this, this.parentElement)"
                >1 week</a
              >
            </li>
            <li>
              <a
                href="#!"
                onclick="datedropdownHandler.call(this, this.parentElement)"
                >1 year</a
              >
            </li>
          </ul>
          <div
            class="v-div d-flex ml-3 align-center"
            style="min-width: 1px;"
          >
            <div class="bg-2 h-50 w-100"></div>
          </div>
          <a
            class="bg-1 ml-3 d-flex justify-center align-center btn btn-small"
            onclick="M.Modal.getInstance(document.querySelector('#add-indicator-modal')).open();"
            href="#"
            style="min-width: 9rem; padding: 0 !important;"
          >
            <span class="material-icons mr-1">
              add_circle
            </span>
            <span>Indicators</span>
          </a>
          <a
            class="bg-1 ml-3 d-flex justify-center align-center btn btn-small"
            href="#"
            onclick="openTickerModal(false)"
            style="min-width: 6rem; padding: 0 !important;"
          >
            <span class="material-icons mr-1">
              add_circle
            </span>
            <span>Ticker</span>
          </a>
          <a
            class="bg-1 ml-3 d-flex justify-center align-center dropdown-trigger btn btn-small"
            href="#"
            data-target="chart-type-dropdown${index}"
            style="min-width: 7.5rem;"
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              data-icon="chart-candle"
              class="svg-content"
            >
              <path
                id="graph-type-path${index}"
                d="M9.048 19.345c-.263 0-.518-.103-.707-.293l-2.985-2.986L2.71 18.73c-.39.39-1.022.393-1.415.003-.392-.39-.393-1.023-.004-1.414l3.354-3.375c.186-.19.44-.295.707-.295h.003c.265 0 .52.105.707.293l2.625 2.625 2.623-6.52c.125-.312.398-.54.726-.607.332-.07.67.034.908.272l4.28 4.265 3.774-9.352c.207-.512.794-.757 1.302-.553.513.207.76.79.554 1.3l-4.34 10.752c-.127.312-.4.538-.73.606-.327.067-.667-.034-.905-.272L12.6 12.195l-2.624 6.523c-.125.312-.4.54-.728.606-.066.014-.134.02-.2.02"
              ></path>
            </svg>
            <span id="graph-type${index}" class="ml-2">Line</span></a
          >
          ${tickerBtn}
          <ul id="chart-type-dropdown${index}" class="dropdown-content">
            <li
              onclick="switchGraphType(this.parentElement.id, this.children[0].children[0].children[0], 'Line')"
            >
              <span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  class="svg-content"
                >
                  <path
                    d="M9.048 19.345c-.263 0-.518-.103-.707-.293l-2.985-2.986L2.71 18.73c-.39.39-1.022.393-1.415.003-.392-.39-.393-1.023-.004-1.414l3.354-3.375c.186-.19.44-.295.707-.295h.003c.265 0 .52.105.707.293l2.625 2.625 2.623-6.52c.125-.312.398-.54.726-.607.332-.07.67.034.908.272l4.28 4.265 3.774-9.352c.207-.512.794-.757 1.302-.553.513.207.76.79.554 1.3l-4.34 10.752c-.127.312-.4.538-.73.606-.327.067-.667-.034-.905-.272L12.6 12.195l-2.624 6.523c-.125.312-.4.54-.728.606-.066.014-.134.02-.2.02"
                  ></path>
                </svg>
                <span style="margin-left: 0.5rem;">Line</span></span
              >
            </li>
            <li
              onclick="switchGraphType(this.parentElement.id, this.children[0].children[0].children[0], 'Area')"
            >
              <span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  class="svg-content"
                >
                  <path
                    d="M2.002 11.748c-.017-.376.1-.76.348-1.044.46-.526 1.2-.522 1.655.02l2.857 3.395 4.99-5.842c.218-.256.516-.4.826-.4.31 0 .61.143.828.4l2.526 2.943 3.765-5.513c.085-.176.203-.328.343-.444.463-.396 1.118-.344 1.53.15.22.267.33.61.33.955v12.268C22 19.39 21.473 20 20.824 20H3.176C2.526 20 2 19.39 2 18.636v-6.818c0-.023 0-.047.002-.07z"
                  ></path>
                </svg>
                <span style="margin-left: 0.5rem;">Area</span></span
              >
            </li>
            <li
              onclick="switchGraphType(this.parentElement.id, this.children[0].children[0].children[0], 'Candle')"
            >
              <span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  class="svg-content"
                >
                  <path
                    d="M18 24c-.6 0-1-.4-1-1V1c0-.6.4-1 1-1s1 .4 1 1v22c0 .6-.4 1-1 1zM6 24c-.6 0-1-.4-1-1V1c0-.6.4-1 1-1s1 .4 1 1v22c0 .6-.4 1-1 1zM3 7h6c.6 0 1 .4 1 1v11c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V8c0-.6.4-1 1-1zM8 20H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2zM4 9v9h4V9H4zM15 4h6c.6 0 1 .4 1 1v11c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1zM20 17h-4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2zM16 6v9h4V6h-4z"
                  ></path>
                </svg>
                <span style="margin-left: 0.5rem;">Candle</span></span
              >
            </li>
          </ul>
          <!-- 
            MA INDICATOR
            <a
            class="bg-1 ml-3 d-flex justify-center align-center btn btn-small"
            href="#"
            style="
              min-width: 4rem;
              border-radius: var(--s1);
              border-left: 3px solid #ad6eff;
            "
            ><span class="font-bolder c-2">MA</span>
          </a> -->
        </div>
      </div>
      <div
        class="h-100 d-flex justify-around align-center btn-wrap-2"
        style="width: 10%;"
      >
        <a
          class="bg-9 btn-floating btn-small waves-effect waves-light sml-btn"
          ><i class="c-3 material-icons">unfold_more</i></a
        >
        <a
          id="close-panel${index}"
          onclick="removePanel.call(this)"
          class="bg-8 btn-floating btn-small waves-effect waves-light sml-btn"
          ><i class="c-3 material-icons">close</i></a
        >
      </div>
    </div>
    <div class="w-100 h-100 bg-3 chart" id="chart${index}">
      <div
        id="loading${index}"
        class="w-100 h-100 d-flex justify-center align-center loading hide"
      >
        <img src="./images/loading.gif" alt="loading" />
      </div>
      <div
        id="x-axis-val${index}"
        class="x-axis-val bg-1 d-flex justify-center align-center hide"
      >
        <p class="c-2">mm/dd/yy</p>
      </div>
      <div
        id="y-axis-val${index}"
        class="y-axis-val bg-1 d-flex justify-center align-center hide"
      >
        <p class="c-2">0</p>
      </div>
      <div id="data-legend${index}" class="stonk-legend d-flex flex-col hide">
        <div class="w-100 d-flex justify-end align-center">
          <a
            class="bg-8 btn-floating btn-small waves-effect waves-light mr-1 d-flex align-center"
            style="width: 16px !important; height: 16px !important;"
            ><i
              class="c-3 material-icons"
              style="font-size: small !important;"
              >close</i
            ></a
          >
        </div>
        <div class="w-100 d-flex" style="height: 1.5rem;">
          <div class="w-50 d-flex justify-center align-center">
            <p class="c-2 font-bolder">Open</p>
          </div>
          <div class="w-50 d-flex justify-center align-center">
            <p class="c-2" id="open-val${index}">0</p>
          </div>
        </div>
        <div class="w-100 d-flex" style="height: 1.5rem;">
          <div class="w-50 d-flex justify-center align-center">
            <p class="c-2 font-bolder">High</p>
          </div>
          <div class="w-50 d-flex justify-center align-center">
            <p class="c-2" id="high-val${index}">0</p>
          </div>
        </div>
        <div class="w-100 d-flex" style="height: 1.5rem;">
          <div class="w-50 d-flex justify-center align-center">
            <p class="c-2 font-bolder">Low</p>
          </div>
          <div class="w-50 d-flex justify-center align-center">
            <p class="c-2" id="low-val${index}">0</p>
          </div>
        </div>
        <div class="w-100 d-flex" style="height: 1.5rem;">
          <div class="w-50 d-flex justify-center align-center">
            <p class="c-2 font-bolder">Close</p>
          </div>
          <div class="w-50 d-flex justify-center align-center">
            <p class="c-2" id="close-val${index}">0</p>
          </div>
        </div>
        <div class="w-100 d-flex" style="height: 1.5rem;">
          <div class="w-50 d-flex justify-center align-center">
            <p class="c-2 font-bolder">Volume</p>
          </div>
          <div class="w-50 d-flex justify-center align-center">
            <p class="c-2" id="volume-val${index}">0</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
