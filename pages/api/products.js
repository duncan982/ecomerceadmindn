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

  if (method === "PUT") {
    const { title, description, price, _id } = req.body;
    await Product.updateOne({ _id }, { title, description, price });
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.productId) {
      await Product.deleteOne({ _id: req.query?.productId });
      res.json(true);
    }
  }
}
