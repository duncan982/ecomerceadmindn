import { useRouter } from "next/router";
import React, { useState } from "react";

const ProductForm = ({
  title: existingtitle,
  description: existingdescription,
  price: existingprice,
}) => {
  const router = useRouter;
  const [title, setTitle] = useState(existingtitle || "");
  const [description, setDescription] = useState(existingdescription || "");
  const [price, setPrice] = useState(existingprice || "");
  const [goToProducts, setGoToProducts] = useState(false);

  const createProduct = async (event) => {
    event.preventDefault();
    const data = { title, description, price };
    await axios.post("/api/products", data);
    setGoToProducts(true);
  };

  if (goToProducts) {
    router.push("/products");
  }

  return (
    <form onSubmit={createProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in Kshs)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button className="btn-primary" type="submit">
        Save
      </button>
    </form>
  );
};

export default ProductForm;
