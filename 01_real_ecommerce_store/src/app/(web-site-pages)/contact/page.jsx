import Head from "next/head";

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact | Portfolio</title>
      </Head>

      <section className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Contact <span className="text-blue-500">Me</span>
          </h1>

          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-14">
            Have a project, idea, or question?
            Feel free to reach out — I’d love to connect with you.
          </p>

          <div className="grid md:grid-cols-2 gap-12">

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Get in Touch
              </h2>

              <p className="text-gray-300 mb-6">
                I’m open to freelance projects, internships,
                and collaboration opportunities.
              </p>

              <div className="space-y-4 text-gray-300">
                <p>📧 Email: yourname@email.com</p>
                <p>📍 Location: Pakistan</p>
                <p>💼 Role: Frontend Developer</p>
              </div>
            </div>

            {/* Form */}
            <form className="bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6">
              <div>
                <label className="block mb-2 text-sm">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Message</label>
                <textarea
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                Send Message
              </button>
            </form>

          </div>
        </div>
      </section>
    </>
  );
}
