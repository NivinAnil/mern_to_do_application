const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
    const { content } = req.body;

    try {
        const newTask = new Task({
            content,
            completed: false,
            user: req.user.id
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { content, completed } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(id, { content, completed }, { new: true });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};