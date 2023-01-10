print('Start #################################################################');

db = db.getSiblingDB('api_prod_db');
db.createUser(
  {
    user: 'root',
    pwd: '123456',
    roles: [{ role: 'readWrite', db: 'api_prod_db' }],
  },
);
db.createCollection('users');

db = db.getSiblingDB('api_dev_db');
db.createUser(
  {
    user: 'root',
    pwd: '123456',
    roles: [{ role: 'readWrite', db: 'api_dev_db' }],
  },
);
db.createCollection('users');

db = db.getSiblingDB('api_test_db');
db.createUser(
  {
    user: 'root',
    pwd: '123456',
    roles: [{ role: 'readWrite', db: 'api_test_db' }],
  },
);
db.createCollection('users');

print('END #################################################################');