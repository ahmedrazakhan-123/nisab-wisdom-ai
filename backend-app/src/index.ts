import express from "express";
import cors from "cors";
import zakatRouter from "./routes/zakat";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/zakat", zakatRouter);

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});