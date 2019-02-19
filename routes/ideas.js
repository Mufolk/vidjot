const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Idea Index Page
router.get('/', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index',{
                ideas:ideas
            });
        });

});

//Add Idea Form
router.get('/add', (req, res) => {
    res.render('ideas/add');
});

//Edit Idea Form
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id:req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea:idea
            });
        });
});

// Process Form
router.post('/', (req, res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }

    if(!req.body.details){
        errors.push({text:'Please some details'});
    }

    if(errors.length >0){
        res.render('/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video Idea Added');
                res.redirect('/ideas');
            });
    }
});

//Edit Form Process
router.put('/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            //new values
            idea.tittle = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video Idea Updated');
                    res.redirect('/ideas');
                })
        });
});

//Delete Idea
router.delete('/:id', (req,res) => {
    Idea.remove({_id: req.params.id})
        .then(() => {
            req.flash('success_msg', 'Video Idea Removed');
            res.redirect('/ideas')
        });
});

module.exports = router;