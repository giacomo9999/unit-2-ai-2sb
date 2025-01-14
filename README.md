# Unit AI-2SB: Data Workflow

## Summary

You will be building offline data processing scripts to generate embeddings and store them in a vector DB.

Data is vital for AI/ML apps, both for training the model and (in the case of LLMs) for providing context when prompting them. It’s also incredibly difficult to work with, which is why there are dedicated teams / companies that specialize in data preparation and management.

Good news: Your data has already been collected and preprocessed! But you still have some work to do to get the data into your vector database! 😉

## Challenges

- Sign up for the “Starter” free tier on [Pinecone](https://www.pinecone.io/), store your API key in a `.env` file, and then create a “movies-sample” index using the recommended metric + dimensions for `text-embedding-3-small` (leave other options unchanged to remain within the free tier).
- Create an OpenAI api key for this project and add it to your `.env` file.
- You’ll start in `offline/embed.ts`. You’re given an array of strings to generate embeddings for:
  - Implement `generateEmbeddings`
  - Run your script with `npm run embed`
  - Check out the results in `sample_embeddings.json`!
- The next challenge is to build a batch data processing pipeline. You’ll see in `offline/upsert-batch.ts` that there are several functions for you to implement:
  - `parseCsv`
  - `createOpenAIBatches`
  - `generateEmbeddingsForBatches`
  - `generatePineconeRecords`
  - `createPineconeBatches`
  - `upsertBatchesToPinecone`
- Once you’ve implemented your batch processing pipeline, run it with `npm run upsert-batch` and check out the results through the Pinecone browser console!
