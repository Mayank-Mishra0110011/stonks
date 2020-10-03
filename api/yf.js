const axios = require("axios");

const yf = {
  get: function (ticker, start, end, frequency = "1d") {
    if (!ticker) throw Error("Undefined ticker!");
    if (!start) throw Error("Undefined start!");
    if (!end) throw Error("Undefined end!");
    start = Date.parse(start) / 1000;
    end = Date.parse(end) / 1000;
    let url = `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${start}&period2=${end}&interval=${frequency}&events=history`;
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((res) => {
          let d = res.data.split("\n");
          d.shift();
          d = d.map((di) => {
            let dr = di.split(",");
            return {
              date: dr[0],
              open: dr[1],
              high: dr[2],
              low: dr[3],
              close: dr[4],
              adjClose: dr[5],
              volume: dr[6],
            };
          });
          resolve(d);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  search: function (term) {
    if (!term) throw Error("Undefined ticker!");
    return new Promise((resolve, reject) => {
      axios
        .get(
          `https://finance.yahoo.com/_finance_doubledown/api/resource/searchassist;searchTerm=${term}`
        )
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

module.exports = yf;
