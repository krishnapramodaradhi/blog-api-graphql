exports.getPosts = (req, res) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: 'First Post',
        content: 'This is my first Post',
        imageUrl: 'images/car.jpg',
        creator: {
          name: 'Pramod'
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
      message: 'Post created successfully',
      post: { 
          id: new Date().toISOString(), 
          title, 
          content,
          creator: { name: 'Pramod' },
          createdAt: new Date()
    }
  })
};
