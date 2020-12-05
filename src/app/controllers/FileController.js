import sharp from 'sharp';
import { resolve } from 'path';
import fs from 'fs';
import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename, path: filePath } = req.file;

    await sharp(filePath)
      .resize({ width: 300, withoutEnlargement: true })
      .webp({ quality: 60 })
      .toFile(
        resolve(__dirname, '../', '../', '../', 'tmp', 'uploads', filename)
      );

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
