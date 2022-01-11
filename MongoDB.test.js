const path = require('path');
const { Kubiks: { Config, Log } } = require('rubik-main');
const { createApp } = require('rubik-main/tests/helpers/creators.js');
const { Collection, Db } = require('mongodb');

const runMongoTestServer = require('./runMongoTestServer.js');
const MongoDB = require('./');

const create = (connectionString, ...args) => {
	const app = createApp();
	app.add([
		new Config(path.join(__dirname, './default/')),
		new Log(),
		new MongoDB(...args)
	]);
	app.config.get('storage').url = connectionString;
	return app;
};

const prepare = () => {
	let mongod, connectionString;
	const up = async () => {
		const res = await runMongoTestServer();
		mongod = res.mongod;
		connectionString = res.connectionString;
	};
	const down = async () => {
		await mongod.stop();
	};
	const url = () => connectionString;

	return { up, down, url };
};

describe('MongoDB kubik', () => {
	const { up, down, url } = prepare();

	beforeAll(up);

	test('creates', () => {
		const kubik = new MongoDB();
		expect(kubik.name).toBe('storage');
	});

	test('ups and downs', async () => {
		const app = create(url());
		await app.up();
		expect(app.storage).toBeInstanceOf(MongoDB);
		await app.down();
	});

	test('creates collections\' getters', async () => {
		const app = create(url(), ['User', 'Roles']);
		await app.up();
		expect(app.storage.User).toBeInstanceOf(Collection);
		expect(app.storage.Roles).toBeInstanceOf(Collection);
		await app.down();
	});

	test('runs creates and queries', async () => {
		const app = create(url(), ['User']);
		await app.up();
		const { User } = app.storage;
		const testUser = {
			login: 'admin',
			password: 'admin'
		};
		const result = await User.insertOne(testUser);
		const user = await User.findOne({ _id: result.insertedId });
		expect({
			_id: result.insertedId,
			...testUser
		}).toEqual(user);
		await app.down();
	});

	test('provides access to db', async () => {
		const app = create(url(), ['User']);
		await app.up();
		expect(app.storage.db).toBeInstanceOf(Db);
		await app.down();
	});

	afterAll(down);
});
