migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9fcpux9n39qdpdf")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9fcpux9n39qdpdf")

  // remove
  collection.schema.removeField("eo210vve")

  return dao.saveCollection(collection)
})
