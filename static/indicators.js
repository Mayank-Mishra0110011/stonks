function movingAverage(data, numberOfPricePoints) {
  return data.map((row, index, total) => {
    const start = Math.max(0, index - numberOfPricePoints);
    const end = index;
    const subset = total.slice(start, end + 1);
    const sum = subset.reduce((a, b) => {
      return a + parseFloat(b["close"]);
    }, 0);

    return {
      date: row["date"],
      average: sum / subset.length,
    };
  });
}
