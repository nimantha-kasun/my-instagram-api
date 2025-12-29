const express = require('express');
const instagramGetUrl = require('instagram-url-direct');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/info', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ status: 'error', message: 'No URL provided' });

    try {
        // 🔧 FIX: Handle different library export styles
        const igFetch = (typeof instagramGetUrl === 'function') ? instagramGetUrl : instagramGetUrl.default;
        
        if (typeof igFetch !== 'function') {
            return res.status(500).json({ 
                status: 'error', 
                message: 'Library exported incorrectly. Try updating package.json.' 
            });
        }

        const result = await igFetch(url);
        res.json({ status: 'success', result: result });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

app.listen(port, () => console.log(`Instagram API running on port ${port}`));
