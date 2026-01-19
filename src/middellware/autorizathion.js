const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    let { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: "No autorizado" });
    }
    try {
        let token = authorization.split(" ")[1];
        let type = authorization.split(" ")[0].toLowerCase();
        if (token && type === "bearer") {
            let payload = jwt.verify(token, process.env.SECRET);
            console.log("contenido del token", payload);
            req.usuario = payload.usuario;
            next();
        } else {
            return res.status(401).json({ message: "Token inválido" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};