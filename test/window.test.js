function panelExists(num = 0) {
  return document.querySelector(`#btn-panel${num}`) != null;
}

function swap(arr, i, j) {
  let t = arr[i];
  arr[i] = arr[j];
  arr[j] = t;
}

function openPanelsInEveryOrder(arr, k = arr.length) {
  if (k == 1) {
    arr.forEach((i) => {
      let closePanel = document.querySelector(`#close-panel${i}`);
      if (closePanel) {
        closePanel.click();
      }
    });
    console.log(
      arr,
      panelExists(1),
      panelExists(2),
      panelExists(3),
      panelExists(4)
    );
    addPanel();
    addPanel();
    addPanel();
  } else {
    openPanelsInEveryOrder(arr, k - 1);
    for (let i = 0; i < k - 1; i++) {
      if (k % 2 == 0) {
        swap(arr, i, k - 1);
      } else {
        swap(arr, 0, k - 1);
      }
      openPanelsInEveryOrder(arr, k - 1);
    }
  }
}
