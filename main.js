const createServer = require('./server.js');

const PORT = 8080;

const server = createServer(PORT);

server.listen(PORT, () => { console.log("Restify server is now listening") });