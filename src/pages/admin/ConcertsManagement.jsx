import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

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
    price: ''
  });

  // Fetch concerts from the API on mount
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    // Determine the method (add or update)
    const method = selectedItem ? 'PUT' : 'POST';
    const url = '/api/concerts/add_or_update_concert';
  
    const formData = new FormData();
    formData.append('name', concertsForm.name);
    formData.append('date', concertsForm.date);
    formData.append('time', concertsForm.time);
    formData.append('location', concertsForm.location);
    formData.append('details', concertsForm.details || ''); // Make sure to handle empty details
    formData.append('genre', concertsForm.genre);
    formData.append('price', concertsForm.price);
    formData.append('type', concertsForm.type); // Add concert type (upcoming or past)
    formData.append('results', concertsForm.results || ''); // Optional field for results
    if (selectedItem) {
      formData.append('id', selectedItem.id); // Add the id if updating
    }
  
    // Make the request to the PHP file
    fetch(url, {
      method: 'POST', // Use POST for both add and update
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          // If successful, update the state
          if (selectedItem) {
            // Update the concert in the list
            setConcerts(concerts.map(concert => concert.id === selectedItem.id ? { ...concertsForm, id: selectedItem.id } : concert));
          } else {
            // Add new concert to the list
            setConcerts([...concerts, { ...concertsForm, id: Date.now() }]); // Use Date.now() for unique ID if adding
          }
          // Close the modal and reset the form
          setIsModalOpen(false);
          setConcertsForm({
            id: '',
            name: '',
            date: '',
            time: '',
            location: '',
            details: '',
            genre: '',
            price: '',
            type: 'upcoming', // Default to upcoming
            results: ''
          });
        } else {
          // Handle error
          alert('There was an error processing the concert: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the concert.');
      });
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Concert Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded mb-4"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="inline mr-2" /> Add Concert
          </button>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Date</th>
                <th className="py-2">Time</th>
                <th className="py-2">Location</th>
                <th className="py-2">Details</th>
                <th className="py-2">Genre</th>
                <th className="py-2">Price</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {concerts.map(concert => (
                <tr key={concert.id}>
                  <td className="border px-4 py-2">{concert.name}</td>
                  <td className="border px-4 py-2">{concert.date}</td>
                  <td className="border px-4 py-2">{concert.time}</td>
                  <td className="border px-4 py-2">{concert.location}</td>
                  <td className="border px-4 py-2">{concert.details}</td>
                  <td className="border px-4 py-2">{concert.genre}</td>
                  <td className="border px-4 py-2">{concert.price}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleEdit(concert)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
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
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTrash className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6">{selectedItem ? 'Edit Concert' : 'Add Concert'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={concertsForm.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={concertsForm.date}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={concertsForm.time}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={concertsForm.location}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="details" className="block text-gray-700 mb-2">Details</label>
                <textarea
                  id="details"
                  name="details"
                  value={concertsForm.details}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="genre" className="block text-gray-700 mb-2">Genre</label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  value={concertsForm.genre}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-gray-700 mb-2">Price</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={concertsForm.price}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {selectedItem ? 'Update Concert' : 'Add Concert'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConcertManagement;
