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
    const { title, description, price, images } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
    });
    productDoc.save();
    res.json(productDoc);
  }

  if (method === "PUT") {
    const { title, description, price, _id, images } = req.body;
    console.log("PUT: images", images);
    await Product.updateOne({ _id }, { title, description, price, images });
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.productId) {
      await Product.deleteOne({ _id: req.query?.productId });
      res.json(true);
    }
  }
}
