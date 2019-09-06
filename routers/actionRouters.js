const express = require('express');
const actiondb = require('../data/helpers/actionModel');
const projectsdb = require('../data/helpers/projectModel');
const router = express.Router();

router.post('/:project_id', (req, res) => {
    const { project_id } = req.params;
    const newAction = {
        project_id: project_id,
        description: req.body.description || null,
        notes: req.body.notes || null,
        completed: req.body.completed || null
    }
    projectsdb.get(project_id)
    .then(project => {
        if(project){
            if (newAction.description && newAction.notes) {
                actiondb.insert(newAction)
                .then(response => {
                    console.log(response);
                    res.status(201).json({ message: "Action created successfully" });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: "Server error inserting new action" })
                })
            } else {
                res.status(400).json({ error: "Description and Notes required" })
            }
        } else {
            res.status(404).json({ error: "Project with the given id not found." })
        }
    })
})

router.get('/', (req, res) => {
    actiondb.get()
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error getting actions" });
    })
})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    actiondb.get(id)
    .then(action => {
        if(action) {
        res.status(200).json(action);
        } else {
            res.status(404).json({ error: "Action with given id not found" });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error getting actions" });
    })
})

router.put('/:project_id/:id', (req, res) => {
    const { project_id, id } = req.params;
    const newAction = {
        project_id: project_id,
        description: req.body.description || null,
        notes: req.body.notes || null,
        completed: req.body.completed || null
    }
    actiondb.get(id)
    .then(action => {
        if(action){
            projectsdb.get(project_id)
            .then(project => {
                if(project){
                    if (newAction.description && newAction.notes) {
                        actiondb.update(id, newAction)
                        .then(response => {
                            console.log(response);
                            res.status(201).json({ message: "Action updated successfully" });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: "Server error updating action" })
                        })
                    } else {
                        res.status(400).json({ error: "Description and Notes required" })
                    }
                } else {
                    res.status(404).json({ error: "Project with the given id not found." })
                }
            })
        } else {
            res.status(404).json({ error: "Action with the given id not found."})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error getting action with the given id" })
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    actiondb.get(id)
    .then(action => {
        if(action){
            actiondb.remove(id)
            .then(response => {
                res.status(200).json({ message: "Action successfully deleted" })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "Server error deleting the action" })
            })
        } else {
            res.status(404).json({ error: "Action with the given id not found." })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error validating action id." })
    })
})

module.exports = router;