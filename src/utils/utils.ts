/**
 *Created By: Md. Nazmus Salahin
 *Created Date: 10/24/2017
 *Modified By:
 *Modified date:
 *(C) CopyRight Nybsys ltd.
 */
//import {Sequelize} from "sequelize-typescript";
import * as _ from 'lodash';
import {ICustomType} from "../core/interface/ICustomType";
import {plainToClass} from "class-transformer";
import {Validator} from "validator.ts/Validator";
//import * as util from "util";

//let fs = require('fs');
let uniqid = require('uniqid');
//let moment = require('moment');
//const readdir = util.promisify(fs.readdir);
//const readFile = util.promisify(fs.readFile);

export default class Utils {

    /*static async createDataBase(db: Sequelize, dataBaseName: string): Promise<boolean> {
        let dataBaseCreated: boolean = false;
        /!*SELECT datname FROM pg_database
        WHERE datname = 'kamal_gmail_com'*!/
        try {
            await db.query('CREATE DATABASE ' + dataBaseName);
            dataBaseCreated = true;
        }
        catch (err) {
            console.log(err.message);
            dataBaseCreated = false;
        }
        return dataBaseCreated;
    }*/

   /* static async dropDataBase(db: Sequelize, dataBaseName: string): Promise<boolean> {
        let dropDatabase: boolean = false;
        try {
            await db.query('DROP DATABASE [ IF EXISTS ] ' + dataBaseName);
            dropDatabase = true;
        }
        catch (err) {
            console.log(err.message);
            dropDatabase = false;
        }
        return dropDatabase;
    }
*/
    static generateUniqueID() {
        let uniqueID: string;
        uniqueID = uniqid();
        return uniqueID;
    }

    static logger(message: string, object?: any) {
        if (!(_.isEmpty(message)) && (typeof object === 'undefined')) {
            console.log(message);
        } else {
            if ((object != null || (typeof object !== 'undefined')) && !(_.isEmpty(message))) {
                console.warn(message + ": " +
                    JSON.stringify(object, null, 2));
            } else {
                console.log(message + ": null");
            }
        }
        return;
    }


    static getDbNameByUserID(userID: string, businessID?:number) {
        let result:string='';
        try {

            if(_.isNumber(businessID)&& businessID>0){
                result = ''+ businessID +'_';
            }

            result = result + userID.replace("@", "_")
                .replace(".", "_");
        } catch (err) {
            Utils.logger('user id is not in correct format', err);
        }
        return result;
    }

    static getDbNameByBusinessName(businessName: string,businessID?:number) {
        let result: string='';
        try {
            if(_.isNumber(businessID)&& businessID>0){
                result = ''+ businessID +'_';
            }
            businessName = businessName.replace(" ", "_");

            result = result + businessName + '_' + new Date().getTime();
        } catch (err) {
            Utils.logger('user id is not in correct format', err);
        }
        return result;
    }

    static castObject(targetObject: any, givenObject: any) {
        let buildObject: ICustomType = {};
        let targetObjectPros = Object.keys(targetObject);
        let givenObjectPros = Object.keys(givenObject);
        for (let targetProperty of targetObjectPros) {
            for (let givenProperty of givenObjectPros) {
                if (targetProperty == givenProperty) {
                    buildObject[targetProperty] = givenObject[targetProperty];
                    break;
                }
            }
        }
        return buildObject;
    }

    static getCurrentPeriod(startDate: Date, endDate: Date, currentDate: Date) {
        let startYear = startDate.getFullYear();
        let endYear = endDate.getFullYear();
        let currentYear = currentDate.getFullYear();
        let yearLength = Math.abs(startYear - endYear);
        let startMonth = startDate.getMonth();
        //let endMonth = endDate.getMonth();
        let previousEndPeriod;
        let givenMonth = currentDate.getMonth();
        let period: number = 0;
        if (currentYear == startYear) {
            period = Math.abs((startMonth - givenMonth)) + 1;
        } else {
            previousEndPeriod = (Math.abs(startMonth - (12 * yearLength))) + 1;
            period = previousEndPeriod + givenMonth;
        }
        return period;
    }

  /*  static getStartDateFromYearMonth(year: number, month: number) {
        let temDate = new Date(year, month - 1, 1);
        let formatDate = moment(temDate).format('YYYY-MM-DD');
        let buildDate = new Date(formatDate);
        return buildDate;
    }

    static getEndDateFromYearMonth(year: number, month: number) {
        let temDate;
        temDate = new Date(year, month, 0);
        let formatDate = moment(temDate).format('YYYY-MM-DD');
        let buildDate = new Date(formatDate);
        return buildDate;
    }

    static getDate(year: number = null, month: number = null, day: number = null) {
        let temDate, dateFromat = null;

        if (year != null && month != null && day != null)
            temDate = new Date(year, month, day);
        else
            temDate = new Date();

        dateFromat = 'YYYY-MM-DD';

        let formatDate = moment(temDate).format(dateFromat);
        let buildDate = new Date(formatDate);
        return buildDate;
    }*/

    static getKeyValueFromEnum(providedEnum: any) {
        let buildKeyValuePair: ICustomType = {};
        let i: number = 1;
        let enumProperties: any[] = new Array<any>();
        for (let enumMember in providedEnum) {
            let isValueProperty = parseInt(enumMember, 10) >= 0;
            if (isValueProperty) {
                buildKeyValuePair = new Object();
                buildKeyValuePair.key = i;
                buildKeyValuePair.value = providedEnum[enumMember];
                enumProperties.push(buildKeyValuePair);
                i++;
            }
        }
        return enumProperties;
    }

    static isValidModel(modelClass: any, model: any) {
        let result: boolean = true;
        let validator = new Validator();
        let errors: any;
        let validationCheck = plainToClass(modelClass, model);
        errors = validator.validate(validationCheck);
        if (!_.isEmpty(errors)) {
            result = false;
        }
        return result;

    }

    static uniqueIndexOnColunmn(tableName: string, columnName: string, indexName: string) {
        'CREATE UNIQUE INDEX' + indexName + 'ON' + '"' + tableName + '"' + '((lower(' + columnName + ')));';
        //return buildObject;
    }

}