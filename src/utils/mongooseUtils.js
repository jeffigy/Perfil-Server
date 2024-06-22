const setToJSONTransform = (schema) => {
  schema.set("toJSON", {
    transform: (_document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
      delete returnedObject.password;
    },
  });
};

module.exports = { setToJSONTransform };
