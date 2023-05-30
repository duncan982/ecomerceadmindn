// import multer from "multer";
// import path from "path";

// // Configure the storage options for multer.
// const storage = multer.diskStorage({
//   destination: "./public/uploads", // Set the destination folder for uploaded files
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const extension = path.extname(file.originalname);
//     const filename = file.fieldname + "-" + uniqueSuffix + extension;
//     cb(null, filename);
//   },
// });

// // Create a multer instance with the configured storage options
// const upload = multer({ storage });

// // the API endpoint route handler for file upload using multer.
// export default function handler(req, res) {
//   // Use the `upload` middleware to process the file upload
//   upload.single("file")(req, res, (err) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: "Something went wrong" });
//     }

//     // File upload successful
//     // Access the uploaded file using `req.file`
//     const { filename, path } = req.file;
//     // Perform any necessary actions with the file data

//     // Send a response back to the client
//     res.status(200).json({
//       message: "File uploaded successfully",
//       filename: filename,
//       path: path,
//     });
//   });
// }

import fs from "fs";
import path from "path";
import { promisify } from "util";
import formidable from "formidable";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    // if (req.method === "POST" || req.method === "PUT") {
    const form = new formidable.IncomingForm();
    const uploadDir = path.join(process.cwd(), "/public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    form.uploadDir = uploadDir;

    const parseForm = promisify(form.parse.bind(form));

    try {
      const { fields, files } = await parseForm(req);
      // console.log("files:", Object.keys(files));

      // const uploadedFile = files.file;
      // const newFilename = uploadedFile.newFilename;
      const newFilePath = path.join(uploadDir, files.file.newFilename);
      fs.renameSync(uploadedFile.path, newFilePath);

      res.status(200).json({
        message: "File uploaded successfully",
        newFilename: newFilename,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
