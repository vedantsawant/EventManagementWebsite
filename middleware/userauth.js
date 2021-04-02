function auth(req, res, next){
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({errorMessage:"Unautorized"});
        }
    } catch (error) {
        console.error(err);
        res.status(401).json({errorMessage:"Unautorized"});
    }
}

module.exports = auth;