import { useState } from 'react';


// Import management components
import ConcertsManagement from './ConcertsManagement';


const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('news');

  const section = [
    { name: 'concerts', title: 'Concerts Management', Component: ConcertsManagement },
  ];

  const renderActiveSection = () => {
    const currentSection = section.find(section => section.name === activeSection);
    return currentSection && currentSection.Component 
      ? <currentSection.Component /> 
      : null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-blue-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        {section.map(section => (
          <div 
            key={section.name}
            className={`flex items-center p-3 cursor-pointer hover:bg-blue-700 ${
              activeSection === section.name ? 'bg-blue-700' : ''
            }`}
            onClick={() => setActiveSection(section.name)}
          >
            <section.icon className="mr-3"/>
            {section.title}
          </div>
        ))}
      </div>

      <div className="flex-1 p-8 overflow-auto">
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default Dashboard;