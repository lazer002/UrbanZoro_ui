import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order || {};

  const {
    items = [],
    shippingAddress = {},
    subtotal = 0,
    shipping = 0,
    total = 0,
    orderNumber,
  } = order;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 space-y-8">

        {/* SUCCESS HEADER */}
        <div className="flex items-center gap-4 border-b pb-6">
          <CheckCircle className="text-green-600 w-10 h-10" />
          <div>
            <h1 className="text-2xl font-semibold">Order Confirmed</h1>
            <p className="text-gray-600 text-sm">
              Thank you! Your order has been placed successfully.
            </p>
            {orderNumber && (
              <p className="text-sm mt-1 text-gray-500">
                Order Number: <span className="font-medium">{orderNumber}</span>
              </p>
            )}
          </div>
        </div>

        {/* ITEMS */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>

          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="flex gap-4 border rounded-lg p-4">
                <img
                  src={item.mainImage || "/placeholder.jpg"}
                  className="w-16 h-16 rounded object-cover border"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>

                  {item.variant && (
                    <p className="text-sm text-gray-500">
                      Variant: {item.variant}
                    </p>
                  )}

                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="font-medium">
                  ₹{item.total?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SHIPPING INFO */}
        <div className="grid md:grid-cols-2 gap-6 border-t pt-6">

          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-sm text-gray-600">
              {shippingAddress.firstName} {shippingAddress.lastName}
            </p>
            <p className="text-sm text-gray-600">
              {shippingAddress.address}
            </p>
            <p className="text-sm text-gray-600">
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zip}
            </p>
            <p className="text-sm text-gray-600">
              {shippingAddress.phone}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Payment Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-black mt-2">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Continue Shopping
          </button>

          <button
            onClick={() =>
              navigate(`/trackorder?orderNumber=${orderNumber}`)
            }
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Track Order
          </button>
        </div>

      </div>
    </div>
  );
}