import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProduct() {
  const router = useRouter();
  const { productId } = router.query;
  const [productInfo, setProductInfo] = useState();
  useEffect(() => {
    if (!productId) {
      return;
    } else {
      axios.get("/api/products?productId=" + productId).then((res) => {
        setProductInfo(res.data);
      });
    }
  }, [productId]);
  const goBack = () => {
    router.push("/products");
  };
  const deleteProduct = async () => {
    await axios.delete("/api/products?productId=" + productId);
    goBack();
  };
  return (
    <Layout>
      <h1 className="text-center">
        Do you really want to delete product &nbsp; "{productInfo?.title}"?
      </h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteProduct}>
          Yes
        </button>
        <button className="btn-default" onClick={goBack}>
          No
        </button>
      </div>
    </Layout>
  );
}
