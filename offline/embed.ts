import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generate embeddings for an array of plots using text-embedding-3-small.
 * Save the embeddings to a JSON file using the saveToJSON utility function.
 */
const generateEmbeddings = async (plots: string[]): Promise<void> => {};

const saveToJSON = async <T>(filename: string, data: T): Promise<void> => {
  const filePath = path.resolve(__dirname, filename);

  try {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonData, 'utf-8');
    console.log(`Data saved to ${filePath}`);
  } catch (error) {
    console.error(`Failed to save data to ${filePath}:`, error);
  }
};

generateEmbeddings([
  "In a world where toys come to life when humans aren't looking, Woody, a cowboy doll, feels threatened when Buzz Lightyear, a space ranger action figure, becomes Andy's new favorite toy. After a series of mishaps—including getting stranded, captured by a mischievous neighbor, and narrowly escaping danger—Woody and Buzz overcome their rivalry, becoming friends and returning to Andy just in time for the family's move, only to face a new challenge: a puppy.",
  'In a world where toys secretly come to life, a cherished toy feels replaced when a high-tech newcomer becomes the favorite. After a series of adventures, including getting stranded, captured, and narrowly escaping danger, the two rivals put aside their differences, return to their owner just in time for a big move, and prepare to face their next challenge: a new pet.',
  'In a world where secret lives unfold unnoticed, a group faces unexpected challenges when a new arrival disrupts their harmony. Through trials, rivalries, and a daring escape, bonds are tested, leading to a renewed understanding just in time for a fresh start.',
]);
