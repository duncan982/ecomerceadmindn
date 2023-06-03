import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  if (method === "POST") {
    const { name } = req.body;
    console.log("req.body:", req.body);
    const categoryDoc = await Category.create({ name });
    categoryDoc.save();
    res.json(categoryDoc);
  }
}
