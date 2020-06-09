import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const ini = require('ini');
console.log(__dirname + '/../../../secrets.ini');
const config = ini.parse(fs.readFileSync(__dirname + '/../../../secrets.ini', 'utf-8'));

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const app = express();
app.use(express.json({
	type: ['application/json', 'text/plain']
}));
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(cors());


const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
var BSONRegExp = mongodb.BSONRegExp;
const uri = "mongodb+srv://" + config.username + ":" + config.password + "@" + config.dburl + ".mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
	var db = client.db("garden");
	var collection = db.collection("plants");

	app.get("/vegetableslist", (req, res) => {
		collection.find({}).toArray((err, docs) => {
			console.log(err, docs);
			res.send(docs);
		});
	});

	app.post("/newveg", (req, res) => {
		console.log(req.body);

		collection.insertOne({
			name: req.body.name,
			description: req.body.description,
			picture: "/question.png",
			picalt: "Waiting for a real pic."
		}, function (err, resmongo) {
			collection.find({}).toArray((err, docs) => {
				console.log(err, docs);
				res.send(docs);
			});
		});
	});
	
	app.post("/editveg/:id", (req, res) => {
		console.log(req.body);

		collection.updateOne({_id:mongodb.ObjectId(req.params.id)},{
			name: req.body.name,
			description: req.body.description,
			picture: req.body.picture,
			picalt: req.body.picalt
		}, function (err, resmongo) {
			collection.find({}).toArray((err, docs) => {
				console.log(err, docs);
				res.send(docs);
			});
		});
	});

	app.delete("/deleteveg/:id", (req, res) => {
		console.log(req.params.id);
		collection.deleteOne( {_id:mongodb.ObjectId(req.params.id)}, function (err, obj) {
			collection.find({}).toArray((err, docs) => {
				res.send(docs);
			});
		});
	})

	app.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	);



	app.listen(PORT, err => {
		if (err) console.log('error', err);
	});


	/*if (err) console.log("Connection failed du to :", err);
	

	var query = {
		"color": "green"
	};

	collection.find(query).toArray((err, docs) => {
		console.log(err, docs);
		client.close();
	});*/

});