import Link from "next/link";
import { ArrowRight, Leaf, Zap, Heart, Shield } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <Leaf className="w-5 h-5 stroke-[1.5]" />,
      title: "Ethically Sourced",
      description:
        "Every material we use is responsibly and sustainably obtained. We believe great products should never come at a cost to the planet.",
    },
    {
      icon: <Zap className="w-5 h-5 stroke-[1.5]" />,
      title: "Built to Perform",
      description:
        "Our designs are obsessively tested in real-world conditions. We manufacture for durability, not just aesthetics.",
    },
    {
      icon: <Heart className="w-5 h-5 stroke-[1.5]" />,
      title: "Crafted with Care",
      description:
        "Each product passes through skilled hands. We partner with artisan manufacturers who share our commitment to quality.",
    },
    {
      icon: <Shield className="w-5 h-5 stroke-[1.5]" />,
      title: "Trusted by Thousands",
      description:
        "From Karachi to Lahore, our customers trust BLITZ for fast COD delivery, transparent EasyPaisa checkout, and genuine support.",
    },
  ];

  const team = [
    {
      name: "Muhammad Faizan Zahid",
      role: "Founder & Lead Developer",
      bio: "Full-stack developer and entrepreneur building modern e-commerce experiences with Next.js, Supabase, and MongoDB.",
      avatar: "FZ",
    },
    {
      name: "Design & Product Team",
      role: "Sourcing & Branding",
      bio: "A dedicated team committed to curating the best premium goods and crafting a seamless shopping experience for our customers.",
      avatar: "DP",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* HERO */}
      <section className="border-b border-border/40 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
              Our Story
            </span>
            <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-neutral-900 leading-[1.1]">
              Designed for people who care about the details.
            </h1>
            <p className="text-lg text-neutral-500 leading-relaxed max-w-xl">
              BLITZ was founded on a simple belief — that premium goods shouldn't be a luxury reserved
              for the few. We make thoughtfully designed, long-lasting products accessible to everyone in Pakistan.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md text-sm hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-border text-neutral-700 font-semibold rounded-md text-sm hover:bg-secondary transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-12 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "2,000+", label: "Orders Delivered" },
            { value: "98%", label: "Customer Satisfaction" },
            { value: "COD", label: "Flexible Payment" },
            { value: "24 hrs", label: "Avg. Dispatch Time" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-3xl font-serif font-bold text-white">{stat.value}</p>
              <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND VALUES */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
              What We Stand For
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mt-3 leading-tight">
              Principles that guide everything we make.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val) => (
              <div
                key={val.title}
                className="bg-white border border-border/40 rounded-xl p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-neutral-700">
                  {val.icon}
                </div>
                <h3 className="font-serif font-bold text-neutral-900">{val.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION SPLIT */}
      <section className="py-20 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              Redefining the premium shopping experience in Pakistan.
            </h2>
            <p className="text-neutral-400 leading-relaxed text-sm">
              Most e-commerce stores in Pakistan sacrifice quality for speed. We do the opposite.
              Every BLITZ product is hand-selected, quality-checked, and shipped with an experience
              that matches what you'd expect from international premium brands — at honest prices.
            </p>
            <p className="text-neutral-400 leading-relaxed text-sm">
              We believe in full transparency: our pricing, our materials, our payment process.
              No surprises. No gimmicks.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Founded", value: "2024" },
              { label: "Based in", value: "Pakistan" },
              { label: "Payment", value: "COD + EasyPaisa" },
              { label: "Delivery", value: "Nationwide" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-1"
              >
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                  {item.label}
                </p>
                <p className="text-lg font-serif font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-14">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
              The People
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mt-3 leading-tight">
              A small team. A big vision.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-border/40 rounded-xl p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-neutral-950 rounded-full flex items-center justify-center text-white text-sm font-bold font-serif">
                  {member.avatar}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-neutral-900">{member.name}</h3>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mt-0.5">
                    {member.role}
                  </p>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-serif font-bold text-neutral-900">
              Ready to explore?
            </h3>
            <p className="text-sm text-neutral-500">
              Browse our full catalog and find your next favourite thing.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md text-sm hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
