(function(global) {
    function initSqlJs(config) {
        return new Promise((resolve, reject) => {
            // Load sql-wasm.js and initialize SQL.js
            const script = document.createElement('script');
            script.src = config.sqlJsPath || 'https://sql.js.org/dist/sql-wasm.js';
            script.onload = () => {
                window.initSqlJs({
                    locateFile: file => config.wasmPath || `https://sql.js.org/dist/${file}`
                }).then(SQL => {
                    // Fetch the SQLite database file
                    if (config.dbPath) {
                        fetch(config.dbPath)
                            .then(response => response.arrayBuffer())
                            .then(buffer => {
                                const db = new SQL.Database(new Uint8Array(buffer));
                                global.sqliteDB = db;
                                resolve(db);
                            })
                            .catch(reject);
                    } else {
                        // Create an empty database if no dbPath is provided
                        const db = new SQL.Database();
                        global.sqliteDB = db;
                        resolve(db);
                    }
                }).catch(reject);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Expose the initSqlJs function to the global scope
    global.initSqlJs = initSqlJs;
})(window);
