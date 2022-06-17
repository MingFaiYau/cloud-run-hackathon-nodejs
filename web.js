const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.get('/', function (req, res) {
	res.send('Let the battle begin!')
})

/*

curl -d '{
  "_links": {
    "self": {
      "href": "https://foo.com"
    }
  },
  "arena": {
    "dims": [4,3],
    "state": {
      "https://foo.com": {
        "x": 0,
        "y": 0,
        "direction": "N",
        "wasHit": false,
        "score": 0
      }
    }
  }
}' -H "Content-Type: application/json" -X POST -w "\n" \
  <THE URL YOU COPIED>

*/

app.post('/', function (req, res) {
	const response = JSON.stringify(req.body)

	const selfHref = response._links.self.href
	const arena = response.arena
	const state = arena.state
	const mapSize = arena.dims

	const self = state[selfHref]
	console.log('mine', self)

	const moves = ['F', 'T', 'L', 'R']
	res.send(moves[Math.floor(Math.random() * moves.length)])
})

app.listen(process.env.PORT || 8080)
