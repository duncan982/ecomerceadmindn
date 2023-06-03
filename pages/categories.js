import Layout from "@/components/Layout";
import axios from "axios";
import { useState } from "react";

export default function Categories() {
  const [name, setName] = useState("");
  const saveCategory = async (ev) => {
    ev.preventDefault();
    const response = await axios.post("/api/categories", { name });
    console.log("response:", response);
    setName("");
  };
  return (
    <Layout>
      <h1>Categories</h1>
      <label>New category name</label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          type="text"
          placeholder="Category name"
          className="mb-0"
          onChange={(ev) => {
            setName(ev.target.value);
          }}
          value={name}
        />
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
    </Layout>
  );
}
