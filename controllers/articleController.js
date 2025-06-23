const Article = require('../models/articleModel');

// get articles  list em by category
exports.getAllArticles = async (req, res) => {
    try {
        const { category } = req.query;

        //id category isdefinedn filter if not display all
        const filter = category ? { category } : {};
        const articles = await Article.find(filter).sort({ createdAt: -1 });

        res.status(200).json({ success: true, articles });
    } catch (error){
        console.error('[GET /articles] ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// get article by id
exports.getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findById(id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }
        res.status(200).json({ success: true, article });
    } catch (error) {
        console.error('[GET /articles/:id] ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

//create article
exports.createArticle = async (req, res) => {
    try {
        const { title, content, category, author } = req.body;

        const imageUrl = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        const article = new Article({
            title,
            content,
            category,
            author,
            image: imageUrl,
        });

        await article.save();

        res.status(201).json({
            success: true,
            message: 'Article created',
            article,
        });
    } catch (error) {
        console.error('[createArticle] ERROR:', error);
        res.status(500).json({ success: false, message: 'Failed to create article' });
    }
};

//delete article
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await Article.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Article deleted' });
  } catch (error) {
    console.error('[DELETE /articles/:id] ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

