import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Use a local directory outside of public/ to ensure files are not blindly exposed
const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'uploads');

export const StorageService = {
  /**
   * Saves a file to the local storage adapter.
   * @param buffer File binary data
   * @param category Media category
   * @param schoolId The school ID for isolation
   * @param originalName The original file name
   * @returns Storage metadata
   */
  async uploadFile(
    buffer: Buffer,
    category: string,
    schoolId: string,
    originalName: string
  ): Promise<{ storageName: string; provider: string }> {
    const ext = path.extname(originalName) || '.bin';
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const storageName = `${category.toLowerCase()}_${schoolId}_${uniqueId}${ext}`;

    // Ensure directory exists
    const categoryPath = path.join(STORAGE_ROOT, category.toLowerCase(), schoolId);
    await fs.mkdir(categoryPath, { recursive: true });

    const filePath = path.join(categoryPath, storageName);
    
    // Write the file
    await fs.writeFile(filePath, buffer);

    return {
      storageName,
      provider: 'LOCAL'
    };
  },

  /**
   * Deletes a file from local storage.
   */
  async deleteFile(category: string, schoolId: string, storageName: string): Promise<void> {
    const categoryPath = path.join(STORAGE_ROOT, category.toLowerCase(), schoolId);
    const filePath = path.join(categoryPath, storageName);

    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // If file doesn't exist, we consider it deleted
    }
  },

  /**
   * Reads a file for serving securely via API.
   */
  async getFileBuffer(category: string, schoolId: string, storageName: string): Promise<Buffer> {
    const filePath = path.join(STORAGE_ROOT, category.toLowerCase(), schoolId, storageName);
    return await fs.readFile(filePath);
  }
};
