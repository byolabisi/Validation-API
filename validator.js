/// Defines the required fields and rules schemas.

const joi = require('joi')

const requiredFieldsSchema = joi.object({
   rule: joi.object({
       field: joi.any().required(),
       condition: joi.string().valid('eq', 'neq', 'gt', 'gte', 'contains').required(),
       condition_value: joi.any().required()
   }).required(),
   data: joi.alternatives().try(joi.object(), joi.array(), joi.string()).required()
})

/**
 * Checks the specified condition and evaluates it between the field and condition values.
 * @param {*} param packet { fieldValue, condition, conditionValue }
 */
function ruleFieldSchema(fieldValue, condition, conditionValue) {
    switch(condition) {
        case 'eq':
            return fieldValue === conditionValue
        case 'neq':
            return fieldValue !== conditionValue
        case 'gt':
            return fieldValue > conditionValue
        case 'gte':
            return fieldValue >= conditionValue
        case 'contains':
            return fieldValue.includes(conditionValue)
    }
}

module.exports = { requiredFieldsSchema, ruleFieldSchema }