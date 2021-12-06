// Download: https://www.arangodb.com/download-major/
// Docs: https://arangodb.github.io/arangojs/7.6.1/index.html

// Import ArangoJS and initialise
import { Database, aql } from "arangojs";
const db = new Database({ auth: { username: "root", password: "gay" } });

// Delete possibly previous data
async function main(testing) {
    const result = await db.query(aql`
        INSERT { value: 1 } INTO ${testing}
    `);
    console.log(result);
}

(async () => {
    try {
        await db.dropDatabase('performanceTest');
    } catch (err) {}
    await db.createDatabase('performanceTest');
    db.useDatabase('performanceTest');
    const testing = db.createCollection('testing');

    await main(testing);
})();
