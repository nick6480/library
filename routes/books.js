const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const author = require('../models/author')


// router to alle books
router.get('/', async function(req, res) {
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
        try {
            const books = await query.exec()
            res.render('books/index', {
                books: books,
                searchOptions: req.query

            })
        } catch {
            res.redirect('/')
        }
})

// new book route
router.get('/new', async function(req, res) {
    renderNewPage(res, new Book())
})

// create books
router.post('/', async function (req, res) {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), //converter publishdate fra string til date
        pageCount: req.body.pageCount,
        description: req.body.description

    })
    try {
        const newBook = await book.save()
        res.redirect('books')
    } catch {
        renderNewPage(res, book, true)
    }
})
 
async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'error creating Book'
       // const book = new Book()
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}
module.exports = router