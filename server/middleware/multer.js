import multer from 'multer';

const storage = multer.memoryStorage(); // Store files in memorys
const upload = multer({ storage: storage });

export default upload