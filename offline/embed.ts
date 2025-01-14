import path from 'path'
import { fileURLToPath } from 'url'
import { promises as fs } from 'fs'
import 'dotenv/config'

import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Generate embeddings for an array of plots using text-embedding-3-small.
 * Save the embeddings to a JSON file using the saveToJSON utility function.
 */

// Pinecone stuff - Not used in step 1
const generateIndex = async () => {
    const indexName = 'quickstart'
    await pc.createIndex({
        name: indexName,
        dimension: 2, // Replace with your model dimensions
        metric: 'cosine', // Replace with your model metric
        spec: {
            serverless: {
                cloud: 'aws',
                region: 'us-east-1',
            },
        },
    })
}

const sampleText = [
    "In a world where toys come to life when humans aren't looking, Woody, a cowboy doll, feels threatened when Buzz Lightyear, a space ranger action figure, becomes Andy's new favorite toy. After a series of mishaps—including getting stranded, captured by a mischievous neighbor, and narrowly escaping danger—Woody and Buzz overcome their rivalry, becoming friends and returning to Andy just in time for the family's move, only to face a new challenge: a puppy.",
    'In a world where toys secretly come to life, a cherished toy feels replaced when a high-tech newcomer becomes the favorite. After a series of adventures, including getting stranded, captured, and narrowly escaping danger, the two rivals put aside their differences, return to their owner just in time for a big move, and prepare to face their next challenge: a new pet.',
    'In a world where secret lives unfold unnoticed, a group faces unexpected challenges when a new arrival disrupts their harmony. Through trials, rivalries, and a daring escape, bonds are tested, leading to a renewed understanding just in time for a fresh start.',
]

const generateEmbeddings = async ({ token, model, input }): Promise<void> => {
    console.log('input:', input)
    const response = await fetch('https://api.openai.com/v1/embeddings', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        method: 'POST',
        body: JSON.stringify({ input, model }),
    })
    console.log('Response:', response)

    const { error, data, usage } = await response.json()

    console.log('data:', data)
    return data
}

const saveToJSON = async <T>(filename: string, data: T): Promise<void> => {
    const filePath = path.resolve(__dirname, filename)
    try {
        const jsonData = JSON.stringify(data, null, 2)
        await fs.writeFile(filePath, jsonData, 'utf-8')
        console.log(`Data saved to ${filePath}`)
    } catch (error) {
        console.error(`Failed to save data to ${filePath}:`, error)
    }
}

const vector = await generateEmbeddings({
    token: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small',
    input: sampleText,
})

// console.log('Vector:', vector)
saveToJSON('sample_embeddings.json', vector)
