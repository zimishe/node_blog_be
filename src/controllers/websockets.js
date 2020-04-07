const WebSocket = require('ws');
const qs = require('qs');

const wsServer = new WebSocket.Server({
  port: 8001,
});

wsServer.on('connection', (ws, req) => {
  const data = qs.parse(req.url.slice(2, req.url.length));
  // eslint-disable-next-line no-param-reassign
  ws.id = data.user_id;
  ws.send('connected!');
});

module.exports = wsServer;
