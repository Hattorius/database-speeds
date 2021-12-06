// Download: https://www.arangodb.com/download-major/
// Docs: https://arangodb.github.io/arangojs/7.6.1/index.html
// Isn't that bad except if you have to debug, the error messages are 100+ lines and don't show on which line your error is.

// Import ArangoJS and initialise
import { Database, aql } from "arangojs";
const db = new Database({ auth: { username: "root", password: "gay" } });

// Delete possibly previous data
async function reset() {
    try {
        await db.collection('testing').drop();
        await db.createCollection('testing');
    } catch (err) {}
    const testing = db.collection('testing');
    return testing;
    // db.createCollection('testing');
    // console.log('dab');
    // return db.collection('testing');
}

async function add10000OneByOne(testing) {
    for (var i = 0; i < 10000; i++) {
        await testing.save({ count: i });
    }
}

async function add10000AtOnce(testing, data) {
    await testing.import(data);
}

async function update10000Times(testing) {
    for (var i = 1; i <= 10000; i++) {
        await testing.update("test", { count: i });
    }
}

async function main() {
    try {
        await db.createDatabase('performanceTest');
    } catch (err) {}
    db.database('performanceTest');
    var results = {};

    var testing = await reset();
    var start = Date.now();
    await add10000OneByOne(testing);
    results['add10000OneByOne'] = Date.now() - start;

    testing = await reset();
    var data = [];
    for (var i = 0; i < 10000; i++) {
        data.push({value: i});
    }
    start = Date.now();
    await add10000AtOnce(testing, data);
    results['add10000AtOnce'] = Date.now() - start;

    testing = await reset();
    await testing.save({ _key: "test", count: 0 });
    start = Date.now();
    await update10000Times(testing);
    results['update10000Times'] = Date.now() - start;


    return results
}

(async ()  => {
    var runs = 10;
    var allResults = {};
    for (var i = 0; i < runs; i++) {
        const result = await main();
        for (var name in result) {
            if (typeof allResults[name] !== 'undefined') {
                allResults[name] += result[name];
            } else {
                allResults[name] = result[name];
            }
        }
    }
    for (var name in allResults) {
        allResults[name] = allResults[name] / runs;
    }
    console.log(allResults);
    /*
     * Add 10.000 one by one: 2589.8 ms
     * Add 10.000 at once: 108.7 ms
     * Update 10.000 times: 2882.6 ms
     */
})();
