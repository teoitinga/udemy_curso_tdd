module.exports = (app) => {
    const create = async (req, res) => {
        const response = await app.services.accounts.save(req.body);

        if (response.error) {
            return res.status(400).json(response)
        }

        return res.status(201).json(response[0])

    }

    return { create }
}