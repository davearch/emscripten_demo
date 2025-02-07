const { gameOfLife } = require('./gameOfLife.js');

const run = async () => {
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

  const print = m => {
    for (let i = 0; i < m.length; i++) {
      const row = m[i];
      let v = [];
      for (let j = 0; j < row.length; j++) {
        v.push(row[j]);
      }
      console.log(v.join(""));
    }
  };


  console.time('JS Game of life');
  console.log("\nInput:");
  print(jsMatrix);

  for (let i = 0; i < 10; i++) {
    gameOfLife(jsMatrix);
  }

  console.log("\nOutput:");
  print(jsMatrix);
  console.timeEnd("JS Game of life");

};

run();
