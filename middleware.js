// Functions that implement the schemas and intercept the request to enforce requirements.

const { errorResponse, internalErrorResponse } = require('./utils/response.utils');
const { requiredFieldsSchema, ruleFieldSchema } = require('./validator')

/**
 * Returns an error message for invalid json errors caught from the body parser middleware.
 * @param {*} err error object
 * @param {*} _ placeholder for the request which isn't used here
 * @param {*} res response object
 * @param {*} next passes to the next handler
 */
const catchInvalidPayload = (err, _, res, next) => {
    if (err) {
        errorResponse({ message: "Invalid JSON payload passed.", res })
    }
    next()
  }

  /**
 * Implements the required fields schema. Returns the appropriate error message if violated.
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} next passes to the next handler
 */
async function requiredFields(req, res, next) {
    try {
        const values = await requiredFieldsSchema.validateAsync(req.body, {
            escapeHtml: true
        });
        req.body = values;
        return next()
    }
    catch (error) {
        errorResponse({message: error.details[0].message+".", res})
    }
}

  /**
 * Checks for the specified field in the rules object. Returns the appropriate error message if absent.
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} next passes to the next handler
 */
function checkForSpecifiedField(req, res, next) {
    try{
        const field = req.body.rule.field
        if(req.body.data.hasOwnProperty(field)) {
            return next()
        }
        errorResponse({ message: `field ${field} is missing from data.`, res })
    }
    catch(error){
        internalErrorResponse({ data: error.details, res })
    }
}

  /**
 * Confirms that the specified field value fulfils the condition. Returns appropriate error otherwise.
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} next passes to the next handler
 */
function ruleFieldValidation(req, res, next){
    try{
        const selectedField = req.body.rule.field
        const condition = req.body.rule.condition
        const fieldValue = req.body.data[selectedField]
        const conditionValue = req.body.rule.condition_value
        if (ruleFieldSchema(fieldValue, condition, conditionValue)) {
            return next()
        }
        const validationDetails = {
            error: true,
            field: selectedField,
            field_value: fieldValue,
            condition: req.body.rule.condition,
            condition_value: req.body.rule.condition_value
        }
        errorResponse({ message: `field ${selectedField} failed validation.`, data: { validation: validationDetails }, res })
    }
    catch(error){
        internalErrorResponse({ data: error.details, res })
    }
}

module.exports = { catchInvalidPayload, requiredFields, checkForSpecifiedField, ruleFieldValidation } 