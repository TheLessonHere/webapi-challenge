const express = require('express');
const projectdb = require('../data/helpers/projectModel');
const router = express.Router();

router.post('/', (req, res) => {
    const newProject = {
        name: req.body.name || null,
        description: req.body.description || null,
        completed: req.body.completed || null
    }
    if (newProject.description && newProject.name) {
        projectdb.insert(newProject)
        .then(response => {
            console.log(response);
            res.status(201).json({ message: "Project created successfully" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Server error inserting new project" })
        })
    } else {
        res.status(400).json({ error: "Name and Description required" })
    }
})

router.get('/', (req, res) => {
    projectdb.get()
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error getting projects" });
    })
})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    projectdb.get(id)
    .then(project => {
        if(project) {
        res.status(200).json(project);
        } else {
            res.status(404).json({ error: "Project with given id not found" });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error getting projects" });
    })
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const newProject = {
        name: req.body.name || null,
        description: req.body.description || null,
        completed: req.body.completed || null
    }
    projectdb.get(id)
    .then(project => {
        if(project){
            if (newProject.description && newProject.name) {
                    projectdb.update(id, newProject)
                    .then(response => {
                        console.log(response);
                        res.status(201).json({ message: "Project updated successfully" });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "Server error updating project" })
                    })
            } else {
                    res.status(400).json({ error: "Name and Description required" })
            }
        } else {
            res.status(404).json({ error: "Project with the given id not found." })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error validating project id" })
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    projectdb.get(id)
    .then(project => {
        if(project){
            projectdb.remove(id)
            .then(response => {
                res.status(200).json({ message: "Project successfully deleted" })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "Server error deleting the project" })
            })
        } else {
            res.status(404).json({ error: "Project with the given id not found." })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server error validating project id." })
    })
})

module.exports = router;