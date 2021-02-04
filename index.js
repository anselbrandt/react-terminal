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

  // React.useEffect(() => {
  //   // effect
  // }, []);

  return {
    render: () => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`${i} ${j}`);
    },
    incrI: () => setI(i + 1),
    decrI: () => setI(i - 1),
    incrJ: () => setJ(j + 1),
    decrJ: () => setJ(j - 1),
  };
}

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

// left, right, up, down
// return, escape
// q

console.log("\nPress 'q' to quit\nup, down, left right to inc/decr i,j\n");

React.render(Component);

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
