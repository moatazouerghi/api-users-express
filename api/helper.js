
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  function hasRequiredFields(obj, fields) {
    return fields.every(field => obj[field]);
  }
  
  module.exports = {
    isValidEmail,
    hasRequiredFields
  };
  