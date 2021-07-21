import { ValidateIf, ValidationOptions } from 'class-validator'

/**自定义装饰器-验证空值**/
export function IsOptional(validationOptions?: ValidationOptions, props?: { string?: boolean; number?: boolean }) {
	if (props?.number) {
		return ValidateIf((obj, value) => {
			return value !== null && value !== undefined && value !== '' && value !== 0
		}, validationOptions)
	}

	if (props?.string) {
		return ValidateIf((obj, value) => {
			return value !== null && value !== undefined && value !== ''
		}, validationOptions)
	}

	return ValidateIf((obj, value) => {
		return value !== null && value !== undefined
	}, validationOptions)
}
