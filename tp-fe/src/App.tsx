import React, { useState } from "react";

import { createApiClient } from "@/api/client";
import { CheckinForm } from "@/components/checkin/CheckinForm";
import { CheckinHistory } from "@/components/checkin/CheckinHistory";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const App: React.FC = () => {
    const [token, setToken] = useLocalStorage<string>("tissue-token", "");
    const [error, setError] = useState<string>("");
    const [refreshTrigger, setRefreshTrigger] = useState(new Date().getTime());

    const handleCheckinSuccess = () => {
        setError("");
        setRefreshTrigger(new Date().getTime());
    };

    if (!token) {
        return (
            <div className="container mx-auto p-4">
                <div className="max-w-md mx-auto space-y-4">
                    <h1 className="text-2xl font-bold">Tissue Paper</h1>
                    <h2 className="text-xl font-bold mb-4">Login to Tissue</h2>
                    <div className="space-y-4">
                        <Input
                            type="password"
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

    const api = createApiClient(token);

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Tissue Paper</h1>
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

                <div className="space-y-8">
                    <CheckinForm
                        api={api}
                        onError={setError}
                        onSuccess={handleCheckinSuccess}
                    />

                    <CheckinHistory
                        key={refreshTrigger}
                        api={api}
                        onError={setError}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
