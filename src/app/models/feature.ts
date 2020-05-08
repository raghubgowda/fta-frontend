import { required, prop } from "@rxweb/reactive-form-validators";

export class Feature {
    @prop()
    id: string;
    @required()
    displayName: string;
    @required()
    technicalName: string;
    @required()
    description: string;
    @required()
    expiresOn: Date;
    @prop()
    value: boolean = true;
    @prop()
    createdOn: Date = new Date;
    @prop()
    createdBy: string;
    @prop()
    modifiedOn: Date;
    @prop()
    modifiedBy: string;

    constructor(cfg: Partial<Feature> = {}) {
        Object.assign(this, cfg);
    }
}