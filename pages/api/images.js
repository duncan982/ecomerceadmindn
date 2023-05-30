// pages/api/images.js

import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { filename } = req.query;
  const filePath = path.join(process.cwd(), "uploads", filename);

  try {
    const fileData = fs.readFileSync(filePath);
    res.status(200).send(fileData);
  } catch (error) {
    res.status(404).send("Image not found");
  }
}
