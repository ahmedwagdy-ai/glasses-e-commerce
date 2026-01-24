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

        if (Array.isArray(colors) && req.files) {
            // New Logic: Check for field names like colorImages_0, colorImages_1
            // Use req.files array since we used upload.any()

            // Map files by fieldname for easier access if needed, or iterate
            req.files.forEach(file => {
                // Check if fieldname is colorImages_X
                const match = file.fieldname.match(/^colorImages_(\d+)$/);
                if (match) {
                    const index = parseInt(match[1], 10);
                    if (colors[index]) {
                        colors[index].images = colors[index].images || [];
                        colors[index].images.push({
                            url: file.path,
                            public_id: file.filename
                        });
                    }
                }
                // Legacy support or fallback: colorImages (array)
                else if (file.fieldname === 'colorImages') {
                    // We can't really map this without indexes unless we assume order or provided imageIndexes
                    // The previous logic for imageIndexes is still valid if user sends 'colorImages' field + 'imageIndexes' in JSON
                    // But here we focus on the new simple way.
                }
            });

            // Re-apply the explicit index logic just in case they mix methods (optional, but good for backward compat if we want to keep it)
            if (req.files.some(f => f.fieldname === 'colorImages')) {
                const allFiles = req.files.filter(f => f.fieldname === 'colorImages');
                colors.forEach((color, index) => {
                    color.images = color.images || [];
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
                        delete color.imageIndexes;
                    }
                });
            }
        }
        req.body.colors = colors;
    }
    next();
};

module.exports = { parseFile, parseFiles, processMixedFiles };
