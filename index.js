const express = require('express'),
    app = express(),
    { proxy, scriptUrl } = require('rtsp-relay')(app),
    http = require('http'),
    PORT=2000;
app.ws('/:cameraIP', (ws, req) => {
    console.log(`request from ${req.headers.origin}`);
    var cameraIP = decodeURIComponent(req.params.cameraIP);
    console.log(`cameraIP: ${cameraIP}`);
    proxy({
        url: `rtsp://${config_data.cctv_rtsp.rtsp_url}`,
        transport: 'tcp',
        verbose: true,
    })(ws);
});
const server = http.createServer((req, res) => {
    res.end('Server berjalan di IP ini');
});
server.listen(3000, () => {
    const address = server.address();
    console.log(`Server berjalan pada http://${address.address}:${address.port}`);
});
console.log(`running http://localhost:${PORT}`);
