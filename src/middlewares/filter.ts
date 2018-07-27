/**
 *Author: Md. Nazmus Salahin
 *Date: 10/4/2017
 *Time: 9:45 AM
 */
import * as express from 'express';
import RequestClientData from "../core/global/RequestClientData";
import {default as Utils} from "../utils/utils";
import publicApiList from "../security/publicApiList"
import * as _ from 'lodash';
import {Inject} from "typescript-ioc";
//import * as BLL from "../bllManager/index"
//import * as Models from "../models/index"
import Authentication from "../security/authentication";
import TokenModel from "../security/tokenModel";
import Core from "../core/abstractClass/core";

let clientDataExport: RequestClientData;

export default class Filter extends Core {

    constructor() {
        super()
    }

    /*@Inject
    sessionBll: BLL.session;*/
    @Inject
    private authentication: Authentication;

    //private sessionModel: Models.session;
    private newToken: string;
    private apiUrl: string;

    public async getAllRoutes(app: express.Application) {
        let needAuthentication: boolean = false;
        let requestUrl: string = null;

        app.route("/*")
            .all(async (req: express.Request,
                        res: express.Response,
                        next: express.NextFunction) => {

                requestUrl = <string>req.originalUrl;

                if (requestUrl.indexOf('?') >= 0) {
                    this.apiUrl = requestUrl.substr(0, requestUrl.indexOf('?'));
                }
                else {
                    this.apiUrl = requestUrl;
                }
                if (requestUrl != null && requestUrl != undefined) {
                    let doc: boolean = requestUrl.includes('/api-docs/');
                    if (!doc) {
                        needAuthentication = await this.checkPublicApi(this.apiUrl);
                        if (needAuthentication) {
                            await this.validateTokenAndBuildClientData(req, res);
                        }else {
                            clientDataExport=null;
                        }
                    }
                }

               /* res.on('finish', function () {
                    //Util.logger("Finished " + res.statusCode);  // for example
                });*/
                next();
            });
    }

    private async checkPublicApi(url: string): Promise<boolean> {
        let result: boolean = true;
        for (let api of publicApiList) {
            if (_.isEqual(api, url)) {
                result = false;
                break;
            }
        }
        return result;
    }

    private async validateTokenAndBuildClientData(req: express.Request, res: express.Response) {
        let whereCondition = this.customObject;
        let clientHeaderData: any, clientJsonData: RequestClientData;

        try {
            clientHeaderData = req.headers.clientdata;

            if (clientHeaderData != undefined) {
                clientJsonData = JSON.parse(clientHeaderData);

                let decodedTokenModel: TokenModel = new TokenModel();
                decodedTokenModel.token = clientJsonData.token;
                decodedTokenModel = await this.authentication.decodeToken(decodedTokenModel);

                if (decodedTokenModel.token != null) {
                    this.buildClientData(clientHeaderData, decodedTokenModel, req, decodedTokenModel.token, this.apiUrl);
                } else {
                    //build new token and update session table
                    let refreshToken: string, expiredToken: string;

                    whereCondition = new Object();
                    whereCondition.token = clientHeaderData.token;
                    //this.sessionModel = await this.sessionBll.getOneByCondition(whereCondition, 'session');//getSessionDetails(clientJsonData.token);
                    //refreshToken = this.sessionModel.refreshToken;
                    //expiredToken = this.sessionModel.token;

                    this.newToken = await this.authentication.getRefreshToken(refreshToken);
                    //this.sessionModel.token = this.newToken;

                    whereCondition = new Object();
                    whereCondition.token = expiredToken;
                    //await this.sessionBll.updateByCondition(this.sessionModel, whereCondition, 'update session');//updateSession(this.sessionModel, whereCondition);
                    //this.buildClientData(clientHeaderData, decodedTokenModel, req, this.newToken, this.apiUrl, this.sessionModel.sessionID);

                }
            }

        } catch (err) {
            Utils.logger('Error from filter', err);
        }
    }

    buildClientData(clientHeaderData: any, decodedTokenModel: TokenModel, req: express.Request, token: string, apiUrl: string, sessionID?: number) {
        let clientJsonData: RequestClientData;

        if (clientHeaderData != undefined) {
            clientJsonData = JSON.parse(clientHeaderData);
            clientDataExport = new RequestClientData();
            clientDataExport.clientIP = <string>req.headers.host;
            clientDataExport.address = apiUrl;
            clientDataExport.token = token;
            clientDataExport.pageName = clientJsonData.pageName;
            clientDataExport.moduleID = clientJsonData.moduleID;
            clientDataExport.userID = decodedTokenModel.decodedTokenObject.data.userID;

            if(decodedTokenModel.decodedTokenObject.data.userID!=0)
                clientDataExport.businessID = decodedTokenModel.decodedTokenObject.data.businessID;
            else throw Error;

            clientDataExport.accessRight = decodedTokenModel.decodedTokenObject.data.accessRight;
            clientDataExport.businessDBName = decodedTokenModel.decodedTokenObject.data.businessDBName;
            if (sessionID != null)
                clientDataExport.sessionID = sessionID;
        }
    }

}

export {clientDataExport as clientData}