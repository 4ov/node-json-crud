const express = require('express'),
      cors = require('cors'),
      bodyParser = require('body-parser')
      app = express(),
      fs = require('fs'),
      config = {
          base : '/jql',
          root : './collections/',
          secrets : ["_id"],
          primary : "_id"
      }
app.use(bodyParser.json())
app.use(cors())
var x = d => d 


var getAll = (req, res) => {
    var collection = req.params.collection;
    var data = JSON.parse(fs.readFileSync(`${config.root}${collection}.json`))
    data.forEach(element => {
        for(let f of config.secrets){
            delete element[f]
        }
    });
    res.json(data)
}

var getDoc = (req, res)=> {
    var id = req.params.id
    var collection = req.params.collection;
    var data = JSON.parse(fs.readFileSync(`${config.root}${collection}.json`))
    r = data.filter(doc => doc[config["primary"]] == id)[0]
    for(let f of config.secrets){
        delete r[f]
    }
    res.json(r)
}

var pushDoc = (req, res) => {
    var collection = req.params.collection;
    var data = JSON.parse(fs.readFileSync(`${config.root}${collection}.json`))
    var query = req.body.q

    if(query._id){
        if(data.filter(doc => doc._id == query._id).length > 0){
            res.status(400).send('Document Id Exist')
        }else{
            data.push(query)
            data = data.filter(x)
            fs.writeFileSync(`${config.root}${collection}.json`, JSON.stringify(data, '\t', '\t'))
            res.send({
                status : 1,
                message : 'success'
            })
        }
    }else{
        var id = `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
        query._id = id
        data.push(query)
        fs.writeFileSync(`${config.root}${collection}.json`, JSON.stringify(data,'\t', '\t'))
        doc.filter(x)
        res.send({
                status : 1,
                message : 'success'
            })
    }
}

var modifyDoc = (req, res)=>{
    var id = req.params.id
    var collection = req.params.collection;
    var data = JSON.parse(fs.readFileSync(`${config.root}${collection}.json`))
    var query = req.body.q
    var target = data.indexOf(data.filter(doc => doc[config["primary"]] == id)[0])
    for(let prop in query){
        data[target][prop] = query[prop]
    }
    data = data.filter(x)
    fs.writeFileSync(`${config.root}${collection}.json`, JSON.stringify(data,'\t', '\t'))
    doc.filter(x)
    res.json({
        status : 1,
        message : 'Modified'
    })
}

var deleteDoc = (req, res) =>{
    var id = req.params.id
    var collection = req.params.collection;
    var data = JSON.parse(fs.readFileSync(`${config.root}${collection}.json`))
    var target = data.indexOf(data.filter(doc => doc[config["primary"]] == id)[0])
    delete data[target]
    res.json({
        status : 1,
        message : 'Deleted'
    })
    data = data.filter(x)
    fs.writeFileSync(`${config.root}${collection}.json`, JSON.stringify(data,'\t', '\t'))
}

app.get(config.base + '/:collection',getAll)

app.get(config.base + '/:collection/:id', getDoc)

app.post(config.base + '/:collection', pushDoc)

app.put(config.base + '/:collection/:id', modifyDoc)

app.delete(config.base + '/:collection/:id', deleteDoc)


app.listen(5000)