import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

const ProductForm = ({
  _id,
  title: existingtitle,
  description: existingdescription,
  price: existingprice,
  images: existingimages,
  category: assignedcategory,
  properties: assignedProperties,
}) => {
  const router = useRouter();
  const [title, setTitle] = useState(existingtitle || "");
  const [description, setDescription] = useState(existingdescription || "");
  const [price, setPrice] = useState(existingprice || "");
  const [images, setImages] = useState(existingimages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(assignedcategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  useEffect(() => {
    axios.get("/api/categories").then((result) => setCategories(result.data));
  }, []);
  const saveProduct = async (event) => {
    event.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  };
  if (goToProducts) {
    router.push("/products");
  }
  const uploadImages = async (ev) => {
    ev.preventDefault();
    const formData = new FormData();
    const files = ev.target.files;
    if (files.length > 0) {
      setIsUploading(true);
      for (const file of files) {
        formData.append("file", file);
      }
      formData.append("upload_preset", "nextjs-image-uploads-tutorial");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dz4hadpmw/image/upload",
        {
          method: "POST",
          body: formData,
        }
      ).then((r) => r.json());
      // console.log("response:", response);
      setImages((oldimages) => {
        oldimages.push(response.secure_url);
        // remove duplicate images
        const uniqeOldImages = [...new Set(oldimages)];
        return uniqeOldImages;
      });
      setIsUploading(false);
    }
  };

  const upDateImagesOrder = (pics) => {
    setImages(pics);
  };

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let categoryInfo = categories.find(({ _id }) => _id === category);
    // console.log(categoryInfo);
    propertiesToFill.push(...categoryInfo.properties);
    while (categoryInfo?.paremt?._id) {
      const parentCategory = categories.find(
        ({ _id }) => _id === categoryInfo?.paremt?._id
      );
      propertiesToFill.push(parentCategory.properties);
      categoryInfo = parentCategory;
    }
  }

  const setProductProp = (propName, value) => {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  };

  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorised</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => {
          return (
            <div key={p._id} className="">
              <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
              <div>
                <select
                  value={productProperties[p.name]}
                  onChange={(ev) => {
                    setProductProp(p.name, ev.target.value);
                  }}
                >
                  {p.values.map((v) => {
                    return (
                      <option key={p._id + v} value={v}>
                        {v}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          );
        })}
      <label>Photos</label>
      <div className="mb-2 max-w-full h-auto flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap1"
          setList={upDateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
                style={{ flex: "0 0 calc(33.33% - 1rem)" }} // Adjust the width of each image container
              >
                <img
                  src={link}
                  alt=""
                  className="rounded-lg object-contain h-full w-full"
                />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 text-center cursor-pointer flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-lg bg-white shadow-sm border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add images</div>
          <input
            type="file"
            name="file"
            onChange={uploadImages}
            className="hidden"
          />
        </label>
      </div>
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
