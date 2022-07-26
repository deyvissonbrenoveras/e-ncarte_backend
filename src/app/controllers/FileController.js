import sharp from 'sharp';
import { resolve } from 'path';
import fs from 'fs';
import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename, path: filePath } = req.file;
    
    sharp.cache(false);
    var buffer = await sharp(filePath)
      .resize({ width: 600, withoutEnlargement: true })
      .webp({ quality: 70 })
      .toBuffer();
      
    sharp(buffer).toFile(resolve(__dirname, '../', '../', '../', 'tmp', 'tmpUploads', filename));

    fs.unlinkSync(filePath);
    const { id, url } = await File.create({ name, path: filename });
    return res.json({
      id,
      url,
      path: filename,
    });
  }
}

export default new FileController();
