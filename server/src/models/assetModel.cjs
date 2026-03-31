const crypto = require('crypto')
const { db } = require('../db/database.cjs')
const { nowIso } = require('../utils/time.cjs')

const createStmt = db.prepare(`
  INSERT INTO assets (
    id, user_id, title, type, encrypted_details, encrypted_financial_data,
    file_name_encrypted, file_mime_type, file_storage_key, file_size,
    file_cipher_meta, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)
const findByIdStmt = db.prepare('SELECT * FROM assets WHERE id = ?')
const findByFileStmt = db.prepare('SELECT * FROM assets WHERE file_storage_key = ?')
const listByUserStmt = db.prepare(`
  SELECT * FROM assets
  WHERE user_id = ?
  ORDER BY datetime(updated_at) DESC, datetime(created_at) DESC
`)
const deleteByUserStmt = db.prepare('DELETE FROM assets WHERE user_id = ?')

function createAsset(payload) {
  const id = crypto.randomUUID()
  const timestamp = nowIso()
  createStmt.run(
    id,
    payload.userId,
    payload.title,
    payload.type,
    payload.encryptedDetails,
    payload.encryptedFinancialData || null,
    payload.fileNameEncrypted || null,
    payload.fileMimeType || null,
    payload.fileStorageKey || null,
    payload.fileSize || null,
    payload.fileCipherMeta || null,
    timestamp,
    timestamp,
  )

  return findById(id)
}

function findById(id) {
  return findByIdStmt.get(id) || null
}

function findByFileStorageKey(storageKey) {
  return findByFileStmt.get(storageKey) || null
}

function listByUser(userId) {
  return listByUserStmt.all(userId)
}

function deleteByUser(userId) {
  deleteByUserStmt.run(userId)
}

module.exports = { createAsset, findById, findByFileStorageKey, listByUser, deleteByUser }
