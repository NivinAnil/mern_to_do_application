import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';
import { AuthContext } from '../../context/AuthContext';

const TodoList = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('/api/tasks', {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        if (user) {
            fetchTasks();
        }
    }, [user]);

    return (
        <div>
            <h2>Your Tasks</h2>
            <ul>
                {tasks.map(task => (
                    <TodoItem key={task._id} task={task} />
                ))}
            </ul>
        </div>
    );
};

export default TodoList;