/**
 * This is a demo operation to show how to use typescript-rest library.
 */
import {GET, Path, PathParam} from 'typescript-rest';
import {Tags} from 'typescript-rest-swagger';
import * as mqtt from 'mqtt';
import MessageModel from "../models/messageModel";
import Utils from "../utils/utils";

@Tags('MQTT')
@Path('api/mqtt/test')
export class mqttController {

    constructor() {
    }

    @Path('/subscribe/:message')
    @GET
    async subscribe(@PathParam('message') message: string): Promise<any> {
        let topicId:string=  Utils.generateUniqueID();  //Math.floor(Math.random() * 65535);

        let messageModel: MessageModel = new MessageModel();
        messageModel.topicId = topicId;
        messageModel.qos = 0;

        let result: string=message;
        let isConnected:boolean=false;
        let isMessageReceived: boolean=false;
        let storeOption  = new mqtt.Store({
            clean:false
        });


        let client = mqtt.connect('tcp://localhost:1883',{
            keepalive:0,
            reschedulePings:false,
            clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
            protocolId: 'MQTT',
            protocolVersion: 4,
            clean:true,
            incomingStore:storeOption,
            outgoingStore:storeOption,

        });


        client.on('connect', function () {
            client.subscribe(messageModel.topicId,{qos: 0});

            messageModel.message = 'Message Published from NodeJS End: ' + message;

            client.publish('nybsys', JSON.stringify(messageModel),{
                qos: 0,
                retain:false,
            });
            isConnected=true;
        });

        require('deasync').loopWhile(function(){return !isConnected;});

        client.on('message', function (topic, message) {
            console.log("\nMessage Receive message at NodeJS End: " + message.toString());
            //console.log(message.toString());
            result = message.toString();
            client.end();
            isMessageReceived = true;
        });

        require('deasync').loopWhile(function(){return !isMessageReceived;});

        return result;
    }


   /* public isConnected(client: mqtt.Client, message:string){
        let result:boolean=false;
        client.on('connect', function () {
            client.subscribe('nybsysPublished');
            client.publish('nybsys', 'Message Published from NodeJS End: ' + message)
            result = true;
        });
        return result;
    }*/

}
