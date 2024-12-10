import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const API_BASE_URL = "https://shikorism.net/api";

// Token middleware
const authenticateToken = (
    req: express.Request,
    res: express.Response,
    next: express.Function
) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    next();
};

// Proxy all requests to the Tissue API
app.use(
    "/api",
    authenticateToken,
    async (req: express.Request, res: express.Response) => {
        try {
            const response = await axios({
                method: req.method,
                url: `${API_BASE_URL}${req.path}`,
                headers: {
                    Authorization: req.headers.authorization,
                    "Content-Type": "application/json",
                },
                data: req.body,
                params: req.query,
            });

            res.status(response.status).json(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                res.status(error.response.status).json(error.response.data);
            } else {
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});