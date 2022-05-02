module.exports = {
    apps: [
        {
            name: "maplist",
            script: "./dist/index.js",
            watch: false,
            env: {
                "PORT": "14010",
            }
        }
    ]
}