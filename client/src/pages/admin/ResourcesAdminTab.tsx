import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Resource } from "@shared/schema";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Search, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ResourcesAdminTab() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data: resources, isLoading } = useQuery<Resource[]>({
        queryKey: ["/api/resources"],
    });

    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState("article");
    const [category, setCategory] = useState("Anxiety");

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete resource");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
            toast({ title: "Resource deleted successfully" });
        },
        onError: () => {
            toast({ title: "Failed to delete resource", variant: "destructive" });
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`/api/resources`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create resource");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
            toast({ title: "Resource added successfully" });
            setIsAddOpen(false);
            // Reset form
            setTitle(""); setDescription(""); setContent("");
        },
        onError: () => {
            toast({ title: "Failed to add resource", variant: "destructive" });
        }
    });

    const filteredResources = resources?.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({ title, description, content, type, category });
    };

    if (isLoading) return <div>Loading resources...</div>;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Resources Library</CardTitle>
                        <CardDescription>
                            manage mental health and academic resources for users.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search resources..."
                                className="pl-8 w-[200px] lg:w-[300px]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2"><PlusCircle size={16} /> Add Resource</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Resource</DialogTitle>
                                    <DialogDescription>Include a valid URL to the resource or deep-link.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input id="title" required value={title} onChange={e => setTitle(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input id="description" required value={description} onChange={e => setDescription(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">URL (Link)</Label>
                                        <Input id="content" required placeholder="https://..." value={content} onChange={e => setContent(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Select value={type} onValueChange={setType}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="article">Article</SelectItem>
                                                    <SelectItem value="video">Video</SelectItem>
                                                    <SelectItem value="audio">Audio</SelectItem>
                                                    <SelectItem value="guide">Guide</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Category</Label>
                                            <Select value={category} onValueChange={setCategory}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Anxiety">Anxiety</SelectItem>
                                                    <SelectItem value="Depression">Depression</SelectItem>
                                                    <SelectItem value="Stress">Stress</SelectItem>
                                                    <SelectItem value="Academic Stress">Academic Stress</SelectItem>
                                                    <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={createMutation.isPending} className="w-full">
                                        {createMutation.isPending ? "Adding..." : "Add Resource"}
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
                                <th className="h-12 px-4 font-medium text-muted-foreground w-1/3">Resource Name</th>
                                <th className="h-12 px-4 font-medium text-muted-foreground">Type</th>
                                <th className="h-12 px-4 font-medium text-muted-foreground">Category</th>
                                <th className="h-12 px-4 font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredResources?.map((resource) => (
                                <tr key={resource.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{resource.title}</span>
                                            <span className="text-xs text-muted-foreground truncate max-w-xs">{resource.content}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle capitalize">
                                        <Badge variant="outline">{resource.type}</Badge>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {resource.category}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                                if (confirm("Are you sure you want to delete this resource?")) {
                                                    deleteMutation.mutate(resource.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredResources?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                        No resources found.
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
