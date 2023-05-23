import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProduct() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState(null);
  // console.log(router);
  const { productId } = router.query;
  useEffect(() => {
    if (!productId) {
      return;
    }
    axios
      .get("/api/products?productId=" + productId)
      .then((res) => setProductInfo(res.data));
  }, [productId]);
  return (
    <Layout>
      <h1>Edit Product</h1>
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
}
