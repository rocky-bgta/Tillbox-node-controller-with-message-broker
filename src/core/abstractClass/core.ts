/**
 *Created By: Md. Nazmus Salahin
 *Created Date: 10/28/2017
 *Modified By:
 *Modified date:
 *(C) CopyRight Nybsys ltd.
 */
import {ICustomType} from "../interface/ICustomType";
import {plainToClass} from "class-transformer";
import {Validator} from "validator.ts/Validator";
import * as lodash from 'lodash';
import * as util from "util";

let events = require('events');
let eventEmitter = new events.EventEmitter();
const sleep = util.promisify(setTimeout);

//let transactionState:string=null;
export default abstract class Core {
    customObject: ICustomType;
    lodash=lodash;
    sleep=sleep;

    constructor() {
        this.customObject = {};
    }

    public static getEventEmitter(){
        return eventEmitter;
    }

    public castObject(targetObject: any, givenObject:any){
        let buildObject: ICustomType = {};
        let targetObjectPros = Object.keys(targetObject);
        let givenObjectPros = Object.keys(givenObject);
        for(let targetProperty of targetObjectPros){
            for(let givenProperty of givenObjectPros){
                if(targetProperty==givenProperty){
                    buildObject[targetProperty] = givenObject[targetProperty];
                    break;
                }
            }
        }
        return buildObject;
    }

    static isValidModel(modelClass: any, model: any) {
        let result: boolean = true;
        let validator = new Validator();
        let errors: any;
        let validationCheck = plainToClass(modelClass, model);
        errors = validator.validate(validationCheck);
        if (!lodash.isEmpty(errors)) {
            result = false;
        }
        return result;

    }
}

