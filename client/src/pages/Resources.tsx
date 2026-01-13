import { useResources } from "@/hooks/use-resources";
import { Loader } from "@/components/Loader";
import { useState } from "react";
import { Search, PlayCircle, FileText, Headphones, Filter } from "lucide-react";
import { motion } from "framer-motion";

export default function Resources() {
  const { data: resources, isLoading } = useResources();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  if (isLoading) return <Loader />;

  const filteredResources = resources?.filter(r => {
    const matchesFilter = filter === "all" || r.type === filter;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch(type) {
      case 'video': return <PlayCircle size={20} />;
      case 'audio': return <Headphones size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Wellness Library</h1>
        <p className="text-muted-foreground text-lg">
          Curated tools, guides, and exercises to help you navigate your mental health journey.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {['all', 'video', 'article', 'audio', 'guide'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`
                px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all
                ${filter === type 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"}
              `}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources?.map((resource, i) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
          >
            <div className="h-48 bg-slate-200 relative overflow-hidden">
               {/* Use Unsplash image with descriptive alt text based on category */}
               {/* Mental health nature landscape for calm vibes */}
               <img 
                 src={`https://images.unsplash.com/photo-${resource.category === 'anxiety' ? '1470252649378-9c29740c9fa8' : '1506126613408-eca07ce68773'}?w=800&fit=crop`}
                 alt={resource.title}
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               />
               <div className="absolute top-4 left-4">
                 <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                   {getIcon(resource.type)}
                   {resource.type}
                 </span>
               </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-2">
                <span className="text-primary text-xs font-bold uppercase tracking-wider">{resource.category}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{resource.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">{resource.description}</p>
              <a 
                href={resource.content}
                target="_blank" 
                rel="noreferrer"
                className="w-full btn-secondary text-center block"
              >
                Access Resource
              </a>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredResources?.length === 0 && (
        <div className="text-center py-20 opacity-60">
          <Filter size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-xl font-semibold text-slate-600">No resources found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
