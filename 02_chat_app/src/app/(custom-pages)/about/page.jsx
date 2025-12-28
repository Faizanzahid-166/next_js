"use client"
import Head from "next/head";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="Learn more about our eCommerce platform" />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-center max-w-2xl">
          Welcome to our eCommerce platform! We are dedicated to providing a seamless,
          secure, and enjoyable online shopping experience for customers, while giving
          businesses the tools they need to grow and manage their products efficiently.
          Our goal is to make online buying and selling effortless for everyone.
        </p>
      </div>
    </>
  );
}
