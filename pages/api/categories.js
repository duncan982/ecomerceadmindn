import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  if (method === "GET") {
    // console.log("req.body:", req.body);
    res.json(await Category.find().populate("parent"));
  }
  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    // const { name } = req.body;
    // console.log("req.body:", req.body);
    // const categoryDoc = await Category.create({ name });
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties,
    });
    categoryDoc.save();
    res.json(categoryDoc);
  }
  if (method === "PUT") {
    const { name, parentCategory, properties, _id } = req.body;
    // const { name } = req.body;
    // console.log("req.body:", req.body);
    // const categoryDoc = await Category.create({ name });
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategory || undefined,
        properties,
      }
    );
    // categoryDoc.save();
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id: _id });
    res.json("ok");
  }
}
