const jwt = require("jsonwebtoken");

const createJSONWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be a non empty object!");
  }
  if (typeof secretKey !== "string" || secretKey === "") {
    throw new Error("Secret Key must be a non empty String!");
  }
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    console.error("Failed to sign the JWT:", error);
    throw error;
  }
};

module.exports = { createJSONWebToken };
