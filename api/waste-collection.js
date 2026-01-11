const assertCronAuth = require('../src/lib/assertCronAuth');
const runWasteCollectionSync = require('../src/lib/runWasteCollectionSync');

module.exports = async (req, res) => {
  try {
    assertCronAuth(req);
    await runWasteCollectionSync();
    res.status(200).send('All events created!');
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).send(error.message || 'Internal error');
  }
};
