migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9fcpux9n39qdpdf");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "9fcpux9n39qdpdf",
    "created": "2023-04-03 17:59:30.960Z",
    "updated": "2023-04-03 18:04:12.259Z",
    "name": "profile",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "m88tphca",
        "name": "user",
        "type": "relation",
        "required": true,
        "unique": true,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "eo210vve",
        "name": "userId",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
