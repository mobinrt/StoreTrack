/**
 * Map a Mongoose document to API response JSON
 * @param {Object} doc 
 * @param {String} customIdField 
 * @returns {Object}
 */
function formatDoc(doc, customIdField) {
    if (!doc) return null;
    const obj = doc.toObject({ virtuals: true });
    return {
      _id: obj._id,
      [customIdField]: obj[customIdField],
      ...obj,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt
    };
  }
  
  /**
   * Map an array of documents
   */
  function formatDocs(docs, customIdField) {
    return docs.map(doc => formatDoc(doc, customIdField));
  }
  
  module.exports = { formatDoc, formatDocs };
  