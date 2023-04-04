migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "e0cztmh9",
    "name": "profileId",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "9fcpux9n39qdpdf",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // remove
  collection.schema.removeField("e0cztmh9")

  return dao.saveCollection(collection)
})
