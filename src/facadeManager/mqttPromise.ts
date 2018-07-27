import * as mqtt from 'mqtt';

let client:mqtt.Client = mqtt.connect('tcp://localhost:1883', {
    keepalive: 0,
    reschedulePings: false,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    protocolId: 'MQTT',
    protocolVersion: 4
});

export default class MqttPromise {

    public async getConnection() {
        //let promiseConnection =
        return new Promise((resolve, reject) => {
            client.on('connect', function () {
                resolve(client);
            });
            client.on('error', function () {
                reject();
            })
        });

        //return promiseConnection
    }

    public async getMessage(client: mqtt.Client) {
        //let promiseMessage =
        return new Promise((resolve, reject) => {
            client.on('message', function (topic, message) {
                client.end();
                resolve(message.toString());
            });

        });
        //return promiseMessage;
    }
}


