import React, { useState, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { TagSelector } from "./components/TagSelector";
import { CheckinForm } from "./components/CheckinForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_URL = "http://localhost:3001/api";

const App = () => {
    const [token, setToken] = useLocalStorage("tissue-token", "");
    const [error, setError] = useState("");

    if (!token) {
        return (
            <div className="container mx-auto p-4">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Login</h1>
                    <input
                        type="text"
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Enter your access token"
                        onChange={(e) => setToken(e.target.value)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto">
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <CheckinForm token={token} onError={setError} />
            </div>
        </div>
    );
};

export default App;
