import { useResources } from "@/hooks/use-resources";
import { Loader } from "@/components/Loader";
import { useState } from "react";
import { Search, PlayCircle, FileText, Headphones, Filter } from "lucide-react";
import { motion } from "framer-motion";

const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  video:   { color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  audio:   { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
  article: { color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
  guide:   { color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
  default: { color: "#4d41df", bg: "rgba(77,65,223,0.08)" },
};

export default function Resources() {
  const { data: resources, isLoading } = useResources();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  if (isLoading) return <Loader />;

  const filteredResources = resources?.filter((r) => {
    const matchesFilter = filter === "all" || r.type === filter;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "video":  return <PlayCircle className="h-4 w-4" />;
      case "audio":  return <Headphones className="h-4 w-4" />;
      default:       return <FileText className="h-4 w-4" />;
    }
  };

  const typeStyle = (type: string) =>
    TYPE_COLORS[type] || TYPE_COLORS.default;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-1" style={{ fontFamily: "Manrope", color: "#191c1f" }}>
          Wellness Library
        </h1>
        <p className="text-base" style={{ color: "#777587" }}>
          Curated tools, guides, and exercises to help you navigate your mental health journey.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#777587" }} />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm outline-none transition-all border"
            style={{
              background: "#f2f3f7",
              border: "1.5px solid rgba(199,196,216,0.35)",
              color: "#191c1f",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#4d41df";
              e.target.style.boxShadow = "0 0 0 3px rgba(77,65,223,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(199,196,216,0.35)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["all", "video", "article", "audio", "guide"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className="px-4 py-2 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all"
              style={{
                background:
                  filter === type
                    ? "linear-gradient(135deg, #4d41df, #675df9)"
                    : "#f2f3f7",
                color: filter === type ? "#fff" : "#464555",
                boxShadow:
                  filter === type ? "0 4px 16px rgba(77,65,223,0.25)" : "none",
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources?.map((resource, i) => {
          const ts = typeStyle(resource.type);
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card flex flex-col overflow-hidden"
            >
              {/* Image */}
              <div className="h-44 relative overflow-hidden" style={{ background: "#f2f3f7" }}>
                <img
                  src={`https://images.unsplash.com/photo-${
                    resource.category?.toLowerCase() === "anxiety"
                      ? "1470252649378-9c29740c9fa8"
                      : "1506126613408-eca07ce68773"
                  }?w=600&fit=crop`}
                  alt={resource.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Type badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className="pill-badge text-xs"
                    style={{ background: "rgba(255,255,255,0.9)", color: ts.color, backdropFilter: "blur(8px)" }}
                  >
                    {getIcon(resource.type)}
                    {resource.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <span
                  className="pill-badge text-xs mb-3 w-fit"
                  style={{ background: ts.bg, color: ts.color }}
                >
                  {resource.category}
                </span>
                <h3 className="text-base font-bold mb-2" style={{ fontFamily: "Manrope", color: "#191c1f" }}>
                  {resource.title}
                </h3>
                <p className="text-xs leading-relaxed mb-5 flex-1" style={{ color: "#464555" }}>
                  {resource.description}
                </p>
                <a
                  href={resource.content}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-xs py-2.5 text-center block"
                >
                  Access Resource
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredResources?.length === 0 && (
        <div
          className="glass-card flex flex-col items-center justify-center py-20 gap-4 text-center"
          style={{ color: "#777587" }}
        >
          <Filter className="h-14 w-14 opacity-20" />
          <p className="text-lg font-semibold" style={{ color: "#464555" }}>
            No resources match your criteria
          </p>
          <p className="text-sm">Try adjusting your search or filter.</p>
          <button
            onClick={() => { setFilter("all"); setSearch(""); }}
            className="btn-primary text-sm px-6 py-2.5 mt-2"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
