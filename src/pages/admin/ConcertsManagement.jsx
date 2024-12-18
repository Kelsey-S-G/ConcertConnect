import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const ConcertManagement = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [concertsForm, setConcertsForm] = useState({
    id: '',
    name: '',
    date: '',
    time: '',
    location: '',
    details: '',
    genre: '',
    price: '',
    status: 'upcoming'
  });

  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    try {
      const response = await fetch("/api/concerts/get_concerts");
      const data = await response.json();
      if (data.status === 'success') {
        setConcerts(data.concerts);
      } else {
        console.error('Error fetching concerts:', data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleEdit = (concert) => {
    setSelectedItem(concert);
    setConcertsForm(concert);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/concerts/delete_concerts?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.status === 'success') {
        setConcerts(concerts.filter(concert => concert.id !== id));
      } else {
        console.error('Error deleting concert:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setConcertsForm({ ...concertsForm, [name]: value });
  };

  const handleFormSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  Object.keys(concertsForm).forEach(key => {
    formData.append(key, concertsForm[key] || '');
  });

  try {
    const response = await fetch('/api/concerts/add_or_update_concert', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (data.status === 'success') {
      if (selectedItem) {
        // Update the existing concert
        setConcerts(concerts.map(concert => 
          concert.concert_id === selectedItem.concert_id
            ? { ...concert, ...concertsForm } // Only update the matching concert
            : concert
        ));
      } else {
        // Add a new concert
        setConcerts([...concerts, { ...concertsForm, concert_id: data.id }]);
      }
      closeModal();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while submitting the concert.');
  }
};

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setConcertsForm({
      id: '',
      name: '',
      date: '',
      time: '',
      location: '',
      details: '',
      genre: '',
      price: '',
      status: 'upcoming'
    });
  };

  const FormInput = ({ label, name, type = 'text', ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-1">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          onChange={handleFormChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows="3"
          {...props}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          onChange={handleFormChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          {...props}
        />
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Concert Management</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="inline mr-2" /> Add Concert
          </button>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Date', 'Time', 'Location', 'Details', 'Genre', 'Price', 'Status', 'Actions'].map(header => (
                    <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {concerts.map(concert => (
                  <tr key={concert.id}>
                    <td className="px-4 py-2">{concert.name}</td>
                    <td className="px-4 py-2">{concert.date}</td>
                    <td className="px-4 py-2">{concert.time}</td>
                    <td className="px-4 py-2">{concert.location}</td>
                    <td className="px-4 py-2">{concert.details}</td>
                    <td className="px-4 py-2">{concert.genre}</td>
                    <td className="px-4 py-2">{concert.price}</td>
                    <td className="px-4 py-2">{concert.status}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-blue-600 p-1 hover:text-blue-800 mr-2"
                        onClick={() => handleEdit(concert)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 p-1 hover:text-red-800"
                        onClick={() => handleDelete(concert.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {selectedItem ? 'Edit Concert' : 'Add Concert'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormInput 
                  label="Name"
                  name="name"
                  value={concertsForm.name}
                  required
                />
                <FormInput 
                  label="Date"
                  name="date"
                  type="date"
                  value={concertsForm.date}
                  required
                />
                <FormInput 
                  label="Time"
                  name="time"
                  type="time"
                  value={concertsForm.time}
                  required
                />
                <FormInput 
                  label="Location"
                  name="location"
                  value={concertsForm.location}
                  required
                />
                <FormInput 
                  label="Details"
                  name="details"
                  type="textarea"
                  value={concertsForm.details}
                  required
                />
                <FormInput 
                  label="Genre"
                  name="genre"
                  value={concertsForm.genre}
                  required
                />
                <FormInput 
                  label="Price"
                  name="price"
                  value={concertsForm.price}
                  required
                />
                <FormInput 
                  label="Status"
                  name="status"
                  value={concertsForm.status}
                  required
                />
                
                <div className="pt-4 border-t">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {selectedItem ? 'Update Concert' : 'Add Concert'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConcertManagement;
