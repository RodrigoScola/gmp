migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.options = {
    "allowEmailAuth": true,
    "allowOAuth2Auth": true,
    "allowUsernameAuth": true,
    "exceptEmailDomains": null,
    "manageRule": "@request.auth.id = '' ",
    "minPasswordLength": 8,
    "onlyEmailDomains": null,
    "requireEmail": false
  }

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.options = {
    "allowEmailAuth": true,
    "allowOAuth2Auth": true,
    "allowUsernameAuth": true,
    "exceptEmailDomains": null,
    "manageRule": "@request.auth.id = '' || @request.auth.id != ''",
    "minPasswordLength": 8,
    "onlyEmailDomains": null,
    "requireEmail": false
  }

  return dao.saveCollection(collection)
})
