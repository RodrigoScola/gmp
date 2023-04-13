migrate((db) => {
  const collection = new Collection({
    "id": "056hcmisaozqa0c",
    "created": "2023-04-04 18:57:39.683Z",
    "updated": "2023-04-04 18:57:39.683Z",
    "name": "game",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vzvg1v4e",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "cbgk9bcx",
        "name": "description",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "3qfog0fa",
        "name": "iconId",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("056hcmisaozqa0c");

  return dao.deleteCollection(collection);
})
