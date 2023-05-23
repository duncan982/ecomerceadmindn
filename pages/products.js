import React from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
const Products = () => {
  return (
    <Layout>
      <Link
        href={"/products/new"}
        className="bg-blue-900 text-white rounded-md  py-1 px-2"
      >
        Add new product
      </Link>
    </Layout>
  );
};

export default Products;
