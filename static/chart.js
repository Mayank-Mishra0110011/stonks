/*
function plotIndicator() {
   const movingAverageLine = d3
    .line()
    .x((d) => {
      return xScale(d["date"]);
    })
    .y((d) => {
      return yScale(d["average"]);
    })
    .curve(d3.curveBasis);

  const movingAverageData = movingAverage(data, 30);
  movingAverageLine(movingAverageData);
  svg
    .append("path")
    .data([movingAverageData])
    .style("fill", "none")
    .attr("id", "movingAverageLine")
    .attr("stroke", "#ad6eff")
    .attr("stroke-width", "1.5")
    .attr("d", movingAverageLine);
}
*/

function drawChart(index, data, options) {
  let lastSVG = document.querySelector(`#svg${index}`);
  if (lastSVG) lastSVG.remove();
  const margin = { top: 10, right: 50, bottom: 80, left: 10 };

  let width = options.width - margin.left - margin.right;
  let height = options.height - margin.top - margin.bottom;

  const xMin = d3.min(data, (d) => {
    return d["date"];
  });

  const xMax = d3.max(data, (d) => {
    return d["date"];
  });

  const xScale = d3.scaleTime().domain([xMin, xMax]).range([0, width]);
  let yScale;

  const svg = d3
    .select(`#chart${index}`)
    .append("svg")
    .attr("id", `svg${index}`)
    .style("position", "relative")
    .attr("width", width + margin["left"] + margin["right"])
    .attr("height", height + margin["top"] + margin["bottom"])
    .append("g")
    .attr("transform", `translate(${margin["left"]}, ${margin["top"]})`);

  svg
    .append("g")
    .attr("id", "xAxis")
    .attr("transform", `translate(0, ${height})`)
    .call(
      d3.axisBottom(xScale).tickFormat(function (d) {
        return d.toLocaleDateString("default", {
          month: "short",
        });
      })
    );

  function plotLine() {
    const yMin = d3.min(data, (d) => {
      return d["close"];
    });

    const yMax = d3.max(data, (d) => {
      return d["close"];
    });

    yScale = d3
      .scaleLinear()
      .domain([yMin - 5, yMax])
      .range([height, 0]);

    svg
      .append("g")
      .attr("id", "yAxis")
      .attr("transform", `translate(${width}, 0)`)
      .call(d3.axisRight(yScale));

    const line = d3
      .line()
      .x((d) => {
        return xScale(d["date"]);
      })
      .y((d) => {
        return yScale(d["close"]);
      });

    svg
      .append("path")
      .data([data])
      .style("fill", "none")
      .attr("id", "priceChart")
      .attr("stroke", options.color)
      .attr("stroke-width", options.size)
      .attr("d", line);
  }

  function plotCandle() {
    /*
    Doesn't work
    Modify code from drawCandle
    const parseDate = d3.utcParse("%Y-%m-%d");
    const formatChange = () => {
      const f = d3.format("+.2%");
      return (y0, y1) => f((y1 - y0) / y0);
    };
    */
  }

  if (options.type === "candle") {
    plotCandle();
  } else {
    plotLine();
  }

  const focus = svg.append("g").attr("class", "focus").style("display", "none");

  focus.append("circle").style("fill", "#ffffff").attr("r", 2);
  focus.append("line").classed("x", true);
  focus.append("line").classed("y", true);

  svg
    .append("rect")
    .style("fill", "transparent")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", () => focus.style("display", null))
    .on("mouseout", () => focus.style("display", "none"))
    .on("mousemove", generateCrosshair);

  d3.select(".overlay").style("fill", "none");
  d3.select(".overlay").style("pointer-events", "all");

  d3.selectAll(".focus line").style("fill", "none");
  d3.selectAll(".focus line").style("stroke", "#ffffff");
  d3.selectAll(".focus line").style("stroke-width", "0.5px");
  d3.selectAll(".focus line").style("stroke-dasharray", "3 3");

  const bisectDate = d3.bisector((d) => d.date).left;

  function generateCrosshair() {
    const correspondingDate = xScale.invert(d3.mouse(this)[0]);
    const i = bisectDate(data, correspondingDate, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    const currentPoint =
      correspondingDate - d0["date"] > d1["date"] - correspondingDate ? d1 : d0;
    focus.attr(
      "transform",
      `translate(${xScale(currentPoint["date"])}, ${yScale(
        currentPoint["close"]
      )})`
    );

    focus
      .select("line.x")
      .attr("x1", 0 - width)
      .attr("x2", width - xScale(currentPoint["date"]))
      .attr("y1", 0)
      .attr("y2", 0);

    focus
      .select("line.y")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0 - height)
      .attr("y2", height - yScale(currentPoint["close"]));

    let yAxisVal = document.querySelector(`#y-axis-val${index}`);
    let xAxisVal = document.querySelector(`#x-axis-val${index}`);
    let yAxisTop = yScale(currentPoint["close"]);
    let xAxisLeft = xScale(currentPoint["date"]) - 20;
    yAxisVal.style.top = `${yAxisTop}px`;
    xAxisVal.style.left = `${xAxisLeft}px`;
    yAxisVal.innerText = parseFloat(currentPoint.close).toFixed(2);
    xAxisVal.innerText = d3.timeFormat("%m/%d/%Y")(currentPoint.date);
    document.querySelector(`#open-val${index}`).innerText = parseFloat(
      currentPoint.open
    ).toFixed(2);
    document.querySelector(`#high-val${index}`).innerText = parseFloat(
      currentPoint.high
    ).toFixed(2);
    document.querySelector(`#low-val${index}`).innerText = parseFloat(
      currentPoint.low
    ).toFixed(2);
    document.querySelector(`#close-val${index}`).innerText = parseFloat(
      currentPoint.close
    ).toFixed(2);
    document.querySelector(`#volume-val${index}`).innerText = `${parseFloat(
      currentPoint.volume / 1000000
    ).toFixed(2)}M`;
  }
}

/*function drawCandle(prices, _width, _height) {
  const months = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  };
  var dateFormat = d3.timeParse("%Y-%m-%d");
  for (var i = 0; i < prices.length; i++) {
    prices[i]["Date"] = dateFormat(prices[i]["Date"]);
  }

  const margin = { top: 15, right: 10, bottom: 70, left: 50 },
    w = _width - margin.left - margin.right,
    h = _height - margin.top - margin.bottom;

  var svg = d3
    .select("#svg-container")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let dates = prices.map((price) => price.Date);
  var xmin = d3.min(prices.map((r) => r.Date.getTime()));
  var xmax = d3.max(prices.map((r) => r.Date.getTime()));
  var xScale = d3.scaleLinear().domain([-1, dates.length]).range([0, w]);
  var xDateScale = d3.scaleQuantize().domain([0, dates.length]).range(dates);
  let xBand = d3
    .scaleBand()
    .domain(d3.range(-1, dates.length))
    .range([0, w])
    .padding(0.3);
  var xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickFormat(function (d) {
      d = dates[d];
      hours = d.getHours();
      minutes = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
      amPM = hours < 13 ? "am" : "pm";
      return (
        hours +
        ":" +
        minutes +
        amPM +
        " " +
        d.getDate() +
        " " +
        months[d.getMonth()] +
        " " +
        d.getFullYear()
      );
    });

  svg
    .append("rect")
    .attr("id", "rect")
    .attr("width", w)
    .attr("height", h)
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr("clip-path", "url(#clip)");

  var gX = svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);

  gX.selectAll(".tick text").call(wrap, xBand.bandwidth());

  var ymin = d3.min(prices.map((r) => r.Low));
  var ymax = d3.max(prices.map((r) => r.High));
  var yScale = d3.scaleLinear().domain([ymin, ymax]).range([h, 0]).nice();
  var yAxis = d3.axisLeft().scale(yScale);

  var gY = svg.append("g").attr("class", "axis y-axis").call(yAxis);

  var chartBody = svg
    .append("g")
    .attr("class", "chartBody")
    .attr("clip-path", "url(#clip)");

  let candles = chartBody
    .selectAll(".candle")
    .data(prices)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i) - xBand.bandwidth())
    .attr("class", "candle")
    .attr("y", (d) => yScale(Math.max(d.Open, d.Close)))
    .attr("width", xBand.bandwidth())
    .attr("height", (d) =>
      d.Open === d.Close
        ? 1
        : yScale(Math.min(d.Open, d.Close)) - yScale(Math.max(d.Open, d.Close))
    )
    .attr("fill", (d) =>
      d.Open === d.Close ? "silver" : d.Open > d.Close ? "red" : "green"
    );

  let stems = chartBody
    .selectAll("g.line")
    .data(prices)
    .enter()
    .append("line")
    .attr("class", "stem")
    .attr("x1", (d, i) => xScale(i) - xBand.bandwidth() / 2)
    .attr("x2", (d, i) => xScale(i) - xBand.bandwidth() / 2)
    .attr("y1", (d) => yScale(d.High))
    .attr("y2", (d) => yScale(d.Low))
    .attr("stroke", (d) =>
      d.Open === d.Close ? "white" : d.Open > d.Close ? "red" : "green"
    );

  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", w)
    .attr("height", h);

  const extent = [
    [0, 0],
    [w, h],
  ];

  var resizeTimer;
  var zoom = d3
    .zoom()
    .scaleExtent([1, 100])
    .translateExtent(extent)
    .extent(extent)
    .on("zoom", zoomed)
    .on("zoom.end", zoomend);

  svg.call(zoom);

  function zoomed() {
    var t = d3.event.transform;
    let xScaleZ = t.rescaleX(xScale);

    let hideTicksWithoutLabel = function () {
      d3.selectAll(".xAxis .tick text").each(function (d) {
        if (this.innerHTML === "") {
          this.parentNode.style.display = "none";
        }
      });
    };

    gX.call(
      d3.axisBottom(xScaleZ).tickFormat((d, e, target) => {
        if (d >= 0 && d <= dates.length - 1) {
          d = dates[d];
          hours = d.getHours();
          minutes = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
          amPM = hours < 13 ? "am" : "pm";
          return (
            hours +
            ":" +
            minutes +
            amPM +
            " " +
            d.getDate() +
            " " +
            months[d.getMonth()] +
            " " +
            d.getFullYear()
          );
        }
      })
    );

    candles
      .attr("x", (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
      .attr("width", xBand.bandwidth() * t.k);
    stems.attr(
      "x1",
      (d, i) => xScaleZ(i) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5
    );
    stems.attr(
      "x2",
      (d, i) => xScaleZ(i) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5
    );

    hideTicksWithoutLabel();

    gX.selectAll(".tick text").call(wrap, xBand.bandwidth());
  }

  function zoomend() {
    var t = d3.event.transform;
    let xScaleZ = t.rescaleX(xScale);
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0])));
      xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1])));
      filtered = prices.filter(
        (price) => price.Date >= xmin && price.Date <= xmax
      );
      minP = +d3.min(filtered, (d) => d.Low);
      maxP = +d3.max(filtered, (d) => d.High);
      buffer = Math.floor((maxP - minP) * 0.1);

      yScale.domain([minP - buffer, maxP + buffer]);
      candles
        .transition()
        .duration(800)
        .attr("y", (d) => yScale(Math.max(d.Open, d.Close)))
        .attr("height", (d) =>
          d.Open === d.Close
            ? 1
            : yScale(Math.min(d.Open, d.Close)) -
              yScale(Math.max(d.Open, d.Close))
        );

      stems
        .transition()
        .duration(800)
        .attr("y1", (d) => yScale(d.High))
        .attr("y2", (d) => yScale(d.Low));

      gY.transition().duration(800).call(d3.axisLeft().scale(yScale));
    }, 500);
  }
}

function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1,
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}*/

function showCharts() {
  for (let i = 1; i <= 4; i++) {
    let yAxis = document.querySelector(`#y-axis-val${i}`);
    if (yAxis) {
      yAxis.classList.remove("hide");
      document.querySelector(`#x-axis-val${i}`).classList.remove("hide");
      document.querySelector(`#data-legend${i}`).classList.remove("hide");
    }
  }
}
