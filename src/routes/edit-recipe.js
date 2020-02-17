const { dbName } = require('./../_config/db');

module.exports = (app, client) => {
    app.put('/recipes/:id', async (req, mainResult) => {
        const id = req.params.id;
        const details = { id };
        
        const recipe = { ...req.body };

        const db = client.db(dbName);

        db.collection('recipes').findOne(details, (error, result) => {
            if (error) {
                mainResult.send(error);
            }   else {
                const { _id, dateAdded, ...rest } = result;
                
                updateRecipe(db, result, mainResult, {...result, ...recipe});
                moveRecipeToHistory(db, mainResult, {...rest, dateEdited: new Date().toISOString()});
            }
        });
    })
}

function updateRecipe(db, details, mainResult, recipe) {
    db.collection('recipes').update(details, recipe, (error, result) => {
        if (error) {
            mainResult.send({ error });
        }   else {
            mainResult.send(recipe);
        }
    });
}

function moveRecipeToHistory(db, mainResult, recipe) {
    db.collection('history').insert(recipe, (error, result) => {
        if (error) { mainResult.send({ error }); }
    });
}
