import React from 'react';
import TodoList from '../components/Todo/TodoList';

const Home = () => {
    return (
        <div>
            <h1>Welcome to Your To-Do List</h1>
            <TodoList />
        </div>
    );
};

export default Home;