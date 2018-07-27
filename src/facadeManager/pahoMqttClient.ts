/**
 *Created By: Md. Nazmus Salahin
 *Created Date: 12/10/2017
 *Modified By:
 *Modified date:
 *(C) CopyRight Nybsys ltd.
 */



/*
var Paho = require('paho-mqtt');
export default class PahoMqttClient {


    getClient(host: string, port: number) {
        let client, clientId,isConnected:boolean=false;
        clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
        // Create a client instance
        client = new Paho.MQTT.Client(host, Number(port), clientId);
        client.connect({
            onSuccess: function () {
                console.log("onConnect success");
                isConnected = true;
            }
        });

        require('deasync').loopWhile(function(){return !isConnected;});

        if (isConnected)
            return client;
        else
            return null;
    }



    createMessage(message:string, topic:string) {
        let buildMessage;
        let messageId = Math.random().toString(16).substr(2, 8);
        buildMessage = new Paho.MQTT.Message(message);
        buildMessage.destinationName = topic;
        buildMessage.qos = 0;
        buildMessage.retained = false;
        buildMessage.messageId = messageId;
        return buildMessage;
    }

    publishedMessage(client:any,buildMessage:any){
        client.send(buildMessage);
    }

    /!*

        onConnectCallBack(){
            console.log("onConnect success");
            this.isConnected = true;

        }
    *!/


}*/