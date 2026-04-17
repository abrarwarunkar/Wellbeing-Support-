import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Search, PlusCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function ForumAdminTab() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data: posts, isLoading } = useQuery<(Post & { author: { username: string | null } | null })[]>({
        queryKey: ["/api/posts"],
    });

    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete post");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
            toast({ title: "Post deleted successfully" });
        },
        onError: () => {
            toast({ title: "Failed to delete post", variant: "destructive" });
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`/api/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create post");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
            toast({ title: "Post created successfully" });
            setIsAddOpen(false);
            // Reset form
            setTitle(""); setContent(""); setIsAnonymous(false);
        },
        onError: () => {
            toast({ title: "Failed to create post", variant: "destructive" });
        }
    });

    const filteredPosts = posts?.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase()) ||
        (p.author?.username && p.author.username.toLowerCase().includes(search.toLowerCase()))
    );

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({ title, content, isAnonymous, isFlagged: false });
    };

    if (isLoading) return <div>Loading posts...</div>;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Community Forum</CardTitle>
                        <CardDescription>
                            manage community forum posts and announcements.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search discussions..."
                                className="pl-8 w-[200px] lg:w-[300px]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2"><PlusCircle size={16} /> New Post</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Community Post</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Post Title</Label>
                                        <Input id="title" required value={title} onChange={e => setTitle(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">Content</Label>
                                        <Textarea id="content" required className="min-h-[100px]" value={content} onChange={e => setContent(e.target.value)} />
                                    </div>
                                    <div className="flex items-center space-x-2 py-2">
                                        <Checkbox id="isAnonymous" checked={isAnonymous} onCheckedChange={(c) => setIsAnonymous(!!c)} />
                                        <Label htmlFor="isAnonymous">Post Anonymously</Label>
                                    </div>
                                    <Button type="submit" disabled={createMutation.isPending} className="w-full">
                                        {createMutation.isPending ? "Posting..." : "Create Post"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50">
                                <th className="h-12 px-4 font-medium text-muted-foreground w-1/2">Post details</th>
                                <th className="h-12 px-4 font-medium text-muted-foreground">Author</th>
                                <th className="h-12 px-4 font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredPosts?.map((post) => (
                                <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-base leading-none">
                                                {post.isFlagged && <Badge variant="destructive" className="mr-2 h-4 text-[10px]">Flagged</Badge>}
                                                {post.title}
                                            </span>
                                            <span className="text-xs text-muted-foreground line-clamp-1">{post.content}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {post.isAnonymous ? "Anonymous" : post.author?.username || "Unknown User"}
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {post.createdAt ? format(new Date(post.createdAt), "MMM d, yyyy") : "-"}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="destructive" 
                                                size="sm" 
                                                className="h-8 w-8 p-0"
                                                onClick={() => {
                                                    if (confirm("Are you sure you want to delete this post? This will also remove any replies.")) {
                                                        deleteMutation.mutate(post.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPosts?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-muted-foreground flex flex-col items-center gap-2">
                                        <MessageSquare className="h-8 w-8 opacity-20" />
                                        No forum posts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
