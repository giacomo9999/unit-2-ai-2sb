import path from 'path'
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

/**
 * Parse CSV data from a file using the `csv-parse` package.
 * Make sure the to infer column names from the first row of the CSV file.
 * Cast the `year` column to a number.
 */
const parseCsv = async (filename: string): Promise<MovieMetadata[] | null> => {
    const filePath = path.resolve(__dirname, filename)
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
): OpenAIBatch[] => {}

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
const upsertBatchesToPicone = async (
    pineconeBatches: PineconeRecord<MovieMetadata>[][]
): Promise<void> => {}

const main = async (): Promise<void> => {
    const parsedCsvContent = await parseCsv('wikimovie-sample.csv')
    if (!parsedCsvContent) {
        throw new Error('Embeddings data not found.')
    }
    const openAIBatches = createOpenAIBatches(parsedCsvContent)
    const embeddingsData = await generateEmbeddingsForBatches(openAIBatches)
    const pineconeRecords = generatePineconeRecords(embeddingsData)
    const pineconeBatches = createPineconeBatches(pineconeRecords)
    upsertBatchesToPicone(pineconeBatches)
}

main().catch((error) => {
    console.error('An error occurred in main:', error)
    process.exit(1)
})
