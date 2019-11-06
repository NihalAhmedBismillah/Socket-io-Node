
import { Validator,required } from "../lib/validation";
/**
 * Address model
 */
export class Address {

    addressLine1: string = null;
    addressLine2: string = null;
    city: string = null;
    state: string = null;
    zipCode: string = null;
    countryCode: string = null;
    isDefault= true;
    constructor(values?:Address){
        if(values) Object.assign(this,values);
    }
}


/**
 * ContractNo model 
 */
export class ContractNo {
    contType: string = null;
    contNo: string = null;
    constructor(values?:ContractNo){
        if(values) Object.assign(this,values);
    }
}


/**
 * SensorAllocation model 
 */
export class User  extends Validator{

    _id: string = null;
    @required
    firstName: string = null;
    @required
    lastName: string = null;
    @required
    dob: string = null;
    @required
    gender: string = null;
    contractNos: Array<ContractNo> = [];
    address: Array<Address> = [];
    userType: string = null // 
    createdBy: string = null;
    createdOn: string = null;
    modifyBy: string = null;
    modifyOn: string = null;
    status: string = null // active or inactive
    constructor(user?: User) {
        super();
        if (user) {
            Object.assign(this, user);
            this.contractNos = user.contractNos || [];
            this.address = user.address || [];
        }
    }
}