module.exports = function(RED) {

  mfrc522 = require("mfrc522-rpi");
  mfrc522.initWiringPi(0);

  function RFIDReadNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var msg = {};

    //node.status({fill:"green", shape:"dot", text:"all good!"});

    setInterval(function(){

      //# reset card
      mfrc522.reset();

      //# Scan for cards
      let response = mfrc522.findCard();
      if (!response.status) {
	//msg.payload = "No Card";
        //node.send(msg);
        return;
      }
      //console.log("Card detected, CardType: " + response.bitSize);

      //# Get the UID of the card
      response = mfrc522.getUid();
      if (!response.status) {
        //node.send("UID Scan Error");
        return;
      }
      //# If we have the UID, continue
      const uid = response.data;
      //msg.payload = "Card read UID: %s %s %s %s", uid[0].toString(16), uid[1].toString(16), uid[2].toString(16), uid[3].toString(16);
      msg.payload = uid; 
      node.send( msg );

      //# Select the scanned card
      //const memoryCapacity = mfrc522.selectCard(uid);
      //node.send("Card Memory Capacity: " + memoryCapacity);

      //# This is the default key for authentication
      //const key = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];

      //# Authenticate on Block 8 with key and uid
      //if (!mfrc522.authenticate(8, key, uid)) {
      //  node.send("Authentication Error");
      //  return;
      //}

      //# Dump Block 8
      //node.send("Block: 8 Data: " + mfrc522.getDataForBlock(8));

      //# Stop
      mfrc522.stopCrypto();


    }, 1500);

  }
  RED.nodes.registerType("rfid-read", RFIDReadNode);
}
