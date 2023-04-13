migrate((db) => {
  const collection = new Collection({
    "id": "93wsk3ysta71vgi",
    "created": "2023-04-04 18:53:35.720Z",
    "updated": "2023-04-04 18:53:35.720Z",
    "name": "badges",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "oieaih8o",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "kaq4vmax",
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
        "id": "ft9awebb",
        "name": "iconId",
        "type": "number",
        "required": true,
        "unique": true,
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
  const collection = dao.findCollectionByNameOrId("93wsk3ysta71vgi");

  return dao.deleteCollection(collection);
})
