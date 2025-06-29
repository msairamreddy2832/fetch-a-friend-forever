import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Dog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (userData: { name: string; email: string }) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both name and email are required to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      if (response.ok) {
        onLogin({ name: name.trim(), email: email.trim() });
        toast({
          title: "Welcome to Fetch!",
          description: "Let's find your perfect furry companion!",
        });
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Cute dog logo with layered design */}
              <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-6 rounded-full shadow-lg transform rotate-12">
                <Dog className="h-12 w-12 text-white" />
              </div>
              {/* Heart accent */}
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-400 to-red-500 p-2 rounded-full shadow-md">
                <Heart className="h-4 w-4 text-white fill-current" />
              </div>
              {/* Decorative dots */}
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full shadow-sm"></div>
              <div className="absolute top-2 -left-4 w-2 h-2 bg-yellow-400 rounded-full shadow-sm"></div>
              <div className="absolute -top-3 left-8 w-2 h-2 bg-green-400 rounded-full shadow-sm"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🐕 Fetch a Friend Forever
          </h1>
          <p className="text-lg text-gray-600">
            Where every tail wag leads to a loving home! 🏡✨
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Get Started</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your information to begin your pawsome journey! 🐾
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Finding your match...
                  </div>
                ) : (
                  "🐾 Start My Dog Adventure!"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
