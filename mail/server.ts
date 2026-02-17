import express from "express";
import cors from "cors";
import { sendMail } from "./serverMail";

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send', async (req: express.Request, res: express.Response) => {
    try {
        await sendMail();
        res.status(200).json({ ok: true, message: "Correo enviado correctamente" });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        console.error("Error enviando correo:", error);
        res.status(500).json({ ok: false, error: errorMessage });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})