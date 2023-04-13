migrate((db) => {
  const collection = new Collection({
    "id": "57j89imxsl1vzd1",
    "created": "2023-04-04 18:53:45.524Z",
    "updated": "2023-04-04 18:53:45.524Z",
    "name": "profiles",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "6u1hjkro",
        "name": "user",
        "type": "relation",
        "required": false,
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
        "id": "durk5wcm",
        "name": "games",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "hd8itsw0",
        "name": "friends",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "iwbrygn6",
        "name": "badges",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "93wsk3ysta71vgi",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
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
  const collection = dao.findCollectionByNameOrId("57j89imxsl1vzd1");

  return dao.deleteCollection(collection);
})
