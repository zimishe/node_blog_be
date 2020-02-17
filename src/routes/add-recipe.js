const uuidv1 = require('uuid/v1');
const { dbName } = require('./../_config/db');

module.exports = (app, client) => {
    app.post('/recipes', (req, res) => {
        const dateAdded = new Date().toISOString();
        const recipe = { ...req.body, dateAdded, id: uuidv1() };

        const db = client.db(dbName);

        db.collection('recipes').insert(recipe, (error, result) => {
            if (error) {
                res.send({ error });
            }   else {
                res.send(result.ops[0]);
            }
        });
    })
}
