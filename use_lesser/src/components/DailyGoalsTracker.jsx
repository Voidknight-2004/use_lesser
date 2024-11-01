import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';

const DailyGoalsTracker = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');

  // Load goals from local storage on component mount
  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem('dailyGoals') || '[]');
    const today = new Date().toDateString();
    
    // Filter out goals from previous days
    const todaysGoals = savedGoals.filter(goal => 
      new Date(goal.date).toDateString() === today
    );
    
    setGoals(todaysGoals);
  }, []);

  // Save goals to local storage whenever goals change
  useEffect(() => {
    localStorage.setItem('dailyGoals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (newGoal.trim() === '') return;

    const newGoalObject = {
      id: Date.now(),
      text: newGoal,
      completed: false,
      date: new Date().toISOString()
    };

    setGoals([...goals, newGoalObject]);
    setNewGoal('');
  };

  const toggleGoal = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const deleteAllGoals = () => {
    setGoals([]);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Today's Goals</h2>
      
      <div className="flex mb-4">
        <input 
          type="text" 
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addGoal()}
          placeholder="Enter a new goal" 
          className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={addGoal}
          className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition"
        >
          <Plus size={20} />
        </button>
      </div>

      {goals.length === 0 && (
        <p className="text-center text-gray-500">No goals for today. Add some!</p>
      )}

      <ul className="space-y-2">
        {goals.map((goal) => (
          <li 
            key={goal.id} 
            className={`flex items-center justify-between p-2 rounded-md ${
              goal.completed 
                ? 'bg-green-100 line-through text-gray-500' 
                : 'bg-gray-100'
            }`}
          >
            <span 
              onClick={() => toggleGoal(goal.id)}
              className="flex-grow cursor-pointer"
            >
              {goal.text}
            </span>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => toggleGoal(goal.id)}
                className={`p-1 rounded ${
                  goal.completed 
                    ? 'text-gray-400 hover:bg-gray-200' 
                    : 'text-green-500 hover:bg-green-200'
                }`}
              >
                {goal.completed ? <X size={16} /> : <Check size={16} />}
              </button>
              
              <button 
                onClick={() => deleteGoal(goal.id)}
                className="text-red-500 hover:bg-red-200 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {goals.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {goals.filter(goal => goal.completed).length} / {goals.length} completed
          </span>
          <button 
            onClick={deleteAllGoals}
            className="text-red-500 hover:bg-red-100 p-2 rounded"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyGoalsTracker;