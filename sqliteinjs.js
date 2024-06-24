(function (global) {
  function initSqlJs(config) {
    return new Promise((resolve, reject) => {
      // Load sql-wasm.js and initialize SQL.js
      const script = document.createElement("script");
      script.src = config.sqlJsPath || "https://sql.js.org/dist/sql-wasm.js";
      script.onload = async () => {
        const sqlPromise = window.initSqlJs({
          locateFile: (file) =>
            config.wasmPath || `https://sql.js.org/dist/${file}`,
        });

        if (config.dbPath) {
          const dataPromise = fetch(config.dbPath).then((res) =>
            res.arrayBuffer()
          );
          const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
          const db = new SQL.Database(new Uint8Array(buf));
          global.sqliteDB = db;
          resolve(db);
        } else {
          // Create an empty database if no dbPath is provided
          const [SQL] = await Promise.all([sqlPromise]);
          const db = new SQL.Database();
          global.sqliteDB = db;
          resolve(db);
        }
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

   function saveDatabase(dbPath) {
    const binaryArray = global.sqliteDB.export();

    // Save to server
    fetch('http://localhost:3000/save-database', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'X-DB-Path': dbPath // Send full path in headers
        },
        body: binaryArray
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error saving database:', error));
  }
  // Expose the initSqlJs function to the global scope
  global.initSqlJs = initSqlJs;
  global.saveDatabase=saveDatabase
})(window);
