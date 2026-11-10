const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/download', (req, res) => {
    const videoUrl = req.body.url;
    if (!videoUrl) {
        return res.status(400).json({ success: false, message: 'URL is required' });
    }

    const command = `yt-dlp --print filename -o "%(title)s.%(ext)s" "${videoUrl}"`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to process video' });
        }
        const title = stdout.trim();
        res.json({
            success: true,
            title: title,
            downloadHd: videoUrl,
            downloadAudio: videoUrl
        });
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));