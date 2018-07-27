/**
 *Created By: Md. Nazmus Salahin
 *Created Date: 10/10/2017
 *Modified By:
 *Modified date:
 *(C) CopyRight Nybsys ltd.
 */
import {setting} from "../setting/setting";
import Utils from "../utils/utils";
import TokenModel from "./tokenModel";

let jwt = require('jsonwebtoken');
let jwtRefreshToken = require('jsonwebtoken-refresh');
export default class Authentication {

    constructor() {

    }

    async generateToken(payload: any): Promise<TokenModel> {
        let tokenModel: TokenModel = new TokenModel();
        let token = await jwt.sign({
            data: payload,
        }, setting.TOKEN_SECRET, {expiresIn: '7 days'});

        Utils.logger('Token', token);
        tokenModel.token = token;
        return tokenModel;
    }

    async decodeToken(token: TokenModel): Promise<TokenModel> {
        let decodedTokenObject;
        let givenToken = token.token;
        let tokenModel: TokenModel = new TokenModel();
        try {
            tokenModel.token = givenToken;
            decodedTokenObject = await jwt.verify(givenToken, setting.TOKEN_SECRET);
            tokenModel.decodedTokenObject = decodedTokenObject;
            Utils.logger('Decoded Token', decodedTokenObject);
        } catch (err) {
            //let refreshToken;
            //refreshToken = await this.getRefreshToken(givenToken);
            Utils.logger('Wrong Decoded Token', err);
            tokenModel.token = null;
            //tokenModel.token = refreshToken;
            //return givenToken;
        }
        return tokenModel;
    }

    async getRefreshToken(token: string): Promise<string>{
        try{
            var originalDecoded = jwt.decode(token, {complete: true});
            var refreshed = jwtRefreshToken.refresh(originalDecoded,
                '60d', setting.TOKEN_SECRET);
        }catch (err){
            Utils.logger("not valid token");
        }

        return refreshed;
    }

}
