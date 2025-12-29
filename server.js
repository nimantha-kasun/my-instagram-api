const express = require('express');
const { insta } = require('insta-package');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/info', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ status: 'error', message: 'No URL provided' });

    try {
        const result = await insta(url);
        // Robust check for results
        if (!result || (Array.isArray(result) && result.length === 0)) {
            throw new Error('No media found for this URL.');
        }
        res.json({ status: 'success', result: result });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

app.listen(port, () => console.log(`Instagram API running on port ${port}`));
