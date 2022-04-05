let express = require('express')
let bodyParser = require('body-parser')
let fs = require('fs')
let app = express()

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

const CATEGORIES = require('./helper').categories
let uid = require('./helper').uid

app.route('/')
    .get((req, res) => {
        if (req.query.received == 'no') {
            res.render('index', { 
                categories: CATEGORIES, 
                received: req.query.received 
            })
        } else if(req.query.received == 'yes') {
            res.render('index', { 
                categories: CATEGORIES, 
                received: req.query.received, 
                ticket: req.query.ticket
            })
        } else {
            res.render('index', { categories: CATEGORIES})
        }
    })
    .post((req,res) => {
        console.log(req.body)
        let form = req.body

        if (form.issue.trim().length <= 0) {
            res.redirect('/?received=no')
        } else {
            let data = JSON.parse(fs.readFileSync('data.json'))
            
            let ticket = {
                id: uid(),
                category: form.category,
                issueText: form.issue.trim(),
                response: '',
            }
            
            data.push(ticket)
            
            fs.writeFileSync('data.json', JSON.stringify(data))
            res.redirect(`/?received=yes&ticket=${ticket.id}`)
        }
    })

app.route('/check')
    .get((req, res) => {
        res.render('check')
    })
    .post((req, res) => {
        let code = req.body.code
        let tickets = JSON.parse(fs.readFileSync('data.json'))
        let ticketAnswer = tickets.filter(ticket => ticket.id == code)[0]
        
        if(ticketAnswer == undefined) {
            res.render('check', { 
                response: 'There is no such ticket. Please check provided code and try again.' 
            })
        } else if (ticketAnswer.response.length <= 0) {
            res.render('check', { 
                response: 'We are still working on your ticket. Please wait a litte bit more and we will reach you soon.' 
            })
        } else {
            res.render('check', { response: ticketAnswer.response })
        }
    })


app.listen(3000, (err) => {
    if (err) console.log(err)

    console.log('Server is running on port 3000...')
})

