# Rules-validation API

This is live at [byolabisi.herokuapp.com](byolabisi.herokuapp.com) (GET)

The directions below guide the requests and responses that can be sent to it.


Response structure: JSEND pattern.

Example:

```
JSON
{

  "message": "API response message",

  "status": "success",

  "data": {

  isValidForRule: true,

  }

}

```

"message" - Apt response message for your API. (Unless otherwise stated, this message can be anything you decide)

"status" - Status for your API response. The two possible values for this prop are "success" and "error" (PS: This isn't the response HTTP status code)

"data" - This is the meat of your API response. It should contain your actual response data.


There are two routes:

1/ First route is the base route. HTTP GET "/"

It should return with data in the following format:

```JSON
{

  "message": "My Rule-Validation API"

  "status": "success",

  "data": {

  "name": "Olabisi Emmanuel",

  "github": "@byolabisi",

  "email": "olabisi.io@icloud.com",

  "mobile": "+2348164575552",

  "twitter": "@byolabisi"

  }

}

```

Please note:

a/ name should be your full name

b/ github should be your github handle (the '@' symbol must be included)

c/ email should be your preferred email of contact

d/ mobile should be your preferred mobile number of contact

e/ twitter should be your twitter handle (the '@' symbol must be included). [PS: This field is optional, you can choose to include it in your response or not]

2/ Second route is the rule validation route. HTTP POST "/validate-rule"

The route should accept JSON data containing a rule and data field to validate the rule against. Example:

```
JSON
{

"rule": {

"field": "missions"

"condition": "gte",

"condition_value": 30

},

"data": {

"name": "James Holden",

"crew": "Rocinante",

"age": 34,

"position": "Captain",

"missions": 45

}

}

```
Endpoint requirements/constraints:

a/ The rule and data fields are required.

b/ The rule field should be a valid JSON object and should contain the following required fields:

b1/ field: The field in the data passed to validate the rule against

b2/ condition: The condition to use for validating the rule. Accepted condition values are:

i/ eq: Means the field value should be equal to the condition value

ii/ neq: Means the field value should not be equal to the condition value

iii/ gt: Means the field value should be greater than the condition value

iv/ gte: Means the field value should be greater than or equal to the condition value

v/ contains: Means the field value should contain the condition value

b3/ condition\_value: The condition value to run the rule against. Your rule evaluation is expected to be like ["data.field"] ["rule.condition"] ["rule.condition\_value"]

c/ The data field can be any of:

c1/ A valid JSON object

c2/ A valid array

c3/ A string

d/ If a required field isn't passed. Your endpoint should return with a response (HTTP 400 status code) that is similar to the below:


```
JSON
{

"message": "[field] is required."

"status": "error",

"data": null

}
```
E.g. if the rule field is not passed, your endpoint response should be:

```
JSON

{

"message": "rule is required."

"status": "error",

"data": null

}
```
e/ If a field is of the wrong type, your endpoint should return with a response (HTTP 400 status code) that is similar to the below:

```
JSON
{

"message": "[field] should be a|an [type]."

"status": "error",

"data": null

}
```

E.g. if the rule field is passed as a number instead of a valid object, your endpoint response should be:

```
JSON
{

"message": "rule should be an object."

"status": "error",

"data": null

}

```

f/ If an invalid JSON payload is passed to your API, your endpoint response (HTTP 400 status code) should be:
```
{

"message": "Invalid JSON payload passed."

"status": "error",

"data": null

}
```
[PS: For the error responses described above, please note that the punctuation is important. I.e the period at the end of each error message.]

g/ If the field specified in the rule object is missing from the data passed, your endpoint response (HTTP 400 status code) should be:

```
JSON

{

"message": "field [name of field] is missing from data."

"status": "error",

"data": null

}

```
e.g.

```
JSON
{

"message": "field age is missing from data."

"status": "error",

"data": null

}
```
h/ If the rule is successfully validated, your endpoint response (HTTP 200 status code) should be:

```
JSON

{

"message": "field [name of field] successfully validated."

"status": "success",

"data": {

"validation": {

"error": false,

"field": "[name of field]",

"field_value": [value of field],

"condition": "[rule condition]",

"condition_value: [condition value]

}

}

}
```

e.g.

```
JSON

{

"message": "field missions successfully validated."

"status": "success",

"data": {

"validation": {

"error": false,

"field": "missions",

"field_value": 30,

"condition": "gte",

"condition_value: 30

}

}

}
```

i/ If the rule validation fails, your endpoint response (HTTP 400 status code) should be:

```

{

"message": "field [name of field] failed validation."

"status": "error",

"data": {

"validation": {

"error": false,

"field": "[name of field]",

"field_value": [value of field],

"condition": "[rule condition]",

"condition_value: [condition value]

}


}

}

```

```

{

"message": "field missions failed validation."

"status": "error",

"data": {

"validation": {

"error": true,

"field": "missions",

"field_value": 30,

"condition": "gte",

"condition_value: 54

}

}

}
```


Example JSON request payloads:

= EX1 =

```
{
"rule": {

"field": "missions",

"condition": "gte",

"condition\value": 30
},

"data": {
"name": "James Holden",
"crew": "Rocinante",
"age": 34,
"position": "Captain",
"missions": 45
}
}

```

```

Response: (HTTP 200)

{
"message": "field missions successfully validated."
"status": "success",
"data": {
"validation": {
"error": false,
"field": "missions",
"field_value": 45,
"condition": "gte",
"condition_value: 30
}
}
}
```

= EX2 =

```

{
"rule": {
"field": "0",
"condition": "eq",
"condition_value": "a"
},
"data": "damien-marley"
}
```

```

Response: (HTTP 400)

{
"message": "field 0 failed validation."
"status": "error",
"data": {
"validation": {
"error": true,
"field": "0",
"field_value": "d",
"condition": "eq",
"condition_value: "a"
}
}
}
```

= EX3 =

```
{
"rule": {
"field": "5",
"condition": "contains",
"condition_value": "rocinante"
},
"data": ["The Nauvoo", "The Razorback", "The Roci", "Tycho"]
}
```

```
Response: (HTTP 400)

{
"message": "field 5 is missing from data.",
"status": "error",
"data": null
}

```









