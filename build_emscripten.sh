#!/bin/bash

set -e

mkdir -p wasm
cat </dev/stdin >wasm/demo.cc

cat <<EOF >wasm/index.html
<!DOCTYPE html>
<!-- NOTE(dkorolev): Run '(cd wasm; python3 -m http.server 8888)' and check out 'http://localhost:8888'. -->
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Emscripten demo</title>
</head>
<body>
  <p><div id="wasmver">Wasm module version: <b>N/A</b></div></p>
  <script>
    let impl = null;
    const runWasm = () => DemoWasmModule().then(impl => {
      const ver = impl.wasmVersion();
      console.log('Wasm version:', ver);
      document.getElementById("wasmver").innerHTML = "Wasm module version: <b>" + ver + "</b>";
      wasm = impl;
    });
  </script>
  <script type="text/javascript" src="demo.js" onload="runWasm();"></script>
</body>
</html>
EOF

cat <<EOF >wasm/run.js
// NOTE(dkorolev): Run '(cd wasm; node run.sh)' to see the version.
const wasmLoader = require("./demo.js");

const run = async () => {
  const wasm = await wasmLoader();
  console.log('Wasm version:', wasm.wasmVersion());
};

run();
EOF

# web build for react
# (cd wasm; emcc demo.cc -o demo.js -lembind --no-entry -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap", "malloc", "free"]' -s MODULARIZE=1 -s EXPORT_NAME=DemoWasmModule -s ENVIRONMENT=web)
(cd wasm;
 emcc \
   demo.cc \
   -o demo.js \
   -lembind \
   --no-entry \
   -s MODULARIZE=1 \
   -s EXPORTED_FUNCTIONS=_malloc,_free \
   -s EXPORTED_RUNTIME_METHODS=ccall,cwrap \
   -s ENVIRONMENT=web \
   -s EXPORT_NAME=DemoWasmModule)
# regular build for node
#(cd wasm; emcc demo.cc -o demo.js -lembind --no-entry -s MODULARIZE=1 -s EXPORT_NAME=DemoWasmModule)

tar cf - wasm/*
