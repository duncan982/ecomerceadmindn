import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Products";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  if (method === "GET") {
    if (req.query?.productId) {
      res.json(await Product.findById(req.query.productId));
    } else {
      res.json(await Product.find());
    }
  }
  if (method === "POST") {
    const { title, description, price } = req.body;
    const productDoc = await Product.create({ title, description, price });
    productDoc.save();
    res.json(productDoc);
  }
}
