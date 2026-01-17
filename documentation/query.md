## Query Request Body (Generalized `QuerySpec`)

```json
{
  "where": {
    "and": [
      {
        "field": "<boolean_field>",
        "op": "eq",
        "value": <boolean>
      },
      {
        "or": [
          {
            "field": "<numeric_field_1>",
            "op": "gt",
            "value": <number>
          },
          {
            "field": "<numeric_field_2>",
            "op": "gt",
            "value": <number>
          }
        ]
      },
      {
        "field": "<id_or_enum_field>",
        "op": "in",
        "value": [
          "<value_1>",
          "<value_2>"
        ]
      }
    ]
  },
  "sort": [
    {
      "field": "<sortable_field_1>",
      "direction": "desc"
    },
    {
      "field": "<sortable_field_2>",
      "direction": "asc"
    }
  ],
  "limit": <page_size>,
  "offset": <offset>
}
