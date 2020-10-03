const express = require("express");
const yf = require("./yf");
const router = express.Router();

router.post("/search/tickers", (req, res) => {
  if (!req.body.term)
    return res.status(400).json({ err: "search term missing" });
  yf.search(req.body.term)
    .then((data) => {
      res.json(data.items);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/get/tickers", (req, res) => {
  if (!req.body.ticker) return res.status(400).json({ err: "ticker missing" });
  if (!req.body.start) return res.status(400).json({ err: "start missing" });
  if (!req.body.end) return res.status(400).json({ err: "end missing" });
  yf.get(req.body.ticker, req.body.start, req.body.end, req.body.frequency)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
