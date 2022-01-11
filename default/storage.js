module.exports = {
	url: 'mongodb://localhost:27017',
	db: 'test',
	collections: [],
	options: {
		minPoolSize: 5,
		maxPoolSize: 20,
		keepAlive: true
		// you could read a full list of available options at https://mongodb.github.io/node-mongodb-native/4.3/interfaces/MongoClientOptions.html
	}
};
