const Task = require('../models/Task');

const toClient = (taskDoc) => {
  return {
    _id: taskDoc._id,
    title: taskDoc.title ?? taskDoc.content ?? '',
    done: typeof taskDoc.done !== 'undefined' ? taskDoc.done : (taskDoc.completed || false),
  };
};

exports.createTask = async (req, res) => {
  const { title, content } = req.body;
  const taskTitle = (title || content || '').trim();
  if (!taskTitle) return res.status(400).json({ message: 'Task title is required' });

  try {
    const newTask = new Task({
      ...(Task.schema.path('title') ? { title: taskTitle } : { content: taskTitle }),
      ...(Task.schema.path('done') ? { done: false } : { completed: false }),
      user: req.user && (req.user.id || req.user._id),
    });
    await newTask.save();
    return res.status(201).json(toClient(newTask));
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(tasks.map(toClient));
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, done, content, completed } = req.body;
  const update = {};
  if (typeof title !== 'undefined') update.title = title;
  if (typeof content !== 'undefined') update.content = content;
  if (typeof done !== 'undefined') update.done = done;
  if (typeof completed !== 'undefined') update.completed = completed;

  try {
    const task = await Task.findByIdAndUpdate(id, update, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    return res.status(200).json(toClient(task));
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    return res.status(200).json(toClient(task));
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
