import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [properties, setProperties] = useState([]);

  const fetchCategories = () => {
    axios.get("/api/categories/").then((result) => {
      setCategories(result.data);
    });
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const editCategory = (category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  };

  const deleteCategory = (category) => {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category?.name}?`,
        showCancelButton: true,
        cancelButton: "Cancel",
        confirmButtonText: "Yes, Delete",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  };

  const addProperty = () => {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  };
  const handlePropertyNameChange = (index, newName) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };
  const handlePropertyValuesChange = (index, newValue) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValue;
      return properties;
    });
  };

  const removeProperty = (indexToRemove) => {
    setProperties((prev) => {
      return [...prev].filter((properties, propertiesIndex) => {
        return propertiesIndex !== indexToRemove;
      });
    });
  };

  const saveCategory = async (ev) => {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  };
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory?.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            onChange={(ev) => {
              setName(ev.target.value);
            }}
            value={name}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">No Parent Category</option>
            {categories.length > 0 &&
              categories.map((category) => {
                return (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => {
              return (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    className="mb-0"
                    type="text"
                    value={property.name}
                    onChange={(ev) =>
                      handlePropertyNameChange(index, ev.target.value)
                    }
                    placeholder="property name (example: colour)"
                  />
                  <input
                    className="mb-0"
                    type="text"
                    value={property.values}
                    onChange={(ev) =>
                      handlePropertyValuesChange(index, ev.target.value)
                    }
                    placeholder="value, comma separated"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      removeProperty(index);
                    }}
                    className="btn-red"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
        </div>
        <div className="flex gap-1">
          {/* {!editedCategory && ( */}
          <button
            type="button"
            className="btn-default"
            onClick={() => {
              setEditedCategory(null);
              setName("");
              setParentCategory("");
              setProperties([]);
            }}
          >
            Cancel
          </button>
          {/* )} */}

          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => {
                return (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category.parent?.name}</td>
                    <td>
                      <button
                        onClick={() => {
                          editCategory(category);
                        }}
                        className="btn-default mr-1"
                      >
                        Edit
                      </button>
                      <button
                        className="btn-red"
                        onClick={() => {
                          deleteCategory(category);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
