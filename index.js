const express = require('express'),
    app = express(),
    { proxy, scriptUrl } = require('rtsp-relay')(app),
    args = process.argv.slice(2),
    getPort = parseInt(args[0]),
    dgram = require('dgram'),
    parseString = require('xml2js').parseString,
    discoveryMessage = `
<?xml version="1.0" encoding="UTF-8"?>
<e:Envelope xmlns:e="http://www.w3.org/2003/05/soap-envelope"
 xmlns:w="http://schemas.xmlsoap.org/ws/2004/08/addressing"
 xmlns:d="http://schemas.xmlsoap.org/ws/2005/04/discovery"
 xmlns:dn="http://www.onvif.org/ver10/network/wsdl">
  <e:Header>
    <w:MessageID>uuid:0b4c19c5-8a18-4d63-9d99-6aa67af5e34d</w:MessageID>
    <w:To>urn:schemas-xmlsoap-org:ws:2005:04:discovery</w:To>
    <w:Action>http://schemas.xmlsoap.org/ws/2005/04/discovery/Probe</w:Action>
  </e:Header>
  <e:Body>
    <d:Probe>
      <d:Types>dn:NetworkVideoTransmitter</d:Types>
    </d:Probe>
  </e:Body>
</e:Envelope>`,
    discoveryPort = 3702,
    discoveryAddress = '239.255.255.250',
    socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

var PORT = 2000;

app.ws('/:cameraIP', (ws, req) => {
    console.log(`request from ${req.headers.origin}`);
    var cameraIP = decodeURIComponent(req.params.cameraIP);
    console.log(`cameraIP: ${cameraIP}`);
    proxy({
        url: `rtsp://${cameraIP}`,
        transport: 'tcp',
        verbose: true,
    })(ws);
});

if (getPort != null && Number.isInteger(getPort)) {
    PORT = getPort;
}

app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
});
socket.on('message', (message, rinfo) => {
    parseString(message, { explicitArray: false, ignoreAttrs: true }, (err, result) => {
        if (err) {
          console.log(`Discovery Response Received ${rinfo.address}:${rinfo.port} err: ${err}`);
          //console.error('Error parsing XML:', err);
        } else {
          try {
              // Mengambil nilai dari elemen d:XAddrs
              const xAddrsValue = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['d:ProbeMatches']['d:ProbeMatch']['d:XAddrs'];
              console.log(`Discovery Response Received ${rinfo.address}:${rinfo.port} d:XAddrs: ${xAddrsValue}`);
          } catch (e) {
              console.log(`Discovery Response Received ${rinfo.address}:${rinfo.port} err: ${e.message}`);
          }
        }
      });  
  });
  
  socket.on('error', (err) => {
    console.error('Socket Error:', err);
    socket.close();
  });
  
  // Bind to the discovery port and address
  socket.bind(discoveryPort, () => {
    socket.setBroadcast(true);
    socket.send(discoveryMessage, 0, discoveryMessage.length, discoveryPort, discoveryAddress, (err) => {
      if (err) {
        console.error('Error sending discovery message:', err);
      } else {
        console.log('Discovery message sent successfully');
      }
  
      // Close the socket after sending the discovery message
      //socket.close();
    });
  });
  
  
  setTimeout(() => {
    socket.close();
  }, 30000);
  