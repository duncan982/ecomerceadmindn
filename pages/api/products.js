import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Products";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);
  if (method === "GET") {
    if (req.query?.productId) {
      res.json(await Product.findById(req.query.productId));
    } else {
      res.json(await Product.find());
    }
  }
  if (method === "POST") {
    const { title, description, price, images, category, properties } =
      req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
    });
    productDoc.save();
    res.json(productDoc);
  }

  if (method === "PUT") {
    const { title, description, price, _id, images, category, properties } =
      req.body;
    // console.log("PUT: images", images);
    await Product.updateOne(
      { _id },
      { title, description, price, images, category, properties }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.productId) {
      await Product.deleteOne({ _id: req.query?.productId });
      res.json(true);
    }
  }
}
