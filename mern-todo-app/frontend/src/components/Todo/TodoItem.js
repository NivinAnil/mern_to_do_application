import React from 'react';

const TodoItem = ({ task, onDelete, onToggle }) => {
    return (
        <div className="todo-item">
            <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => onToggle(task._id)} 
            />
            <span className={task.completed ? 'completed' : ''}>{task.content}</span>
            <button onClick={() => onDelete(task._id)}>Delete</button>
        </div>
    );
};

export default TodoItem;