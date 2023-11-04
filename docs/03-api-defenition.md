## Create beautiful REST API docs authored in Markdown

------------------------------------------------------------------------------------------

#### Listing courses for instructor 

<details>
 <summary> ▶️ <code>GET</code> <code><b>/courses</b></code> <code>(gets all courses for instructor)</code></summary>

##### Parameters

> None

##### Responses

> | http code       | content-type                        | response                                                              |
> | --------------- | ----------------------------------- | --------------------------------------------------------------------- |
> | `200`           | `application/json`                  |`Sample below`                                                        |

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

------------------------------------------------------------------------------------------

#### Creating a new course for instructor

<details>
 <summary> ▶️ <code>POST</code> <code><b>/courses</b></code> <code>(Creates a new course for instructor)</code></summary>

##### Parameters

> | name        | type        | data type      | description                                                             |
> | ----------- | ----------- | -------------- | ----------------------------------------------------------------------- |
> | code        | required    | string         | the code of the course                                                  |
> | name        | required    | string         | the name of the course                                                  |

##### Sample request body format:

```json
{
    "code": "ITCS240",
    "name": "Cloud Fundamentals"
}
```

##### Responses

> | http code       | content-type                        | response                                                              |
> | --------------- | ----------------------------------- | --------------------------------------------------------------------- |
> | `201`           | `application/json`                  | `Sample below`                                                        |


##### Sample request body format:

```json
{
    "id": "53dfb5ef-9510-45d5-ac6a-589bb97a5984",
    "code": "ITCS240",
    "name": "Cloud Fundamentals"
}
```

</details>

------------------------------------------------------------------------------------------
