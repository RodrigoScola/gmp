migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("57j89imxsl1vzd1")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "w7zpez8h",
    "name": "scoring",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("57j89imxsl1vzd1")

  // remove
  collection.schema.removeField("w7zpez8h")

  return dao.saveCollection(collection)
})
