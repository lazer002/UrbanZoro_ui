// src/components/RecentlyViewed.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "recently_viewed_products";
const MAX_ITEMS = 8;

export default function RecentlyViewed({ currentProduct }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!currentProduct?._id) return;

    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    const product = {
      _id: currentProduct._id,
      publicId: currentProduct.publicId,
      title: currentProduct.title,
      price: currentProduct.price,
      oldPrice: currentProduct.oldPrice,
      images: currentProduct.images || [],
      onSale: currentProduct.onSale,
      isNewProduct: currentProduct.isNewProduct,
      isOutOfStock: currentProduct.isOutOfStock,
    };

    const filtered = stored.filter(
      (item) => String(item._id) !== String(product._id)
    );

    const updated = [
      product,
      ...filtered,
    ].slice(0, MAX_ITEMS);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    setProducts(
      updated.filter(
        (item) =>
          String(item._id) !==
          String(currentProduct._id)
      )
    );
  }, [currentProduct]);

  if (!products.length) return null;

  return (
 <section className="mt-6 md:mt-14 px-4 md:px-6 pb-16">
  <div className="max-w-auto mx-auto">

    {/* Header */}
    <div className="flex items-end justify-between mb-8 md:mb-10">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-2">
          Your Journey
        </p>

        <h2 className="text-2xl md:text-5xl font-bold tracking-tight text-black">
          Recently Viewed
        </h2>
      </div>

      {products.length > 0 && (
        <button
          onClick={() => {
            localStorage.removeItem("recently_viewed_products");
            setRecentlyViewedProducts([]);
          }}
          className="
            hidden md:flex
            items-center
            text-sm
            font-medium
            text-neutral-700
            hover:text-black
            transition
          "
        >
          Clear History →
        </button>
      )}
    </div>

    {products.length ? (
      <div
        className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-4
          md:gap-6
        "
      >
        {products.map((prod) => (
          <article
            key={prod._id}
            role="button"
            tabIndex={0}
            onClick={() =>
              navigate(`/product/${prod.publicId}`)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/product/${prod.publicId}`);
              }
            }}
            className="
              group
              cursor-pointer
            "
          >
            {/* IMAGE */}
            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                bg-neutral-100
                aspect-[3/4]
                shadow-sm
                transition-all
                duration-500
                group-hover:shadow-2xl
              "
            >
              <img
                src={
                  prod.images?.[0] ||
                  "/images/placeholder.png"
                }
                alt={prod.title}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-110
                "
              />

              {/* Gradient */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/75
                  via-black/20
                  to-transparent
                "
              />

              {/* STATUS */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {prod.isOutOfStock ? (
                  <span
                    className="
                      bg-black/80
                      backdrop-blur-md
                      text-white
                      text-[10px]
                      font-bold
                      tracking-[0.15em]
                      uppercase
                      px-3
                      py-1.5
                      rounded-full
                    "
                  >
                    Sold Out
                  </span>
                ) : (
                  <>
                    {prod.onSale && (
                      <span
                        className="
                          bg-white/90
                          backdrop-blur-md
                          text-black
                          text-[10px]
                          font-bold
                          tracking-[0.15em]
                          uppercase
                          px-3
                          py-1.5
                          rounded-full
                        "
                      >
                        Sale
                      </span>
                    )}

                    {prod.isNewProduct && (
                      <span
                        className="
                          bg-black/80
                          backdrop-blur-md
                          text-white
                          text-[10px]
                          font-bold
                          tracking-[0.15em]
                          uppercase
                          px-3
                          py-1.5
                          rounded-full
                        "
                      >
                        New
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* PRICE */}
              <div
                className="
                  absolute
                  top-3
                  right-3
                  bg-white/90
                  backdrop-blur-md
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  md:text-sm
                  font-semibold
                "
              >
                ₹{Number(prod.price ?? 0).toLocaleString("en-IN")}
              </div>

              {/* CONTENT */}
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  p-4
                  md:p-5
                  text-white
                "
              >
                <h3
                  className="
                    text-sm
                    md:text-lg
                    font-semibold
                    line-clamp-2
                  "
                >
                  {prod.title}
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    md:text-sm
                    text-white/70
                  "
                >
                  Premium Collection
                </p>

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div className="flex items-center gap-2">
                    {prod.oldPrice &&
                      Number(prod.oldPrice) >
                        Number(prod.price) && (
                        <span
                          className="
                            text-xs
                            md:text-sm
                            text-white/50
                            line-through
                          "
                        >
                          ₹
                          {Number(
                            prod.oldPrice
                          ).toLocaleString("en-IN")}
                        </span>
                      )}

                    <span
                      className="
                        text-xs
                        md:text-sm
                        text-white/90
                      "
                    >
                      Inclusive of taxes
                    </span>
                  </div>

                  <span
                    className="
                      opacity-0
                      translate-x-3
                      group-hover:opacity-100
                      group-hover:translate-x-0
                      transition-all
                      duration-300
                      text-sm
                      font-medium
                    "
                  >
                    View →
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    ) : (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-neutral-300
          py-20
          text-center
        "
      >
        <p className="text-neutral-500">
          Products you view will appear here.
        </p>
      </div>
    )}

    {/* MOBILE CLEAR */}
    {products.length > 0 && (
      <button
        onClick={() => {
          localStorage.removeItem(
            "recently_viewed_products"
          );
          setRecentlyViewedProducts([]);
        }}
        className="
          md:hidden
          mt-5
          w-full
          py-3
          rounded-xl
          border
          border-neutral-200
          text-sm
          font-medium
          text-neutral-600
          hover:text-black
          hover:border-black
          transition
        "
      >
        Clear Recently Viewed
      </button>
    )}
  </div>
</section>
  );
}