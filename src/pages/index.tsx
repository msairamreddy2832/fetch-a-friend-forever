import { useState, useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { DogSearch } from "@/components/DogSearch";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated by trying to fetch breeds
    const checkAuth = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
          credentials: 'include'
        });
        if (response.ok) {
          setIsAuthenticated(true);
          // Try to get user info from localStorage if available
          const savedUser = localStorage.getItem('dogAppUser');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (error) {
        console.log('Not authenticated yet');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('dogAppUser', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('dogAppUser');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {!isAuthenticated ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <DogSearch user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
