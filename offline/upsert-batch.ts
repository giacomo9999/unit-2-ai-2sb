import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'
import { promises as fs } from 'fs'
import { parse } from 'csv-parse/sync'
import 'dotenv/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

type MovieMetadata = {
    id: string
    year: number
    title: string
    origin: string
    director: string
    cast: string
    genre: string
    wiki: string
    plot: string
}
interface OpenAIBatch {
    movies: MovieMetadata[]
    plots: MovieMetadata['plot'][]
}
interface EmbeddingData {
    movie: MovieMetadata
    embedding: OpenAI.Embedding['embedding']
}

import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

async function getCompletion(prompt: string) {
    const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt: prompt,
        max_tokens: 100,
    })
}

getCompletion('Tell me a joke.')

/**
 * Parse CSV data from a file using the `csv-parse` package.
 * Make sure the to infer column names from the first row of the CSV file.
 * Cast the `year` column to a number.
 */
const parseCsv = async (filename: string): Promise<MovieMetadata[] | null> => {
    const filePath = path.resolve(__dirname, filename)
    try {
        const data = await fs.readFile(filePath, {
            encoding: 'utf8',
        })
        const records = parse(data, {
            columns: true,
            skip_empty_lines: true,
        })

        return records
    } catch (err) {
        // console.log(err)
    }
}

const generateEmbeddings = async ({ token, model, input }): Promise<void> => {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        method: 'POST',
        body: JSON.stringify({ input, model }),
    })

    const { error, data, usage } = await response.json()

    return data
}
/**
 * Create batches of movie metadata and plots for OpenAI embeddings.
 * It's more efficient to embed multiple inputs in a single request, as explained in the docs: https://platform.openai.com/docs/api-reference/embeddings/create#embeddings-create-input
 * Limit the total number of words in each batch to `maxWords` and the number of elements to `maxElements` accordingly.
 */
const createOpenAIBatches = (
    movies: MovieMetadata[],
    maxWords = 5000,
    maxElements = 2048
): OpenAIBatch[] => {
    const token = process.env.OPENAI_API_KEY

    const requests = movies.map((movie) => {
        return {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            method: 'POST',
            url: 'https://api.openai.com/v1/chat/completions',
            data: {
                ...movie,
                // model: 'gpt-4o-mini',
            },
        }
    })

    async function sendBatchRequests(url: string, requests: []) {
        try {
            const responses = await Promise.all(
                requests.map((request) => {
                    return axios(request)
                })
            )
            return responses
        } catch (error) {
            console.error('Error sending batch requests:', error.code)
            throw error
        }
    }

    async function executeBatches(requests) {
        const url = 'https://api.openai.com/v1/batches'
        try {
            const responses = await sendBatchRequests(url, requests)
        } catch (error) {
            console.log('--------------')
            console.error('Batch processing failed:', error.code)
        }
    }

    executeBatches(requests)
}

/**
 * Generate embeddings for each batch of movie metadata and plots using the OpenAI API.
 * Include logging for each batch you try to embed, including the ID and title of the last record in the batch.
 */
const generateEmbeddingsForBatches = async (
    batches: OpenAIBatch[]
): Promise<EmbeddingData[]> => {}

/**
 * Generate Pinecone records from embeddings data.
 */
const generatePineconeRecords = (
    embeddingsData: EmbeddingData[]
): PineconeRecord<MovieMetadata>[] => {}

/**
 * Create batches of Pinecone records for upserting.
 * Refer to the Pinecone documentation: https://docs.pinecone.io/guides/data/upsert-data
 */
const createPineconeBatches = (
    vectors: PineconeRecord<MovieMetadata>[],
    batchSize = 200
): PineconeRecord<MovieMetadata>[][] => {}

/**
 * Upsert batches of Pinecone records to Pinecone.
 * Provide logging for each batch you try to, including the IDs of the first and last records in the batch.
 * Log the success or failure of each batch upsert.
 * Note that you can upsert multiple batches concurrently!
 */
const upsertBatchesToPinecone = async (
    pineconeBatches: PineconeRecord<MovieMetadata>[][]
): Promise<void> => {}

const main = async (): Promise<void> => {
    const parsedCsvContent = await parseCsv('wikimovie-sample.csv')
    // console.log(parsedCsvContent)
    if (!parsedCsvContent) {
        throw new Error('Embeddings data not found.')
    }
    const openAIBatches = createOpenAIBatches(parsedCsvContent)
    // const embeddingsData = await generateEmbeddingsForBatches(openAIBatches)
    // const pineconeRecords = generatePineconeRecords(embeddingsData)
    // const pineconeBatches = createPineconeBatches(pineconeRecords)
    // upsertBatchesToPinecone(pineconeBatches)
}

main().catch((error) => {
    console.error('An error occurred in main:', error)
    process.exit(1)
})
