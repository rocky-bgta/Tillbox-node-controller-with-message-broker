/*
* RequestMessage model class
* */

export default class RequestMessage {

    public token: string;
    public requestObj: any;
    public businessID: number;
    public pageIndex: number = 0;
    public pageSize: number = 0;

    constructor() {
    }
}