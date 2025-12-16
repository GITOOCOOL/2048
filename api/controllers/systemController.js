const http2 = require("http2");

exports.checkConnection = (req, res) => {
  const client = http2.connect("https://www.google.com");
  client.on("connect", () => {
    res.send({ connection: true });
    client.close();
  });
  client.on("disconnect", () => {
    // console.log("disconnected from the internet");
    // Only send response if header not sent (though simple check here assumes one response)
  });
  client.on("error", (err) => {
    // console.log("disconnected from the internet");
    res.send({ connection: false });
    client.close();
  });
  
  // Handl timeouts?
};
