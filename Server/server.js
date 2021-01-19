const express = require('express');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.listen(8888);

console.log("Dans le serveur");

    //get toutes les relations
    app.get("relations", (req, res) => {
    });