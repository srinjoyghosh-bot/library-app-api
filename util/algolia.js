const algoliaSearch=require("algoliasearch")

const APP_ID="BI1XN59RFA"
const ADMIN_KEY="3643f9ab56b32676c2a28eb8d5aa9324"
const SEARCH_KEY="3a5ff27f2ea17e3bc89a68dde4498a97"

const client = algoliaSearch.default(APP_ID,ADMIN_KEY)

const studentIndex=client.initIndex("dev_LIB_STUDENTS")

module.exports= {
    client,
    studentIndex
}