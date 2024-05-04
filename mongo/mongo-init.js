db = db.getSiblingDB('waymore')

db.createUser({
  user: 'waymore',
  pwd: 'password',
  roles: [{ role: 'readWrite', db: 'waymore' }],
})

db.createCollection('users')
