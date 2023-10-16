module.exports = (app) => {
    const findAll = (req, res) => {
        app.services.user.findAll().then(result => {
            res.status(200).json(result)

        })
    };

    const create = async (req, res) => {
        const response = await app.services.user.save(req.body)
        .then(result =>{
            return result
        });

        if (response.error) {
            return res.status(400).json(response)
        }

        return res.status(201).json(response[0])

    }

    return { findAll, create }
}