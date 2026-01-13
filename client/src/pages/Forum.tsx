import { usePosts, useCreatePost } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "@/components/Loader";
import { useState } from "react";
import { MessageSquare, Heart, Flag, Plus, X, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";

export default function Forum() {
  const { data: posts, isLoading } = usePosts();
  const createMutation = useCreatePost();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", isAnonymous: false });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      title: newPost.title,
      content: newPost.content,
      isAnonymous: newPost.isAnonymous,
      authorId: user?.id || "unknown" // Should be handled by backend session
    });
    setIsOpen(false);
    setNewPost({ title: "", content: "", isAnonymous: false });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Peer Support</h1>
          <p className="text-muted-foreground mt-1">A safe space to share and connect.</p>
        </div>
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Trigger asChild>
            <Button className="btn-primary flex items-center gap-2">
              <Plus size={20} /> New Post
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in" />
            <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-lg bg-white p-6 rounded-2xl shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-bold text-slate-800">Share Your Thoughts</Dialog.Title>
                <Dialog.Close className="text-slate-400 hover:text-slate-600"><X size={20} /></Dialog.Close>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <input
                  placeholder="Title"
                  required
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-lg font-bold"
                  value={newPost.title}
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                />
                <textarea
                  placeholder="What's on your mind? (Remember to be kind and respectful)"
                  required
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none h-40 resize-none"
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                />
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newPost.isAnonymous}
                    onChange={e => setNewPost({...newPost, isAnonymous: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  Post Anonymously
                </label>
                <Button type="submit" className="w-full btn-primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Posting..." : "Post to Forum"}
                </Button>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="space-y-6">
        {posts?.map((post) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${post.isAnonymous ? 'bg-slate-100 text-slate-500' : 'bg-secondary/10 text-secondary'}`}>
                  {post.isAnonymous ? <User size={20} /> : (post.author?.username?.[0] || 'U')}
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    {post.isAnonymous ? "Anonymous" : (post.author?.username || "Unknown")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt!), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-destructive">
                <Flag size={18} />
              </Button>
            </div>
            
            <h2 className="text-xl font-bold text-slate-800 mb-2">{post.title}</h2>
            <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-line">{post.content}</p>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-500 gap-2">
                <Heart size={18} /> 0 Likes
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary gap-2">
                <MessageSquare size={18} /> Reply
              </Button>
            </div>
          </motion.div>
        ))}
        {posts?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500">Be the first to share your story.</p>
          </div>
        )}
      </div>
    </div>
  );
}
