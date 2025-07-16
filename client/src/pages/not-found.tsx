import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link } from "wouter";

export default function NotFound() {
  useEffect(() => {
    // Log the exact path that caused the 404 for debugging
    console.log(`NotFound component rendered for: ${window.location.pathname}`);
  }, []);

  // Extract the first part of the path to help with navigation suggestions
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const mainSection = pathSegments.length > 0 ? pathSegments[0] : "";
  
  const isInMiniGames = mainSection === "mini-games";
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            {isInMiniGames ? 
              "This mini-game has been removed or is no longer available. Please try one of our active games instead." :
              "Sorry, the page you're looking for doesn't exist or has been moved."}
          </p>
          
          <div className="mt-6 text-xs text-gray-500">
            Path: {window.location.pathname}
          </div>
        </CardContent>
        <CardFooter className="flex gap-4 justify-center">
          {isInMiniGames && (
            <Link href="/mini-games">
              <Button variant="default">Go to Mini-Games Hub</Button>
            </Link>
          )}
          <Link href="/">
            <Button variant={isInMiniGames ? "outline" : "default"}>Back to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
