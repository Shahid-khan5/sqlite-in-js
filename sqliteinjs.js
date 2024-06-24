(function(global) {
    function initSqlJs(config) {
        return new Promise((resolve, reject) => {
            // Load sql-wasm.js and initialize SQL.js
            const script = document.createElement('script');
            script.src = config.sqlJsPath || 'https://sql.js.org/dist/sql-wasm.js';
            script.onload =async () => {
               const sqlPromise= window.initSqlJs({
                    locateFile: file => config.wasmPath || `https://sql.js.org/dist/${file}`
                });

                    if (config.dbPath) {
                        const dataPromise = fetch(config.dbPath).then(res => res.arrayBuffer());
                        const [SQL, buf] = await Promise.all([sqlPromise, dataPromise])
                        const db = new SQL.Database(new Uint8Array(buf));
                        global.sqliteDB = db;
                        resolve(db);
                    } 
                    else {
                        // Create an empty database if no dbPath is provided
                        const [SQL] = await Promise.all([sqlPromise])
                        const db = new SQL.Database();
                        global.sqliteDB = db;
                        resolve(db);
                    }
                
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Expose the initSqlJs function to the global scope
    global.initSqlJs = initSqlJs;
})(window);
