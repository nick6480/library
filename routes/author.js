const express = require('express')
const router = express.Router()
const Author = require('../models/author')


// router to alle authors
router.get('/', async function(req, res) {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const author = await Author.find(searchOptions)
        res.render('authors/index', { author: author, searchOptions: req.query  })
    } catch {
        res.redirect('/')
    }
})

// new author route
router.get('/new', function(req, res){
    res.render('authors/new', { author: new Author() })
})

// create author
router.post('/', async function (req, res) {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
           res.redirect(`author`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'an error has occured'
        })
    }
})
 
module.exports = router