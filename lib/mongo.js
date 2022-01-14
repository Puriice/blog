import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}
async function mongo(...collectionName) {
  let client = new MongoClient(uri)

  await client.connect();
  const db = await client.db('blog')
  const myPromise = new Promise((resolve, reject) => {
    let collections = [];
    collectionName.forEach(async (name) => {
      const collection = await db.collection(name)
      // console.log(collection);
      collections.push(collection)
    })
    resolve(collections)
  })

  const collections = await myPromise.then((result) => {
    return result
  })
  return { client, collections }
  // console.log(collections);
}
export default mongo;

