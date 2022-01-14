import mongo from "../../lib/mongo";
export default async function (req, res) {
  if (req.method === 'GET') {
    const { q } = req.query
    const { collections } = await mongo('posts')
    const [postCollection] = collections;
    const matchingPost = await postCollection.find({ title: { $regex: new RegExp('^' + q + '.*', 'i') } }).toArray()
    // console.log(matchingPost);
    res.json(matchingPost)
  }
}