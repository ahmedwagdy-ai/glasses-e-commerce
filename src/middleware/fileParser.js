// Middleware to map multer req.file/req.files to req.body for Validation & Service layers

const parseFile = (fieldName) => (req, res, next) => {
    if (req.file) {
        req.body[fieldName] = {
            url: req.file.path,
            public_id: req.file.filename,
        };
    }
    next();
};

const parseFiles = (fieldName) => (req, res, next) => {
    if (req.files && Array.isArray(req.files)) {
        req.body[fieldName] = req.files.map((file) => ({
            url: file.path,
            public_id: file.filename,
        }));
    }
    next();
};

const processMixedFiles = (req, res, next) => {
    console.log('--- processMixedFiles Debug ---');
    console.log('Raw req.body:', JSON.stringify(req.body, null, 2));

    // Handle Description (if sent as stringified JSON in form-data)
    if (req.body.description) {
        console.log('Processing description:', req.body.description);
        try {
            req.body.description = typeof req.body.description === 'string' ? JSON.parse(req.body.description) : req.body.description;
            console.log('Parsed description:', req.body.description);
        } catch (error) {
            console.log('Name is not JSON, keeping as string (valid for legacy/simple description)');
            // Ignore error, keep as string
        }
    }

    // Handle Name (if sent as stringified JSON in form-data for bilingual support)
    if (req.body.name) {
        console.log('Processing name:', req.body.name);
        try {
            req.body.name = typeof req.body.name === 'string' ? JSON.parse(req.body.name) : req.body.name;
            console.log('Parsed name:', req.body.name);
        } catch (error) {
            console.log('Name is not JSON, keeping as string (valid for Products)');
            // Ignore error, keep as string
        }
    }

    // Handle Color Images 'colors' field (already existing logic)
    if (req.body.colors) {
        let colors = [];
        try {
            // If colors is already an object (parsed by bodyParser), use it, otherwise parse string
            colors = typeof req.body.colors === 'string' ? JSON.parse(req.body.colors) : req.body.colors;
        } catch (error) {
            // If parsing fails, ignore (validation will catch it)
        }

        if (Array.isArray(colors) && req.files && req.files.colorImages) {
            const allFiles = req.files.colorImages;
            colors.forEach((color, index) => {
                color.images = color.images || []; // Initialize or keep existing

                // If explicit indices are provided (e.g., [0, 2] for this color)
                if (color.imageIndexes && Array.isArray(color.imageIndexes)) {
                    color.imageIndexes.forEach(fileIndex => {
                        const file = allFiles[fileIndex];
                        if (file) {
                            color.images.push({
                                url: file.path,
                                public_id: file.filename,
                            });
                        }
                    });
                    delete color.imageIndexes; // Cleanup
                } else {
                    // Fallback: 1-to-1 mapping (Legacy behavior)
                    const file = allFiles[index];
                    if (file) {
                        color.images.push({
                            url: file.path,
                            public_id: file.filename,
                        });
                    }
                }
            });
        }
        req.body.colors = colors;
    }
    next();
};

module.exports = { parseFile, parseFiles, processMixedFiles };
