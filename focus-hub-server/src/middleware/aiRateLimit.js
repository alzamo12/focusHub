import { getCollection } from "../config/db.js";

export const aiRateLimit = async (req, res, next) => {
    const aiRequestLimitsCollection = await getCollection("ai_request_limits");
    try {
        const { email } = req.user;
        const BLOCK_TIME = 30 * 1000; // 5 minutes
        const now = new Date();

        const record = await aiRequestLimitsCollection.findOne({ email });

        if (!record) {
            await aiRequestLimitsCollection.insertOne({
                email,
                lastRequestAt: now,
                blockedUntil: new Date(now.getTime() + BLOCK_TIME)
            });

            return next()
        };

        if (now < new Date(record.blockedUntil)) {
            const waitSeconds = Math.ceil(
                (new Date(record.blockedUntil) - now) / 1000
            );

            return res.status(429).send({
                message: `Please wait ${waitSeconds} seconds before requesting again.`,
                retryAfter: waitSeconds
            });
        };

        await aiRequestLimitsCollection.updateOne(
            { email },
            {
                $set: {
                    lastRequestAt: now,
                    blockedUntil: new Date(now.getTime() + BLOCK_TIME)
                }
            }
        );

        next()
    } catch (err) {
        console.log("Internal server error", err)
        res.status(500).send({ message: "Internal server error" })
    }
}