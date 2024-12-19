import { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const ConcertManagement = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [concertsForm, setConcertsForm] = useState({
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

  const fetchConcerts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_concerts`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.status === 'success') {
        const formattedConcerts = data.concerts.map(concert => ({
          ...concert,
          date: concert.date ? new Date(concert.date).toISOString().split('T')[0] : '',
          time: concert.time ? concert.time.substring(0, 5) : ''
        }));
        setConcerts(formattedConcerts);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConcerts();
  }, [fetchConcerts]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setConcertsForm(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

const handleDelete = useCallback(async (event, concert_id) => {
    event.preventDefault(); // Change from stopPropagation to preventDefault
    
    if (!window.confirm('Are you sure you want to delete this concert?')) {
        return;
    }

    try {
        // Add error checking for concertId
        if (!concert_id) {
            throw new Error('Invalid concert ID');
        }

        // Log the URL for debugging
        console.log(`Deleting concert with ID: ${concert_id}`);
        
        const response = await fetch(`${API_BASE_URL}/delete_concerts?id=${concert_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', errorText);
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'success') {
            setConcerts(prev => prev.filter(concert => concert.concert_id !== concert_id));
            alert('Concert deleted successfully');
        } else {
            throw new Error(data.message || 'Failed to delete concert');
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert(`Error deleting concert: ${error.message}`);
    }
}, []);

const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData();
        
        // Ensure we're properly handling the ID for updates
        if (selectedItem && selectedItem.concert_id) {
            formData.append('id', selectedItem.concert_id.toString());
            console.log('Updating concert with ID:', selectedItem.concert_id);
        }

        // Append form fields
        Object.entries(concertsForm).forEach(([key, value]) => {
            formData.append(key, String(value || ''));
        });

        // Log formData contents for debugging
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        const response = await fetch(`${API_BASE_URL}/add_or_update_concert`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', errorText);
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'success') {
            if (selectedItem && selectedItem.concert_id) {
                // Update existing concert
                setConcerts(prev => prev.map(concert => 
                    concert.concert_id === selectedItem.concert_id
                        ? {
                            ...concert,
                            ...concertsForm,
                            concert_id: selectedItem.concert_id
                          }
                        : concert
                ));
            } else {
                // Add new concert
                const newConcert = {
                    ...concertsForm,
                    concert_id: data.id
                };
                setConcerts(prev => [...prev, newConcert]);
            }

            setIsModalOpen(false);
            setSelectedItem(null);
            setConcertsForm({
                name: '',
                date: '',
                time: '',
                location: '',
                details: '',
                genre: '',
                price: '',
                status: 'upcoming'
            });
            
            alert(selectedItem ? 'Concert updated successfully' : 'Concert added successfully');
        } else {
            throw new Error(data.message || 'Error submitting form');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        alert(`Error saving concert: ${error.message}`);
    }
};

// Add this function to properly set up the edit form
const handleEdit = useCallback((concert) => {
    // Make sure we're getting all the data from the concert
    console.log('Editing concert:', concert);
    
    const formData = {
        name: concert.name || '',
        date: concert.date || '',
        time: concert.time || '',
        location: concert.location || '',
        details: concert.details || '',
        genre: concert.genre || '',
        price: concert.price || '',
        status: concert.status || 'upcoming'
    };
    
    // Make sure we're storing the full concert object
    setSelectedItem(concert);
    setConcertsForm(formData);
    setIsModalOpen(true);
}, []);
  
  const FormInput = ({ label, name, type = 'text', ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-1">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          onChange={handleInputChange}
          value={concertsForm[name] || ''}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows="3"
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          onChange={handleInputChange}
          value={concertsForm[name] || ''}
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
          onChange={handleInputChange}
          value={concertsForm[name] || ''}
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
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 transition-colors"
            onClick={() => {
              setSelectedItem(null);
              setIsModalOpen(true);
            }}
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
                        type="button"
                        className="text-blue-600 p-1 hover:text-blue-800 mr-2"
                        onClick={() => handleEdit(concert)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="text-red-600 p-1 hover:text-red-800"
                        onClick={(e) => handleDelete(e, concert.concert_id)}
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
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedItem(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormInput label="Name" name="name" required />
                <FormInput label="Date" name="date" type="date" required />
                <FormInput label="Time" name="time" type="time" required />
                <FormInput label="Location" name="location" required />
                <FormInput label="Details" name="details" type="textarea" />
                <FormInput label="Genre" name="genre" required />
                <FormInput label="Price" name="price" required />
                <FormInput label="Status" name="status" type="select" required />

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
