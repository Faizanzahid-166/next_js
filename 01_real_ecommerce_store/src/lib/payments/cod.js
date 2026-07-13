// handleCODPayment.js
export async function handleCODPayment(order) {
  if (!order) throw new Error("Order is required");

  // Use the delivery charge from order schema, fallback to 300 if not set
  const deliveryFee = order.pricing?.deliveryCharge || 300;

  // Make sure delivery fee > 0
  if (deliveryFee <= 0) {
    throw new Error("Delivery fee must be greater than zero for COD orders");
  }

  return {
    success: true,
    message: "Order placed. Please pay the delivery fee using one of the following methods.",
    data: {
      orderId: order.id,
      deliveryFee,
      paymentMethods: [
        {
          type: "EasyPaisa",
          number: "0335-5838659",
          accountName: "Muhammad Faizan Zahid",
          instructions: "Send the delivery fee via EasyPaisa to this number."
        },
        // {
        //   type: "Meezan Bank",
        //   name: "Meezan Bank",
        //   accountNumber: "123456789",
        //   accountTitle: "Your Store Name",
        //   instructions: "Deposit the delivery fee to this bank account."
        // }
      ],
         requireProofUpload: true // frontend knows user must upload image
    }
  };
}
