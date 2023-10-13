const fetchBlogsStats = async (req, res, next) => {
    try {
        // fetching data from API 
        const response = await fetch('https://intent-kit-16.hasura.app/api/rest/blogs', {
            headers: {
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
            }
        });
        const data = await response.json()

        req.blogs = data.blogs;
        next();

    } catch (error) {
        res.status(401).send({"message" : "error while fetching all blogs" , error})
    }

}


module.exports = fetchBlogsStats;