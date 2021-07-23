import { ValidateIf, ValidationOptions, buildMessage, ValidateBy } from 'class-validator'

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

/**自定义装饰器-验证手机号**/
export function IsMobile(validationOptions?: ValidationOptions) {
	return ValidateBy(
		{
			name: 'isMobile',
			validator: {
				validate: (value, args) => {
					return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)
				},
				defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a string', validationOptions)
			}
		},
		validationOptions
	)
}
