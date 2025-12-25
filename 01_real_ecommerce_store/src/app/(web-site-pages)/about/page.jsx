import Head from "next/head";

export default function About() {
  return (
    <>
      <Head>
        <title>About Me | Portfolio</title>
      </Head>

      <section className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            About <span className="text-blue-500">Me</span>
          </h1>

          <p className="text-gray-400 text-center max-w-3xl mx-auto mb-14">
            Passionate frontend developer focused on building modern, responsive,
            and user-friendly web applications.
          </p>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Who I Am
              </h2>

              <p className="text-gray-300 leading-relaxed mb-4">
                I am a dedicated frontend developer with strong skills in
                HTML, CSS, JavaScript, React, and Tailwind CSS.
                I love transforming ideas into interactive and
                visually appealing digital experiences.
              </p>

              <p className="text-gray-300 leading-relaxed">
                My goal is to continuously improve my skills,
                follow modern development practices, and build
                products that deliver real value to users.
              </p>
            </div>

            {/* Right */}
            <div className="bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">
                Skills & Technologies
              </h3>

              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <span>✔ HTML5 & CSS3</span>
                <span>✔ JavaScript (ES6+)</span>
                <span>✔ React & Next.js</span>
                <span>✔ Tailwind CSS</span>
                <span>✔ Responsive Design</span>
                <span>✔ API Integration</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
