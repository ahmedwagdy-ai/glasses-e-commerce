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
    // Handle Color Images
    if (req.body.colors) {
        let colors = [];
        try {
            // If colors is already an object (parsed by bodyParser), use it, otherwise parse string
            colors = typeof req.body.colors === 'string' ? JSON.parse(req.body.colors) : req.body.colors;
        } catch (error) {
            // If parsing fails, ignore (validation will catch it)
        }

        if (Array.isArray(colors) && req.files && req.files.colorImages) {
            req.files.colorImages.forEach((file, index) => {
                if (colors[index]) {
                    colors[index].image = {
                        url: file.path,
                        public_id: file.filename,
                    };
                }
            });
        }
        req.body.colors = colors;
    }
    next();
};

module.exports = { parseFile, parseFiles, processMixedFiles };
