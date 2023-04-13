migrate((db) => {
  const collection = new Collection({
    "id": "s3ltner5epx0gkn",
    "created": "2023-04-04 18:58:37.864Z",
    "updated": "2023-04-04 18:58:37.864Z",
    "name": "games",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "hsp0tp2v",
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
        "id": "busnuokz",
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
        "id": "hzhd0s6d",
        "name": "winner",
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
        "id": "cdiqk9yx",
        "name": "game",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "056hcmisaozqa0c",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "le3auayw",
        "name": "score",
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
        "id": "ubftxgk2",
        "name": "moves",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("s3ltner5epx0gkn");

  return dao.deleteCollection(collection);
})
