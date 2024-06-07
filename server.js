const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
var cors = require('cors')

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let players = new Map();

app.post('/signin', (req, res) => {
    const { username, color } = req.body;

    if (!username || !color) {
        return res.status(400).send('Username and color are required');
    }

    const id = uuidv4();
    players.set(id, { username, color, position: { x: 0, y: 0 } });

    res.json({ id });
});

app.post('/move', (req, res) => {
    const { id, position } = req.body;

    if (!id || !position || typeof position.x !== 'number' || typeof position.y !== 'number') {
        return res.status(400).send('Player ID and valid position are required');
    }

    if (!players.has(id)) {
        return res.status(404).send('Player not found');
    }

    const player = players.get(id);
    player.position = position;
    players.set(id, player);

    res.sendStatus(200);
});

app.get('/screen', (req, res) => {
    const allPlayers = Array.from(players.entries()).map(([id, player]) => ({
        id,
        username: player.username,
        color: player.color,
        position: player.position,
    }));

    res.json(allPlayers);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
