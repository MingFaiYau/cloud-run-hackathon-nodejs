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

const ACTIONS = ['F', 'T', 'L', 'R']
const DIRECTION = ['N', 'S', 'E', 'W']
const ATTACK_RANGE = 3
let previousScore = null

app.post('/', function (req, res) {
	const selfHref = req.body._links.self.href
	const arena = req.body.arena
	const state = arena.state
	const mapSizeX = arena.dims[0]
	const mapSizeY = arena.dims[1]

	const self = state[selfHref]
	console.log('mine', self)
	console.log('mine', previousScore)

  if ( previousScore === null || previousScore !==  self.score ) {
    // TODO: socre changed
    previousScore = self.score
  } 

	res.send(ACTIONS[Math.floor(Math.random() * ACTIONS.length)])
})

app.listen(process.env.PORT || 8080)
