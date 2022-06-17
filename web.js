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

const ACTIONS = ['F', 'L', 'R']
const ATTACK_RANGE = 3
let previousScore = null

const buildMapWithUser = (state, selfHref) => {
	const map = {}
	Object.keys(state).forEach((key) => {
		if (key !== selfHref) map[`${key.x}:${key.y}`] = key
	})
	return map
}

const attaciDirectly = (mapWithUser, dims, self) => {
	const mapX = dims[0]
	const mapY = dims[1]

	const { x, y, direction } = self
	switch (direction) {
		case 'N':
			// x
			// y --
			for (let i = y - 1; i <= y - ATTACK_RANGE; i--) {
				if (i < 0) return false
				if (mapWithUser[`${x}:${i}`]) return true
			}
			return false
		case 'S':
			// x
			// y ++
			for (let i = y + 1; i <= y + ATTACK_RANGE; i++) {
				if (i > mapY) return false
				if (mapWithUser[`${x}:${i}`]) return true
			}
			return false
		case 'E':
			// x ++
			// y
			for (let i = x + 1; i <= x + ATTACK_RANGE; i++) {
				if (i > mapX) return false
				if (mapWithUser[`${i}:${y}`]) return true
			}
			return false
		case 'W':
			// x--
			// y
			for (let i = x - 1; i <= x + ATTACK_RANGE; i--) {
				if (i < 0) return false
				if (mapWithUser[`${i}:${y}`]) return true
			}
			return false
	}
}

const isBound = (dims, self) => {
  return false
}

app.post('/', function (req, res) {
	const selfHref = req.body._links.self.href
	const arena = req.body.arena
	const dims = arena.dims
	const state = arena.state
	const mapWithUser = buildMapWithUser(state, selfHref)

	const self = state[selfHref]
	if (attaciDirectly(mapWithUser, dims, self)) {
		console.log('attack')
		res.send('T')
	}
	res.send(ACTIONS[Math.floor(Math.random() * ACTIONS.length)])
})

app.listen(process.env.PORT || 8080)
