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
      parseForm(req).then();
      // console.log("files:", Object.keys(files));

      // const uploadedFile = files.file;
      // const newFilename = uploadedFile.newFilename;
      const newFilePath = path.join(uploadDir, `${files.file.newFilename}.png`);
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
