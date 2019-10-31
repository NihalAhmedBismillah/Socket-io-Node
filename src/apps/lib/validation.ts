import "reflect-metadata";

interface IValidationRule {
    evaluate(target: any, value: any, key: string): string | null;
}

class RequiredValidationRule implements IValidationRule {
    static instance = new RequiredValidationRule();

    evaluate(target: any, value: any, key: string): string | null {
        if (value) {
            return null;
        }
        return `${key} is required`;
    }
}

export function required(target: any, propertyKey: string) {

    addValidationRule(target, propertyKey, RequiredValidationRule.instance);
}


function addValidationRule(target: any, propertyKey: string, rule: IValidationRule) {

    let rules: IValidationRule[] = Reflect.getMetadata("validation", target, propertyKey) || [];
    rules.push(rule);

    let properties: string[] = Reflect.getMetadata("validation", target) || [];
    if (properties.indexOf(propertyKey) < 0) {
        properties.push(propertyKey);
    }

    Reflect.defineMetadata("validation", properties, target);
    Reflect.defineMetadata("validation", rules, target, propertyKey);
}
export interface IErrorMessage {
    status: boolean;
    errorMessage: Array<string>;
}

export class Validator {
    validate(target: any): Array<string> {
        // Get the list of properties to validate
        const keys = Reflect.getMetadata("validation", target) as string[];
        let errorMessages: string[] = [];
        if (Array.isArray(keys)) {
            for (const key of keys) {
                const rules = Reflect.getMetadata("validation", target, key) as IValidationRule[];
                if (!Array.isArray(rules)) {
                    continue;
                }
                for (const rule of rules) {
                    const error = rule.evaluate(target, target[key], key);
                    if (error) {
                        errorMessages.push(error);
                    }
                }
            }
        }
        return errorMessages;
    }
    /**
     * Validate model
     * @param target 
     */
    isValid(target: any): IErrorMessage {
        const validationResult = this.validate(target);
        const valFlag = (validationResult.length === 0) ? true : false;
        const errorMessages: IErrorMessage = <IErrorMessage>{ status: valFlag, errorMessage: validationResult }
        return errorMessages;
    }
}