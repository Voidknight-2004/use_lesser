import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Bell, BellOff } from 'lucide-react';

const AlarmClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [newAlarm, setNewAlarm] = useState({
    time: '',
    label: '',
    active: true
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      alarms.forEach(alarm => {
        if (alarm.active && alarm.time === currentTimeString) {
          triggerAlarm(alarm);
        }
      });
    };

    checkAlarms();
  }, [currentTime, alarms]);

  const triggerAlarm = (alarm) => {
    // Play sound and show notification
    const audio = new Audio('/api/placeholder/alarm-sound.mp3');
    audio.play();

    // Browser notification
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(alarm.label || 'Alarm', {
          body: `Alarm set for ${alarm.time}`,
          icon: '/api/placeholder/alarm-icon.png'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(alarm.label || 'Alarm', {
              body: `Alarm set for ${alarm.time}`,
              icon: '/api/placeholder/alarm-icon.png'
            });
          }
        });
      }
    }
  };

  const addAlarm = () => {
    if (!newAlarm.time) return;

    const alarm = {
      id: Date.now(),
      ...newAlarm,
      active: true
    };

    setAlarms([...alarms, alarm]);
    setNewAlarm({ time: '', label: '', active: true });
  };

  const toggleAlarmActive = (id) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === id ? { ...alarm, active: !alarm.active } : alarm
    ));
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-6">
        <Clock size={32} className="mr-2 text-blue-500" />
        <h2 className="text-2xl font-bold">
          {formatTime(currentTime)}
        </h2>
      </div>

      {/* Add Alarm Section */}
      <div className="flex mb-4 space-x-2">
        <input 
          type="time" 
          value={newAlarm.time}
          onChange={(e) => setNewAlarm({...newAlarm, time: e.target.value})}
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="text" 
          placeholder="Alarm Label (optional)"
          value={newAlarm.label}
          onChange={(e) => setNewAlarm({...newAlarm, label: e.target.value})}
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={addAlarm}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Alarms List */}
      {alarms.length === 0 && (
        <p className="text-center text-gray-500">No alarms set</p>
      )}

      <ul className="space-y-2">
        {alarms.map((alarm) => (
          <li 
            key={alarm.id} 
            className={`flex items-center justify-between p-2 rounded-md ${
              alarm.active 
                ? 'bg-gray-100' 
                : 'bg-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-center">
              <span className="font-semibold mr-2">{alarm.time}</span>
              {alarm.label && (
                <span className="text-gray-500 text-sm">{alarm.label}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => toggleAlarmActive(alarm.id)}
                className={`p-1 rounded ${
                  alarm.active 
                    ? 'text-green-500 hover:bg-green-200' 
                    : 'text-gray-500 hover:bg-gray-300'
                }`}
              >
                {alarm.active ? <Bell size={16} /> : <BellOff size={16} />}
              </button>
              
              <button 
                onClick={() => deleteAlarm(alarm.id)}
                className="text-red-500 hover:bg-red-200 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlarmClock;