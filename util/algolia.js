const algoliaSearch=require("algoliasearch")

require("dotenv").config()

const client = algoliaSearch.default(process.env.ALGOLIA_APP_ID,process.env.ALGOLIA_ADMIN_KEY)

const studentIndex=client.initIndex("dev_LIB_STUDENTS")
const booksIndex=client.initIndex("dev_LIB_BOOKS")

module.exports= {
    client,
    studentIndex,
    booksIndex
}