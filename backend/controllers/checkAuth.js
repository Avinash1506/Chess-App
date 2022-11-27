const jwt = require("jsonwebtoken");

module.exports.isNotAuthorized = (req, res, next) => {
    if(req.headers['Authorization']) {
        return res.send({message: "failure", reason: "already logged in"});
    }

    return next();
}

module.exports.verifyToken = (req, res, next) => {
    //get token from header of req object
    let tokenWithBearer = req.headers["authorization"];

    //if token is there then
    if (tokenWithBearer) {
      if (tokenWithBearer.startsWith("Bearer ")) {
        //remove first 7 characters
        let token = tokenWithBearer.slice(7, tokenWithBearer.length);
        //verify the token
        // console.log("Toekn is ", token);
        jwt.verify(token, "avi314299", (err, user) => {
          if (err) {
            console.log(err);
            return res.send({ message: "Session Expired" });
          } else {
            req.username = user.username;
            return next();
          }
        });
      }
    }
    //if token is not there then
    else {
      return res.send({ message: "Unauthorized access" });
    }
};