const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Configuration, OpenAIApi } = require("openai");
const HistoryItem = require('../models/HistoryItem');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

isLoggedIn = (req, res, next) => {
    if (res.locals.loggedIn) {
        next()
    } else {
        res.redirect('/login')
    }
}

router.get("/songs", (req, res, next) => {
    res.render('songrecom', { title: 'Express' });
})

router.get('/history',
    isLoggedIn,
    async (req, res, next) => {
        let items = await HistoryItem.find({ userId: req.user._id })
        res.render('history', { items })
    }
)

router.get('/history/clear',
    isLoggedIn,
    async (req, res, next) => {
        await HistoryItem.remove({ userId: req.user._id })
        res.render('history', { items: [] })
    }
)

router.post('/songs',
    isLoggedIn,
    async (req, res, next) => {
        let response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "List several famous songs of the singer" + "Enter singer name: " + req.body.singername,
            temperature: 1,
            max_tokens: 2048,
            n: 1,
            stop: null,
        })

            .then(result => { return result.data.choices[0].text })
            .catch(error => console.error(error));

        const history = new HistoryItem(
            {
                prompt: "List several famous songs of the singer "
                + "Enter singer name: " + req.body.singername,
                answer: response,
                time: new Date(),
                userId: req.user._id,
            }
        )
        await history.save()
        res.render('songanswer',{ response });

    }
)

module.exports = router;