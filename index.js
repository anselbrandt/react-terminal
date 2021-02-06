const readline = require("readline");

const React = (function () {
  let hooks = [];
  let idx = 0;
  function useState(initVal) {
    const state = hooks[idx] || initVal;
    const _idx = idx;
    const setState = (newVal) => {
      hooks[_idx] = newVal;
    };
    idx++;
    return [state, setState];
  }
  function render(Component) {
    idx = 0;
    const C = Component();
    C.render();
    return C;
  }
  function useEffect(cb, depArray) {
    const oldDeps = hooks[idx];
    let hasChanged = true;
    if (oldDeps) {
      hasChanged = depArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
    }
    if (hasChanged) cb();
    hooks[idx] = depArray;
    idx++;
  }
  return { useState, render, useEffect };
})();

function Component() {
  const [i, setI] = React.useState(0);
  const [j, setJ] = React.useState(0);
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());

  // React.useEffect(() => {
  //   setInterval(() => {
  //     setTime(new Date().toLocaleTimeString());
  //   }, 1000);
  // });

  return {
    render: () => {
      process.stdout.cursorTo(0, 5);
      process.stdout.clearLine();
      process.stdout.write(`${i} ${j}
${time}`);
    },
    incrI: () => setI(i + 1),
    decrI: () => {
      if (i > 0) setI(i - 1);
    },
    incrJ: () => setJ(j + 1),
    decrJ: () => {
      if (j > 0) setJ(j - 1);
    },
  };
}

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

// left, right, up, down
// return, escape
// q

console.log("\nPress 'q' to quit\nup, down, left right to inc/decr i,j\n");

React.render(Component);
setInterval(() => React.render(Component), 1000);

process.stdin.on("keypress", (chunk, key) => {
  var App = React.render(Component);
  if (key && key.name == "q") {
    process.exit();
  } else {
    switch (key.name) {
      case "left":
        App.decrJ();
        React.render(Component);
        break;
      case "right":
        App.incrJ();
        React.render(Component);
        break;
      case "up":
        App.decrI();
        React.render(Component);
        break;
      case "down":
        App.incrI();
        React.render(Component);
        break;
      default:
        React.render(Component);
    }
  }
});
