import { summarizerService } from "../services/summarizer.service.js";

const handleGetSummarizations = async (req, res) => {
    try {
        const result = await summarizerService.handleGetSummarizationsFromDB(req.query.email);
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send({ message: err.message || "Internal Server error", err })
    }
};

const handleGetSummarizationById = async (req, res) => {
    try {
        const result = await summarizerService.handleGetSummarizationByIdFromDB(req.params.id, req.user.email);
        if (!result) {
            return res.status(404).json({ message: "Material not found." });
        };
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send({ message: err.message || "server error occurred", err })
    }
};

const handleDeleteSummarizations = async (req, res) => {
    try {
        const result = await summarizerService.handleDeleteSummarizationFromDB(req.params.id, req.user.email);
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send({ message: err.message || "Internal Server error", err })
    }
}

export const summarizerControllers = {
    handleGetSummarizations,
    handleGetSummarizationById,
    handleDeleteSummarizations
}