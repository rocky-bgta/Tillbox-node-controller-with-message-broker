import {Status} from "../enum/enums";

export default abstract class BaseModel {

    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
    status: number;

    constructor() {
        this.status = Status.Active;
        this.createdDate = new Date();
        this.updatedDate = new Date();
        this.createdBy= 'System';
        this.updatedBy= 'System';
    }
}