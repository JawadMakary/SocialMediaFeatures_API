const crypto = require("crypto");
const algorithm = process.env.ALGORITHM;
// official implementation of crypto
const initVector = crypto.randomBytes(16);
const SecurityKey = crypto.randomBytes(32);

exports.encrypt_DecryptData = (field, action) => {
  if (action === "encrypt") {
    // cipher: algorithm for encryption, key: key for encryption, iv: initialization vector
    const cipher = crypto.createCipheriv(algorithm, SecurityKey, initVector);
    // utf8: encoding for string
    // output as hexadecimal:
    let encrypted = cipher.update(field, "utf-8", "hex");
    // when final is called, we can't use the same cipher again (it's already used)
    encrypted += cipher.final("hex");
    return encrypted;
  } else if (action === "decrypt") {
    const decipher = crypto.createDecipheriv(
      algorithm,
      SecurityKey,
      initVector
    );
    let decrypted = decipher.update(field, "hex", "utf-8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
};
