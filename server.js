//Create a project called moviedex-api and initialize it as an Express app to meet the following requirements.

//Users can search for Movies by genre, country or avg_vote******
//The endpoint is GET /movie*******
//The search options for genre, country, and/or average vote are provided in query string parameters.*****
//When searching by genre, users are searching for whether the Movie's genre includes a specified string. 
//    The search should be case insensitive.**********
//When searching by country, users are searching for whether the Movie's country includes a specified string.
//    The search should be case insensitive.**********
//When searching by average vote, users are searching for Movies with an avg_vote that is greater than or equal
//    to the supplied number.**********
//The API responds with an array of full movie entries for the search results*********
//The endpoint only responds when given a valid Authorization header with a Bearer API token value.
//The endpoint should have general security in place such as best practice headers and support for CORS.
//This assignment should take about 2 hours to complete. If you're having trouble, attend a Q&A session or reach out on Slack for help.

require('dotenv').config()
const express = require('express');
const morgan = require ('morgan');
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
const helmet = require('helmet')
const cors = require ('cors');
const movie = require("./movieData.json");

const app = express();

app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

//Establish Token for Security Purposes
app.use(function validateToken(req, res, next){
    const apiToken = process.env.API_TOKEN
    const authToken=req.get('Authorization')

    //send error to User if token is incorrect or if no token is given at all
    if(!apiToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }

    //move to the next middleware
    next()
})

app.get('/movie', (req, res) =>{
    //Setting query string parameters
    const{genre, country, avg_vote} = req.query
    
    //set up a search by genre 
    if(genre){
        // Filter through Datasets with case insensitivity
        results = movie.filter(apps => apps.genre.toLowerCase().includes(genre.toLowerCase()))
        //Return results from the filter in json format
        res.json(results);
    }
    //set up search by country
    else if(country){
        //Filter through Datasets with case insensitivity
        results = movie.filter(apps => apps.country.toLowerCase().includes(country.toLowerCase()))
        //Return results from filter in json format
        res.json(results)
    }
    //set up search by Average Vote
    else if(avg_vote){
        //Filter through Dataset to return only avg votes that are greater than or equal to the searched avg_vote
        results = movie.filter(apps => apps.avg_vote >= avg_vote)
        //Return results from filter in json format
        res.json(results)
    }

})

//Error Handling Middleware (This should always be the last middleware called)
app.use((error, req, res, next) =>{
    let response
    if(process.env.NODE_ENV === 'production'){
        response = {error: {message: 'server error'}}
    }else{
        response = { error }
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

app.listen(8000, () => {
    console.log(`Listening on port ${PORT}`)
})

