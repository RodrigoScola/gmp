migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("57j89imxsl1vzd1")

  // remove
  collection.schema.removeField("hd8itsw0")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("57j89imxsl1vzd1")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
