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

  console.time("WASM Game of Life");
  console.log("\nInput:");
  print(vectorVectorInt);

  for (let i = 0; i < 10; i++) {
    wasm.gameOfLife(vectorVectorInt);
  }

  console.log("\nOutput:");
  print(vectorVectorInt);
  console.timeEnd("WASM Game of Life");
};

run();
