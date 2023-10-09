'use strict'
const crypto = require('crypto')
const { SM3 } = require('gm-crypto')
const utils = require('./utils')

function xorBuffers(a, b) {
  if (!Buffer.isBuffer(a)) {
    throw new TypeError('first argument must be a Buffer')
  }
  if (!Buffer.isBuffer(b)) {
    throw new TypeError('second argument must be a Buffer')
  }
  if (a.length !== b.length) {
    throw new Error('Buffer lengths must match')
  }
  if (a.length === 0) {
    throw new Error('Buffers cannot be empty')
  }
  return Buffer.from(a.map((_, i) => a[i] ^ b[i]))
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest();
}

function hmacSha256(key, msg) {
  return crypto.createHmac('sha256', key).update(msg).digest();
}

// Generate a Key based on openGauss jdbc driver (PBKDF2WithHmacSHA1)
// org.postgresql.util.MD5Digest.generateKFromPBKDF2
function generateKeyFromPBKDF2(password, random64code, server_iteration) {
    var random32code = Buffer.from(random64code,'hex');
    return crypto.pbkdf2Sync(password, random32code, server_iteration, 32, 'sha1');
}

// Deprecated function for convert buffer to hex string
// use buffer.toString('hex') instead
function buf2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

// Core function to get the password hash for openGauss
const postgresSha256PasswordHash = function (password, random64code, token, server_iteration, isSM3) {
  if (typeof password !== 'string') {
      throw new Error('RFC5802-Art_Chen: client password must be a string')
  }

  var key = generateKeyFromPBKDF2(password, random64code, server_iteration)
  var clientKey = hmacSha256(key, 'Client Key')
  var storedKey = isSM3 ? Buffer.from(SM3.digest(clientKey)) : sha256(clientKey);
  var hmac_result = hmacSha256(storedKey, Buffer.from(token,'hex'));
  var h = xorBuffers(hmac_result, clientKey);

  return h.toString('hex'); // We can use toString instead of our buf2hex
}

const postgresMd5Sha256PasswordHash = function (password, random64code, md5Salt) {
  if (typeof password !== 'string') {
    throw new Error('RFC5802-Art_Chen: client password must be a string')
  }

  var key = generateKeyFromPBKDF2(password, random64code, 2048);
  var serverKey = hmacSha256(key, 'Sever Key')
  var clientKey = hmacSha256(key, 'Client Key')
  var storedKey = sha256(clientKey);
  var encryptString = random64code + serverKey.toString('hex') + storedKey.toString('hex');

  var digest = utils.md5(Buffer.concat([Buffer.from(encryptString, 'hex'), md5Salt]));

  return 'md5' + digest;
}

module.exports = {
  postgresSha256PasswordHash,
  postgresMd5Sha256PasswordHash
}
