const express = require('express');
const fetchBlogsStats = require('../middleware/fetch');
const router = express.Router();
const _ = require("lodash");
const __ = require('lodash-contrib');

router.get('/api/blog-search', fetchBlogsStats, async (req, res) => {
    try {
        const keyword = req.query.query;
        const blogs = req.blogs

        // filter the blogs based on query 
        const search_result = _.filter(
            blogs, function (o) {
                return (__.strContains(_.lowerCase(o.title), _.lowerCase(keyword)));
            }
        )
        
        // send user response 
        res.json(search_result)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error While searching your query");
    }
})

module.exports = router