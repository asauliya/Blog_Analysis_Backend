const { memoize } = require('lodash');
const fetchBlogsStats = async (req, res, next) => {
    try {
        // fetching data from API 
        const func = async () => {
            const response = await fetch('https://intent-kit-16.hasura.app/api/rest/blogs', {
                headers: {
                    'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
                }
            });
            const data = await response.json()

            req.blogs = data.blogs;
        }

        const funcM = memoize(func)
        await funcM()
        function clearAllCache(){
            funcM.cache.clear()
            console.log("cleared cached blogs")
        }
        // clear cache data after 100sec 
        const temp = setTimeout(clearAllCache, 100000);
        next();

    } catch (error) {
        res.status(500).send({ "message": "error while fetching blogs", error })
    }

}


module.exports = fetchBlogsStats;