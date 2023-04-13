migrate((db) => {
  const collection = new Collection({
    "id": "bx274g49dakhd7c",
    "created": "2023-04-04 18:50:38.586Z",
    "updated": "2023-04-04 18:50:38.586Z",
    "name": "friends",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "25gb86oi",
        "name": "player1",
        "type": "relation",
        "required": false,
        "unique": false,
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
        "id": "iyrevq7j",
        "name": "player2",
        "type": "relation",
        "required": false,
        "unique": false,
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
        "id": "neisicvw",
        "name": "status",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "blocked",
            "pending",
            "success",
            "muted"
          ]
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
  const collection = dao.findCollectionByNameOrId("bx274g49dakhd7c");

  return dao.deleteCollection(collection);
})
