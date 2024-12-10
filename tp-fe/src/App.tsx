import React, { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { CheckinForm } from "./components/CheckinForm";
import { CheckinHistory } from "./components/CheckinHistory";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const App: React.FC = () => {
    const [token, setToken] = useLocalStorage<string>("tissue-token", "");
    const [error, setError] = useState<string>("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleCheckinSuccess = () => {
        setError("");
        setRefreshTrigger((prev) => prev + 1);
    };

    if (!token) {
        return (
            <div className="container mx-auto p-4">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Login to Tissue</h1>
                    <div className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Enter your access token"
                            onChange={(e) => setToken(e.target.value)}
                        />
                        <p className="text-sm text-gray-600">
                            You can find your access token in your Tissue
                            account settings.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Tissue Checkin</h1>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setToken("");
                            localStorage.removeItem("tissue-token");
                        }}
                    >
                        Logout
                    </Button>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <CheckinForm
                    token={token}
                    onError={setError}
                    onSuccess={handleCheckinSuccess}
                />

                <CheckinHistory
                    token={token}
                    onError={setError}
                    refreshTrigger={refreshTrigger}
                />
            </div>
        </div>
    );
};

export default App;
