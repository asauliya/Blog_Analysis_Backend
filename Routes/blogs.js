const express = require('express');
const fetchBlogsStats = require('../middleware/fetch');
const router = express.Router();
const _ = require("lodash");
const __ = require('lodash-contrib');
const { memoize } = require('lodash');

router.get('/api/blog-stats', fetchBlogsStats, async (req, res) => {
    try {
        const keyword = "privacy";
        const blogs = req.blogs;

        // counting total blogs 
        const count = _.size(blogs)

        // filtered all the blog which include keyword
        const search_result = (keyword) => {
            return _.filter(
                blogs, function (o) {
                    return (__.strContains(_.lowerCase(o.title), keyword));
                }
            )
        }
        // selected all the blog which include keyword privacy
        const funcM = memoize(search_result);
        const privacy = funcM(keyword);

        // created  array of all unique titles of blogs 
        const uniqueTitle = () => {return  _.uniq(_.map(blogs, 'title'))}
        const uniqueTitleM = memoize(uniqueTitle)

        // find largest title
        const largestTitle = () => {
            let mx = 0;
            let index = -1;
            _.forEach(blogs, function (a, i) {
                if (_.size(a.title) > mx) {
                    index = i;
                    mx = _.size(a.title)
                }
            })

            return index;
        }
        const largestTitleM = memoize(largestTitle)

        function clearAllCache() {
            funcM.cache.clear()
            largestTitleM.cache.clear()
            console.log("all cache cleared")
        }
        // clear cache after 100sec
        const temp = setTimeout(clearAllCache, 100000);

        if (count == 0) {
            res.json({
                "total_blogs": 0,
                "number_of_blogs_with_privacy": 0,
                "unique_titles": [],
                "blog_with_longest_title": {}
            })
        }
        else {
            const obj = {
                "total_blogs": count,
                "number_of_blogs_with_privacy": _.size(privacy),
                "unique_titles": uniqueTitleM(),
                "blog_with_longest_title": blogs[largestTitleM()]
            }

            res.json(obj);
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error while analysing blogs data.");
    }
})

module.exports = router