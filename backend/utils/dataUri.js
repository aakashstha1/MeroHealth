import DataUriParser from "datauri/parser.js";
import path from "path";

// Function to convert a file buffer to a data URI
const getDataUri = (file) => {
  // Create an instance of DataURIParser
  const parser = new DataUriParser();

  // Get the file extension from the uploaded file's original name
  const extName = path.extname(file.originalname).toString();

  // Use the parser to format the file buffer into a data URI using the file extension
  return parser.format(extName, file.buffer);
};

export default getDataUri; // Export the function for use in other modules
