const { Kubik } = require('rubik-main');
const { MongoClient } = require('mongodb');

/**
 * MongoDB Kubik
 * @prop {MongoClient} client
 * @param {Array<String>} names — an array of names for getters of collections
 */
class MongoDB extends Kubik {
	constructor(names = []) {
		super(...arguments);
		this.client = null;
		this.createCollectionsGetters(names);
	}

	/**
	 * Create getters for specific names
	 * @param {Array<String>} names — an array of names for getters of collections
	 */
	createCollectionsGetters(names) {
		names.forEach(this.createCollectionGetter, this);
	}

	/**
	 * Create getter for a specific collection name
	 * @param {String} name — a string name for getter of collection
	 */
	createCollectionGetter(name) {
		Object.defineProperty(this, name, {
			get: () => this.db?.collection(name)
		});
	}

	async up({ config, log }) {
		Object.assign(this, { config, log });

		const options = this.config.get(this.name);

		await this.processHooksAsync('beforeUp');
		this.createCollectionsGetters(options.collections);
		await this.connect(options.url, options.options);
	}

	async down() {
		await this.processHooksAsync('beforeDown');
		await this.diconnect();
	}

	get db() {
		return this.client?.db(this.config?.get(this.name).db);
	}

	/**
	 * Connect to a mongodb instance
	 * @async
	 * @param  {String} url — connection url
	 * @param  {Object} options — options for connection
	 */
	async connect(url, options) {
		this.client = new MongoClient(url, options);
		await this.client.connect();
	}

	/**
	 * @async
	 * Disconnect from the instance
	 */
	async diconnect() {
		await this.client.close();
		this.client = null;
	}
}

MongoDB.prototype.name = 'storage';
MongoDB.prototype.dependencies = Object.freeze(['config', 'log']);
module.exports = MongoDB;
