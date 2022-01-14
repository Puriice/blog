import mongo from "../../lib/mongo";
export default async function (req, res) {
  if (req.method === 'GET') {
    console.log('Query', req.query);
    const { collections } = await mongo('posts')
    const [postCollection] = collections;
    if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
      const allPost = await postCollection.find({}).toArray()
      // const allPost = await postCursor.toArray()
      // console.log(allPost);
      return res.status(200).json(allPost)
    }
    const { id } = req.query;
    const post = await postCollection.findOne({ id: Number(id) });
    // console.log(post);
    if (post === null) {
      return res.status(404).json({
        type: 'Error',
        error: 'Not Found'
      })
    } else {
      console.log('hi');
      return res.status(200).json({
        type: 'Success',
        payload: post
      })
    }


  } else if (req.method === 'POST') {
    const body = req.body;
    // console.log(typeof body.author);
    if (!body.title || !body.body.length || typeof body.author !== 'string' || body.author.includes('<script>') || body.author.includes('</script>')) return res.status(400).end();
    body.body.forEach(e => {
      if (typeof e.line !== 'number') return res.status(400).end();
      if (e.type !== 'quote' && e.type !== 'normal') return res.status(400).end();
      if (typeof e.content !== 'string') return res.status(400).end();
      if (e.content.includes('<script>') || e.content.includes('</script>')) return res.status(400).end();
    });

    const { collections } = await mongo('users');
    const [users, postCollection] = collections;

    const result = await users.findOne({ id: body.author })
    if (Object.keys(result).length === 0 && result.constructor === Object) return res.status(400).end();
    /* 
      * body structure

      * {
      *   title:String,
      *   body:[
      *     {
      *       line:Number,
      *       type: 'quote' | 'normal',
      *       content: String
      *     },{
      *       line:Number,
      *       type: 'quote' | 'normal',
      *       content: String
      *     }
      *   ]
      * }
      
    */
    const matchingPost = await postCollection.findOne({ $or: [{ title: body.title }, { body: body.body }] })
    // console.log(matchingPost);
    if (matchingPost) return res.status(400).end();
    body.id = Math.floor(Math.floor(Math.random() * 100) * Date.now())
    postCollection.insertOne(body)
    res.status(201).end('post had been created')
  } else {
    res.status(405).end();
  }
}