## Create beautiful REST API docs authored in Markdown

---

#### Listing courses for instructor

<details>
 <summary> ▶️ <code>GET</code> <code><b>/courses</b></code> <code>(gets all courses for instructor)</code></summary>

##### Parameters

> None

##### Responses

> | http code | content-type       | response       |
> | --------- | ------------------ | -------------- |
> | `200`     | `application/json` | `Sample below` |

##### Sample response body format:

```json
[
  {
    "id": "53dfb5ef-9510-45d5-ac6a-589bb97a5984",
    "code": "ITCC240",
    "name": "Cloud Fundamentals"
  },
  {
    "id": "c862faa2-367c-464e-82e4-bc10f794a130",
    "code": "ITCC333",
    "name": "Cloud Operations"
  }
]
```

</details>

---

#### Creating a new course for instructor

<details>
 <summary> ▶️ <code>POST</code> <code><b>/courses</b></code> <code>(Creates a new course for instructor)</code></summary>

##### Parameters

> | name | type     | data type | description            |
> | ---- | -------- | --------- | ---------------------- |
> | code | required | string    | the code of the course |
> | name | required | string    | the name of the course |

##### Sample request body format:

```json
{
  "code": "ITCS240",
  "name": "Cloud Fundamentals"
}
```

##### Responses

> | http code | content-type       | response       |
> | --------- | ------------------ | -------------- |
> | `201`     | `application/json` | `Sample below` |

##### Sample response body format:

```json
{
  "id": "53dfb5ef-9510-45d5-ac6a-589bb97a5984",
  "code": "ITCS240",
  "name": "Cloud Fundamentals"
}
```

</details>

---

#### generating Mcq questions

<details>
 <summary> ▶️ <code>POST</code> <code><b>/mcq</b></code> <code>(generates a new mcq question)</code></summary>

##### Parameters

> | name      | type     | data type     | description          |
> | --------- | -------- | ------------- | -------------------- |
> | course_id | required | string        | the ID of the course |
> | materials | required | array[string] | list of materials    |

##### Sample request body format:

```json
{
  "course_id": "4b48fb83-d55b-4b47-b2d5-4b2c2cc5853a",
  "materials": [
    "Module 10 -  Automating Your Architecture.pdf",
    "Module 11 -  Caching Content.pdf"
  ]
}
```

##### Responses

> | http code | content-type       | response       |
> | --------- | ------------------ | -------------- |
> | `201`     | `application/json` | `Sample below` |

##### Sample response body format:

```json
{
  "question": "Which of the following caching strategies is best suited for data that is read often but written infrequently?",
  "choices": ["Amazon RDS", "DynamoDB", "MySQL", "Aurora"],
  "answer_index": 1
}
```

</details>

---

#### generating true or false questions

<details>
 <summary> ▶️ <code>POST</code> <code><b>/tf</b></code> <code>(generates a new true or false question)</code></summary>

##### Parameters

> | name      | type     | data type     | description          |
> | --------- | -------- | ------------- | -------------------- |
> | course_id | required | string        | the ID of the course |
> | materials | required | array[string] | list of materials    |

##### Sample request body format:

```json
{
  "course_id": "4b48fb83-d55b-4b47-b2d5-4b2c2cc5853a",
  "materials": [
    "Module 10 -  Automating Your Architecture.pdf",
    "Module 11 -  Caching Content.pdf"
  ]
}
```

##### Responses

> | http code | content-type       | response       |
> | --------- | ------------------ | -------------- |
> | `201`     | `application/json` | `Sample below` |

##### Sample response body format:

```json
{
  "question": "If a versioned object is deleted, then it can still be recovered by retrieving the final version.",
  "answer": true
}
```

</details>

---

#### generating fill in the blank questions

<details>
 <summary> ▶️ <code>POST</code> <code><b>/fib</b></code> <code>(generates a new fill in the blank question)</code></summary>

##### Parameters

> | name      | type     | data type     | description          |
> | --------- | -------- | ------------- | -------------------- |
> | course_id | required | string        | the ID of the course |
> | materials | required | array[string] | list of materials    |

##### Sample request body format:

```json
{
  "course_id": "4b48fb83-d55b-4b47-b2d5-4b2c2cc5853a",
  "materials": [
    "Module 10 -  Automating Your Architecture.pdf",
    "Module 11 -  Caching Content.pdf"
  ]
}
```

##### Responses

> | http code | content-type       | response       |
> | --------- | ------------------ | -------------- |
> | `201`     | `application/json` | `Sample below` |

##### Sample response body format:

```json
{
  "question": "Amazon S3 provides a low-cost solution for web hosting that includes _______________, scalability, and availability.",
  "answer": "high performance"
}
```

</details>

---
