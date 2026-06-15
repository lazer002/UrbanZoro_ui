import React, { useEffect, useMemo, useState } from "react";
import api from "@/utils/config";
import { useCart } from "@/state/CartContext";
import { toast } from "react-hot-toast";
const BuildYourLookPage = () => {
  const { addBundleToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [selectedProducts, setSelectedProducts] =
    useState([]);

  const [selectedSizes, setSelectedSizes] =
    useState({});

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get("/products");

      setProducts(
        Array.isArray(res.data?.items)
          ? res.data.items
          : []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await api.get("/categories");

      setCategories(
        Array.isArray(res.data?.categories)
          ? res.data.categories
          : []
      );
    } catch (error) {
      console.error(error);
    }
  }

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return products;
    }

    return products.filter(
      (product) =>
        product.category?._id === activeCategory
    );
  }, [products, activeCategory]);

const toggleProduct = (product) => {
  const exists = selectedProducts.some(
    (p) => p._id === product._id
  );

  // remove if already selected
  if (exists) {
    setSelectedProducts((prev) =>
      prev.filter((p) => p._id !== product._id)
    );
    return;
  }

  // limit to 3 products
  if (selectedProducts.length >= 3) {
    toast.error("You can select only 3 pieces");
    return;
  }

  // add product
  setSelectedProducts((prev) => [
    ...prev,
    product,
  ]);
};

  const subtotal = useMemo(() => {
    return selectedProducts.reduce(
      (sum, item) =>
        sum + Number(item.price || 0),
      0
    );
  }, [selectedProducts]);

  const discount = Math.round(subtotal * 0.1);

  const total = subtotal - discount;

  const handleAddLook = (a) => {
    if (!selectedProducts.length) return;

    const customBundle = {
      title: "My Custom Look",
      products: selectedProducts,
      price: total,
      custom: true,
    };

    addBundleToCart(
      customBundle,
      selectedSizes
    );
  };
  return (
    <div className="bg-white min-h-screen">
      {/* HERO */}
   <section className="border-b border-neutral-200">
  <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-14">
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
      <div>
        <p className="uppercase tracking-[0.35em] text-xs text-neutral-500">
          Personal Styling
        </p>

        <h1 className="mt-4 text-5xl md:text-7xl font-black tracking-tight leading-none">
          BUILD YOUR LOOK
        </h1>

        <p className="mt-5 max-w-2xl text-neutral-600 text-lg">
          Curate your outfit from our latest collection.
          Select sizes, mix pieces and unlock bundle savings.
        </p>
      </div>

      <div className="flex gap-12">
        <div>
          <div className="text-4xl font-black">
            {selectedProducts.length}
          </div>

          <div className="text-sm text-neutral-500 uppercase tracking-widest">
            Items
          </div>
        </div>

        <div>
          <div className="text-4xl font-black">
            10%
          </div>

          <div className="text-sm text-neutral-500 uppercase tracking-widest">
            Savings
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
        {/* CATEGORY BAR */}

      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md py-4 mb-10 border-b">
          <div className="flex gap-3 overflow-x-auto">
            <button
              onClick={() =>
                setActiveCategory("all")
              }
         className={`
pb-3
text-sm
uppercase
tracking-[0.2em]
border-b-2

${
  activeCategory === "all"
    ? "border-black text-black"
    : "border-transparent text-neutral-400"
}
`}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() =>
                  setActiveCategory(
                    category._id
                  )
                }
          className={`
pb-3
text-sm
uppercase
tracking-[0.2em]
border-b-2
transition-all

${
  activeCategory === category._id
    ? "border-black text-black"
    : "border-transparent text-neutral-400 hover:text-black"
}
`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-12">
          {/* PRODUCTS */}

          <div>
            {loading ? (
              <div className="text-center py-20">
                Loading...
              </div>
            ) : filteredProducts.length ===
              0 ? (
              <div className="text-center py-20">
                No products found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredProducts.map(
                  (product) => {
                    const selected =
                      selectedProducts.some(
                        (p) =>
                          p._id === product._id
                      );

                    return (
                      <div
                        key={product._id}
                        className="
                        group
                        overflow-hidden
                       bg-white
                        transition-all
                        duration-500
                        hover:-translate-y-1
                       
                      "
                      >
                        <div className="overflow-hidden">
                          <img
                            src={
                              product
                                .images?.[0]
                            }
                            alt={
                              product.title
                            }
                            className="
                            h-[360px]
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-[1.03]
                          "
                          />
                        </div>

                        <div className="p-6">
                          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                            {
                              product
                                .category
                                ?.name
                            }
                          </p>

                          <h3 className="font-bold text-xl mt-2">
                            {
                              product.title
                            }
                          </h3>

             <p className="mt-3 font-semibold">
  ₹
  {Number(
    product.price
  ).toLocaleString()}
</p>

{/* SIZE SELECTOR */}
<div className="mt-4 flex flex-wrap gap-2">
  {Object.entries(product.inventory || {})
    .filter(([_, qty]) => qty > 0)
    .map(([size]) => (
      <button
        key={size}
        type="button"
        onClick={() =>
          setSelectedSizes((prev) => ({
            ...prev,
            [product._id]: size,
          }))
        }
        className={`
          h-8
          px-3

          border

          text-xs
          font-medium

          transition-all

          ${
            selectedSizes[product._id] === size
              ? "bg-black text-white border-black"
              : "border-neutral-300 hover:border-black"
          }
        `}
      >
        {size}
      </button>
    ))}
</div>

<button
  disabled={!selectedSizes[product._id]}
  onClick={() => toggleProduct(product)}
  className={`
    mt-5

    w-full

    py-3

    border

    uppercase
    tracking-[0.15em]
    text-xs
    font-semibold

    transition-all

    ${
      !selectedSizes[product._id]
        ? "border-neutral-300 text-neutral-400 cursor-not-allowed"
        : selected
        ? "bg-black text-white border-black"
        : "border-black hover:bg-black hover:text-white"
    }
  `}
>
  {!selectedSizes[product._id]
    ? "Select Size"
    : selected
    ? "Added"
    : "Add To Look"}
</button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* SUMMARY */}

          <aside
            className="
              sticky
              top-24
              h-fit
              rounded-[32px]
              border
              bg-white
              p-6
              shadow-xl
            "
          >
         <div className="border-b pb-6">
  <p className="uppercase tracking-[0.25em] text-xs text-neutral-500">
    Styling Board
  </p>

  <h2 className="mt-3 text-3xl font-black">
    Your Look
  </h2>

  <p className="mt-2 text-neutral-500">
    {selectedProducts.length}/3 selected pieces
  </p>
</div>

            {/* Preview */}

 {/* Preview */}

<div className="mt-8 space-y-4">
  {selectedProducts.map((product) => (
    <div
      key={product._id}
      className="
        flex
        gap-4

        border-b
        pb-4
      "
    >
      <img
        src={product.images?.[0]}
        alt={product.title}
        className="
          w-20
          h-24

          object-cover
        "
      />

      <div className="flex-1">
        <p className="font-medium">
          {product.title}
        </p>

        <p className="text-sm text-neutral-500 mt-1">
          Size: {selectedSizes[product._id]}
        </p>

        <p className="mt-2 font-semibold">
          ₹{Number(product.price).toLocaleString()}
        </p>
      </div>

      <button
        onClick={() => {
          setSelectedProducts((prev) =>
            prev.filter(
              (p) => p._id !== product._id
            )
          );

          setSelectedSizes((prev) => {
            const copy = { ...prev };
            delete copy[product._id];
            return copy;
          });
        }}
        className="
          text-neutral-400
          hover:text-black
        "
      >
        ×
      </button>
    </div>
  ))}
</div>

            {/* Selected */}

            {/* <div className="space-y-4 mt-8 max-h-[300px] overflow-y-auto pr-2">
              {selectedProducts.map(
                (product) => (
                  <div
                    key={product._id}
                    className="border-b pb-4"
                  >
                    <div className="flex justify-between gap-3">
                      <p className="font-medium">
                        {
                          product.title
                        }
                      </p>

                      <p>
                        ₹
                        {product.price}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div> */}

           <div className=" pt-8 space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  ₹
                  {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>
                  Bundle Saving
                </span>
                <span>
                  -₹
                  {discount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-3xl font-black">
                <span>Total</span>

                <span>
                  ₹
                  {total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              disabled={
                !selectedProducts.length
              }
              onClick={handleAddLook}
            className="
  w-full

  mt-8

  bg-black
  text-white

  py-4

  uppercase
  tracking-[0.25em]
  text-xs
  font-semibold

  transition-all

  hover:opacity-90

  disabled:opacity-40
"
            >
              ADD LOOK TO CART
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BuildYourLookPage;