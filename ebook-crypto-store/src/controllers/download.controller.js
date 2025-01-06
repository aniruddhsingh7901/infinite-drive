const path = require('path');
const DownloadService = require('../services/download.service');

exports.downloadBook = async (req, res) => {
    try {
        const { token } = req.params;
        
        // Validate download token
        const download = await DownloadService.validateDownloadToken(token);
        if (!download) {
            return res.status(401).json({ message: 'Invalid or expired download token' });
        }

        // Get file path
        const filePath = path.join(__dirname, '../private/books', download.file_path);
        
        // Send file
        res.download(filePath, `ebook.pdf`, async (err) => {
            if (err) {
                console.error('Download error:', err);
                return res.status(500).json({ message: 'Download failed' });
            }
            // Mark token as used after successful download
            await DownloadService.markTokenAsUsed(token);
        });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};