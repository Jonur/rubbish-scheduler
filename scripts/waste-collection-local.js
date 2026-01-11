require('dotenv').config();

const runWasteCollectionSync = require('../src/lib/runWasteCollectionSync');

(async () => {
  const result = await runWasteCollectionSync();
  console.log('✅ All events created!', result);
})().catch((err) => {
  console.error('❌ Run failed:', err);
  process.exitCode = 1;
});
