# rubik-mongodb
Small kubik for native mongodb driver connections.
Useful in small scripts or services.

# Configuration
```js
module.exports = {
	url: 'mongodb://localhost:27017', // connection url
	db: 'test', // database name
	collections: [], // names of connected collections, it's just aliases. Every name will be converted into a property with the same name
	options: { // connnection options
		minPoolSize: 5,
		maxPoolSize: 20,
		keepAlive: true
		// you could read a full list of available options at https://mongodb.github.io/node-mongodb-native/4.3/interfaces/MongoClientOptions.html
	}
};

```

## constructor(names)
`names` is an array of strings — collection names.
```js
const storage = new MongoDB(['Users', 'Roles']);
app.add(storage);

await app.up();

const users = storage.Users.find();
const roles = storage.Roles.find();
```
It's not necessary, you can access every collection throught db ↓

## instance.db
Returns an instance of the connected db.
See [documentation here](https://mongodb.github.io/node-mongodb-native/4.3/classes/Db.html)
