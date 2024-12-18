import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import concertConnectLogo from "../images/Logo.png";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [signupError, setSignupError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setIsAdmin(parsedUser.role === "admin");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

const handleLogin = async (event) => {
  event.preventDefault();
  const email = event.target.email.value;
  const password = event.target.password.value;

  // Client-side validation
  if (!email || !password) {
    setLoginError("Email and password are required");
    return;
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setLoginError("Please enter a valid email address");
    return;
  }

  // Password basic validation
  if (password.length < 8) {
    setLoginError("Password must be at least 8 characters long");
    return;
  }

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // Optional: Add any additional headers if needed
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Response status:', response.status);

    // Handle non-200 status codes
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Result:', result);

    if (result.success) {
      console.log("Login successful:", result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      setShowLoginModal(false);
      setLoginError(null);
      setIsLoggedIn(true);
      setIsAdmin(result.user.role === "admin");
      setUser(result.user);
    } else {
      setLoginError(result.error || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    setLoginError(
      error.message === "Failed to fetch" 
        ? "Network error. Please check your connection." 
        : "An unexpected error occurred during login."
    );
  }
};

const handleSignUp = async (event) => {
  event.preventDefault();
  const firstName = event.target.firstName.value;
  const lastName = event.target.lastName.value;
  const email = event.target.email.value;
  const password = event.target.password.value;

  // Client-side validation
  if (!firstName || !lastName || !email || !password) {
    setSignupError("All fields are required");
    return;
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setSignupError("Please enter a valid email address");
    return;
  }

  // Password strength validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    setSignupError(
      "Password must be at least 8 characters long, " +
      "include uppercase and lowercase letters, " +
      "a number, and a special character"
    );
    return;
  }

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // Optional: Add any additional headers if needed
      },
      body: JSON.stringify({ 
        firstName, 
        lastName, 
        email, 
        password 
      }),
    });

    console.log('Response status:', response.status);

    // Handle non-200 status codes
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Result:', result);

    if (result.success) {
      console.log("Sign-up successful:", result.user);
      
      // Optional: Automatically log in after successful signup
      setShowSignUpModal(false);
      setSignupError(null);
      
      // You might want to show a success message or automatically log in
      alert("Registration successful! You can now log in.");
    } else {
      setSignupError(result.error || "Sign-up failed");
    }
  } catch (error) {
    console.error("Sign-up error:", error);
    setSignupError(
      error.message === "Failed to fetch" 
        ? "Network error. Please check your connection." 
        : "An unexpected error occurred during sign-up."
    );
  }
};


  const LoginForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
        <button 
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Log In</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );

  const SignUpForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
        <button 
          onClick={() => setShowSignUpModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>
          {signupError && <p className="text-red-500 text-sm">{signupError}</p>}
          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 shadow-md">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={concertConnectLogo}
                alt="ConcertConnect Logo"
                className="h-16 sm:h-20 w-auto"
              />
              <span className="text-xl font-bold text-blue-800">ConcertConnect</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-blue-700">{user.email}</span>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors"
                      >
                        Logout
                      </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowSignUpModal(true)}
                      className="px-4 py-2 text-blue-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Sign Up
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLoginModal(true)}
                      className="px-4 py-2 text-blue-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Log in
                    </button>
                  </>
                )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-800"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <nav
        className={`bg-blue-800 ${isMobileMenuOpen ? "block" : "hidden md:block"}`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center">
            <Link to="/concerts" className="text-white font-medium px-4 py-3 md:py-4 hover:bg-blue-700 transition-colors duration-200 text-center">Concerts</Link>
            <Link to="/favorites" className="text-white font-medium px-4 py-3 md:py-4 hover:bg-blue-700 transition-colors duration-200 text-center">Favorites</Link>
            <Link to="/cart" className="text-white font-medium px-4 py-3 md:py-4 hover:bg-blue-700 transition-colors duration-200 text-center">Cart</Link>
            <Link to="/about" className="text-white font-medium px-4 py-3 md:py-4 hover:bg-blue-700 transition-colors duration-200 text-center">About</Link>
            {isAdmin && (
              <>
                <Link to="/dashboard" className="text-white font-medium px-4 py-3 md:py-4 hover:bg-blue-700 transition-colors duration-200 text-center">Dashboard</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {showLoginModal && <LoginForm />}
      {showSignUpModal && <SignUpForm />}
    </header>
  );
};

export default Navbar;
