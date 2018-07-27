/*
* ResponseMessage model class
* */

export default class ResponseMessage {


    // Login related
    public token: string;

    // Response related
    public responseObj: any;
    public businessID: number;
    public message: string;
    public responseCode: number;

    // Pagination
    public pageIndex: number;
    public recordCount: number;

    constructor() {
        this.token = 'not init';
        this.responseObj = null;
        this.message = 'not init';
        this.responseCode = null;
        this.pageIndex = 0;
        this.recordCount = 0;
        this.businessID = 0;
    }

    public getResponseCode(): number {
        return this.responseCode;
    }

    public setResponseCode(value: number) {
        this.responseCode = value;
    }

    getToken(): string {
        return this.token;
    }

    setToken(value: string) {
        this.token = value;
    }

    getMessage(): string {
        return this.message;
    }

    setMessage(value: string) {
        this.message = value;
    }

    getPageIndex(): number {
        return this.pageIndex;
    }

    setPageIndex(value: number) {
        this.pageIndex = value;
    }

    getRecordCount(): number {
        return this.recordCount;
    }

    setRecordCount(value: number) {
        this.recordCount = value;
    }

    getResponseObject(): any {
        return this.responseObj;
    }

    setResponseObject(value: any) {
        this.responseObj = value;
    }


    getBusinessID(): number {
        return this.businessID;
    }

    setBusinessID(value: number) {
        this.businessID = value;
    }
}