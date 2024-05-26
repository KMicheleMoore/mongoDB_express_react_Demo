// import express & call router method
var express = require('express');
var router = express.Router();
var Species = require('../../models/species');
// Validate JWT
var tokenValidate = require('../../middleware/tokenValidate');

// Return all speciess
router.get('/', (req, res) => {

    Species.find().exec()
        .then(species => {
            res.send(species);
        })
        .catch(err => {
            res.status(500).send(err); 
        })
})

// Return species by ID
router.get('/:id', (req, res) => {

    Species.findById(req.params.id).exec()
        .then(species => {
            if(!species) {
                res.status(404).send("Species not found.");
            } else {
                res.status(200).send(species);
            }
        })
        .catch(err => {
            if(err.name == "CastError"){
                res.status(400).send({
                    message: "Invalid ID"
                })
            } else {
                res.status(500).send({
                    message: "Server Error"
                })
            }
        })
})

// Post new species
router.post('/', tokenValidate, (req, res) => {
    console.log(req.body)
    const newSpecies = new Species(req.body)
    newSpecies.save()
        .then(result => res.status(201).send(`Species successfully added.`))
        .catch(err => {
            if(err.name === "ValidationError"){
                res.status(422).send("Invalid data."); 
            } else {
                res.status(500).send("Server error")
            }
        })
})

// Update existing species
router.put('/:id', tokenValidate, (req, res) => {
    Species.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updatedSpecies => {
            if (!updatedSpecies) {
                res.status(404).send("Species not found.");
            } else {
                res.status(204).send("Species successfully updated.");
            }
        })
        .catch(err => {
            if(err.name === "Validation Error"){
                res.status(422).send(""); 
            } else {
                res.status(500).send({
                    message: "Server Error"
                })
            }
        })
})

// Delete species by id
router.delete('/:id', tokenValidate, (req, res) => {

    Species.findByIdAndDelete(req.params.id).exec()
        .then(removeSpecies => {
            if (!removeSpecies) {
                res.status(404).send("Species not found");
            } else {
                res.status(204).send(`Species successfully deleted.`);
            }
        })
        .catch(err => {
            if(err.name == "CastError"){
                res.status(400).send("Invalid ID");
            } else {
                res.status(500).send("Server Error");
            }
        })
})

module.exports = router