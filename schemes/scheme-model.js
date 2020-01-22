const knex = require("knex");

const config = require("../knexfile.js");

const db = knex(config.development);

module.exports = { find, findById, findSteps, add, update, remove, addStep };

// -   `find()`:
//     -   Calling find returns a promise that resolves to an array of all schemes in the database.
//     -   No steps are included.
function find() {
  return db("schemes");
}

// -   `findById(id)`:
//     -   Expects a scheme `id` as its only parameter.
//     -   Resolve to a single scheme object.
//     -   On an invalid `id`, resolves to `null`.
function findById(id) {
  return db("schemes").where({ id });
}

// -   `findSteps(id)`:
//     -   Expects a scheme `id`.
//     -   Resolves to an array of all correctly ordered step for the given
// scheme: `[ { id: 17, scheme_name: 'Find the Holy Grail',
// step_number: 1, instructions: 'quest'}, { id: 18, scheme_name:
// 'Find the Holy Grail', step_number: 2, instructions: '...and quest'}, etc. ]`.
//     -   This array should include the `scheme_name` _not_ the `scheme_id`.
function findSteps(id) {
  return db("steps")
    .join("schemes", "steps.scheme_id", "schemes.id")
    .select(["steps.id", "scheme_name", "step_number", "instructions"])
    .where({ "steps.id": id });
}

// -   `add(scheme)`:
//     -   Expects a scheme object.
//     -   Inserts scheme into the database.
//     -   Resolves to the newly inserted scheme, including `id`.
function add(scheme) {
  return db("schemes")
    .insert(scheme)
    .returning("*");
}

// -   `update(changes, id)`:
//     -   Expects a changes object and an `id`.
//     -   Updates the scheme with the given id.
//     -   Resolves to the newly updated scheme object.
function update(changes, id) {
  return db("schemes")
    .where({ id })
    .update(changes)
    .returning("*");
}

// -   `remove(id)`:
//     -   Removes the scheme object with the provided id.
//     -   Resolves to the removed scheme
//     -   Resolves to `null` on an invalid id.
//     -   (Hint: Only worry about removing the `scheme`. The database is configured to automatically remove all associated steps.)
function remove(id) {
  return db("schemes")
    .where({ id })
    .del();
}

// - Add the following method to your API
//   - `addStep(step, scheme_id)`: This method expects a step object and a scheme id.
//  It inserts the new step into the database, correctly linking it to the intended scheme.
//   - You may use `POST /api/schemes/:id/addStep` to test this method.
function addStep(step, scheme_id) {
  step.scheme_id = scheme_id;
  return db("steps")
    .insert(step)
    .returning("*");
}
