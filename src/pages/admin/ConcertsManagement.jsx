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

  const API_BASE_URL = '/api/concerts';

  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_concerts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        // Format dates and times for display
        const formattedConcerts = data.concerts.map(concert => ({
          ...concert,
          date: concert.date ? concert.date.split(' ')[0] : '', // Extract date part only
          time: concert.time || ''
        }));
        setConcerts(formattedConcerts);
      } else {
        console.error('Error fetching concerts:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (concert) => {
    // Format the date and time for the form inputs
    const formData = {
      id: concert.concert_id,
      name: concert.name || '',
      date: concert.date || '',
      time: concert.time || '',
      location: concert.location || '',
      details: concert.details || '',
      genre: concert.genre || '',
      price: concert.price || '',
      status: concert.status || 'upcoming'
    };
    
    setSelectedItem(concert);
    setConcertsForm(formData);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this concert?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/delete_concerts?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setConcerts(concerts.filter(concert => concert.concert_id !== id));
      } else {
        alert('Error deleting concert: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting concert. Please try again.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setConcertsForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    if (selectedItem) {
      formData.append('id', selectedItem.concert_id.toString());
    }
    
    Object.entries(concertsForm).forEach(([key, value]) => {
      if (key !== 'id' || !selectedItem) {
        formData.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/add_or_update_concert`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        if (selectedItem) {
          // Update the concerts state with the new data
          setConcerts(prevConcerts => 
            prevConcerts.map(concert => 
              concert.concert_id === selectedItem.concert_id
                ? {
                    ...concert,
                    ...concertsForm,
                    concert_id: selectedItem.concert_id,
                    date: concertsForm.date,
                    time: concertsForm.time
                  }
                : concert
            )
          );
        } else {
          // Add new concert
          const newConcert = {
            ...concertsForm,
            concert_id: data.id
          };
          setConcerts(prevConcerts => [...prevConcerts, newConcert]);
        }
        closeModal();
        fetchConcerts(); // Refresh the list to ensure synchronized data
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
          value={concertsForm[name]}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows="3"
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          onChange={handleFormChange}
          value={concertsForm[name]}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          {...props}
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          onChange={handleFormChange}
          value={concertsForm[name]}
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
                  <tr key={concert.concert_id}>
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
                        onClick={() => handleDelete(concert.concert_id)}
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
                  required
                />
                <FormInput 
                  label="Date"
                  name="date"
                  type="date"
                  required
                />
                <FormInput 
                  label="Time"
                  name="time"
                  type="time"
                  required
                />
                <FormInput 
                  label="Location"
                  name="location"
                  required
                />
                <FormInput 
                  label="Details"
                  name="details"
                  type="textarea"
                />
                <FormInput 
                  label="Genre"
                  name="genre"
                  required
                />
                <FormInput 
                  label="Price"
                  name="price"
                  required
                />
                <FormInput 
                  label="Status"
                  name="status"
                  type="select"
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
