const wasmLoader = require("./wasm/demo.js");

const run = async () => {
  const wasm = await wasmLoader();
  console.log('Wasm version:', wasm.wasmVersion());

  // 10 x 10 grid of dead and alive cells
  const jsMatrix = [
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  const vectorVectorInt = new wasm.VectorVectorInt();
  for (let row of jsMatrix) {
    const vectorInt = new wasm.VectorInt();
    row.forEach(num => vectorInt.push_back(num));
    vectorVectorInt.push_back(vectorInt);
  }

  const print = m => {
    for (let i = 0; i < m.size(); i++) {
      const row = m.get(i);
      let v = [];
      for (let j = 0; j < row.size(); j++) {
        v.push(row.get(j));
      }
      console.log(v.join(""));
    }
  };

  console.log("\nSeed Input:");
  print(vectorVectorInt);
  console.log("\nPress Ctrl+C to stop");

  let i = 0;
  const updateDisplay = setInterval(() => {
    console.clear();
    process.stdout.write(`Step ${i}:\n\n`);

    wasm.gameOfLife(vectorVectorInt);

    for (let i = 0; i < vectorVectorInt.size(); i++) {
      const row = vectorVectorInt.get(i);
      let v = [];
      for (let j = 0; j < row.size(); j++) {
        v.push(row.get(j));
      }
      process.stdout.write(v.join("") + "\n");
    }

    i++;
  }, 500); // Updates every 500ms

  // To stop the interval and clean up resources
  process.on('SIGINT', () => {
    clearInterval(updateDisplay);
    console.log("\nSimulation stopped");
  });
};

run();
