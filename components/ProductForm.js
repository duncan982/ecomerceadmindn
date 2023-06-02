import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Spinner from "./Spinner";

const ProductForm = ({
  _id,
  title: existingtitle,
  description: existingdescription,
  price: existingprice,
  images: existingimages,
}) => {
  const router = useRouter();
  const [title, setTitle] = useState(existingtitle || "");
  const [description, setDescription] = useState(existingdescription || "");
  const [price, setPrice] = useState(existingprice || "");
  const [images, setImages] = useState(existingimages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const saveProduct = async (event) => {
    event.preventDefault();
    const data = { title, description, price, images };
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
      console.log("response:", response);
      setImages((oldimages) => {
        oldimages.push(response.secure_url);
        // remove duplicate images
        const uniqeOldImages = [...new Set(oldimages)];
        return uniqeOldImages;
      });
      setIsUploading(false);
    }
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
      <label>Photos</label>
      <div className="mb-2 max-w-full h-auto flex flex-wrap gap-2">
        {!!images?.length &&
          images.map((path) => (
            <Image
              key={path}
              src={path}
              alt={path}
              width={100}
              height={100}
              className="aspect-w-16 aspect-h-9 rounded-lg"
            ></Image>
          ))}
        {isUploading && (
          <div className="h-24">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 text-center cursor-pointer flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
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
          <div>Upload</div>
          <input
            type="file"
            name="file"
            onChange={uploadImages}
            className="hidden"
          />
        </label>
        {/* <div>{!images?.length && <div>No photos for this product</div>}</div> */}

        {/* {uploadedImages?.length > 0 && (
          <div>
            <p>Uploaded Images:</p>
            <ul>
              {uploadedImages.map((imageUrl, index) => (
                <li key={index}>
                  <Image src={imageUrl} alt={`Uploaded Image ${index + 1}`} />
                </li>
              ))}
            </ul>
          </div>
        )} */}
        {/* {selectedImage && ( */}
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
