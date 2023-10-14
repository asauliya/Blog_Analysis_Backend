const express = require('express');
const fetchBlogsStats = require('../middleware/fetch');
const router = express.Router();
const _ = require("lodash");
const __ = require('lodash-contrib');
const { memoize } = require('lodash');

router.get('/api/blog-search', fetchBlogsStats, async (req, res) => {
    try {
        const keyword = req.query.query;
        const blogs = req.blogs

        // filtered all the blog which include keyword
        const search_result = (keyword) => {
            return _.filter(
                blogs, function (o) {
                    return (__.strContains(_.lowerCase(o.title), _.lowerCase(keyword)));
                }
            )
        }
        const funcM = memoize(search_result);
        const data = funcM(keyword);

        function clearAllCache(){
            funcM.cache.clear()
            console.log("all cache cleared")
        }
        
        // clear cache after 100sec 
        const temp = setTimeout(clearAllCache, 10000);

        // send user response 
        res.json(data)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error While searching your query");
    }
})

module.exports = router