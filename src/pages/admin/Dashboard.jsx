import { useState } from 'react';
import { FaMusic } from 'react-icons/fa'; // Icon for concerts management

// Import management components
import ConcertsManagement from './ConcertsManagement';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('concerts');
  const [isAdmin, setIsAdmin] = useState(true); // Set this based on login status

  const section = [
    { 
      name: 'concerts', 
      title: 'Concerts Management', 
      Component: ConcertsManagement, 
      icon: FaMusic 
    },
    // You can add more sections here in future
  ];

  const renderActiveSection = () => {
    const currentSection = section.find(section => section.name === activeSection);
    return currentSection && currentSection.Component 
      ? <currentSection.Component /> 
      : null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        {isAdmin && section.map(section => (
          <div 
            key={section.name}
            className={`flex items-center p-3 cursor-pointer hover:bg-blue-700 ${ 
              activeSection === section.name ? 'bg-blue-700' : '' 
            }`}
            onClick={() => setActiveSection(section.name)}
          >
            <section.icon className="mr-3" />
            {section.title}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default Dashboard;

export default Dashboard;
