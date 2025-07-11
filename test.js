const express = require('express');
const router = express.Router();
const ControlStatus = require('./controlstatus');


const SINGLE_STATUS_ID = '6863bbaa58c32fc9e452abc7';

// Ensure single status document exists
async function getStatusDoc() {
  let doc = await ControlStatus.findById(SINGLE_STATUS_ID);
  if (!doc) {
    doc = new ControlStatus({
      _id: new mongoose.Types.ObjectId(SINGLE_STATUS_ID),
      action: 'stop',
      codeStatus: 'Code Not Started'
    });
    await doc.save();
  }
  return doc;
}

router.get('/action', async (req, res) => {
  const doc = await getStatusDoc();
  return res.status(200).json({ action: doc.action });
});

router.get('/start', async (req, res) => {
  const doc = await getStatusDoc();
  doc.action = 'start';
  await doc.save();
  return res.status(200).json({ message: 'success' });
});

router.get('/stop', async (req, res) => {
  const doc = await getStatusDoc();
  doc.action = 'stop';
  await doc.save();
  return res.status(200).json({ message: 'success' });
});

router.get('/status', async (req, res) => {
  const doc = await getStatusDoc();
  return res.status(200).json({ status: doc.codeStatus });
});

router.post('/send-status', async (req, res) => {
  const { status } = req.body;
  const doc = await getStatusDoc();
  doc.codeStatus = status;
  await doc.save();
  console.log(`Status: ${doc.codeStatus}`);
  return res.status(200).json({ message: 'success' });
});

module.exports = router;
