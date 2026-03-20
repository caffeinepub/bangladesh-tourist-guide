import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  BookOpen,
  Loader2,
  LogIn,
  MessageSquare,
  Plus,
  ShieldCheck,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddGuideProfile,
  useCreateBlogPost,
  useDeleteBlogPost,
  useGetAllBlogPosts,
  useGetAllInquiries,
  useIsCallerAdmin,
} from "../hooks/useQueries";

function formatDate(timestampNs: bigint): string {
  const ms = Number(timestampNs / 1_000_000n);
  return new Date(ms).toLocaleString();
}

export default function AdminPanel() {
  const { login, identity, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  if (!identity) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div
          className="bg-white rounded-xl shadow-card p-10 max-w-sm w-full text-center"
          data-ocid="admin.panel"
        >
          <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={28} className="text-gold" />
          </div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-navy mb-2">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in with Internet Identity to access the admin dashboard.
          </p>
          <Button
            data-ocid="admin.primary_button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-navy hover:bg-navy/90 text-white uppercase tracking-widest font-bold"
          >
            {isLoggingIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            {isLoggingIn ? "Signing In..." : "Sign In"}
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            <a href="/" className="text-gold hover:underline">
              ← Back to website
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-navy" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div
          className="bg-white rounded-xl shadow-card p-10 max-w-sm w-full text-center"
          data-ocid="admin.error_state"
        >
          <AlertTriangle size={40} className="text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-bold text-navy mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm mb-4">
            You do not have admin permissions.
          </p>
          <a href="/">
            <Button variant="outline" className="border-navy text-navy">
              ← Back to website
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-navy shadow-card" data-ocid="admin.section">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={22} className="text-gold" />
            <span className="text-white font-bold uppercase tracking-widest text-sm">
              EXPLORE BANGLADESH — Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-xs hidden sm:block">
              {identity?.getPrincipal().toString().slice(0, 12)}...
            </span>
            <a href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-gold text-gold hover:bg-gold hover:text-white text-xs uppercase tracking-wider"
              >
                View Site
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="blog" data-ocid="admin.tab">
          <TabsList className="mb-6 bg-white border border-border shadow-xs">
            <TabsTrigger
              value="blog"
              data-ocid="admin.tab"
              className="flex items-center gap-2"
            >
              <BookOpen size={15} /> Blog Posts
            </TabsTrigger>
            <TabsTrigger
              value="inquiries"
              data-ocid="admin.tab"
              className="flex items-center gap-2"
            >
              <MessageSquare size={15} /> Inquiries
            </TabsTrigger>
            <TabsTrigger
              value="guides"
              data-ocid="admin.tab"
              className="flex items-center gap-2"
            >
              <UserPlus size={15} /> Add Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <BlogPostsTab />
          </TabsContent>
          <TabsContent value="inquiries">
            <InquiriesTab />
          </TabsContent>
          <TabsContent value="guides">
            <AddGuideTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function BlogPostsTab() {
  const { data: posts = [], isLoading } = useGetAllBlogPosts();
  const createPost = useCreateBlogPost();
  const deletePost = useDeleteBlogPost();
  const [form, setForm] = useState({ title: "", destination: "", content: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.destination || !form.content) {
      toast.error("Please fill in all required fields.");
      return;
    }
    let imageBlob: ExternalBlob | null = null;
    if (imageFile) {
      const bytes = new Uint8Array(await imageFile.arrayBuffer());
      imageBlob = ExternalBlob.fromBytes(bytes);
    }
    try {
      await createPost.mutateAsync({ ...form, image: imageBlob });
      toast.success("Blog post created!");
      setForm({ title: "", destination: "", content: "" });
      setImageFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Failed to create post.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deletePost.mutateAsync(id);
      toast.success("Post deleted.");
    } catch {
      toast.error("Failed to delete post.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post Form */}
      <div
        className="bg-white rounded-xl shadow-card p-6"
        data-ocid="blog.panel"
      >
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy mb-5 flex items-center gap-2">
          <Plus size={16} className="text-gold" /> Create New Blog Post
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          data-ocid="blog.modal"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Title *
              </Label>
              <Input
                data-ocid="blog.input"
                required
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Exploring Cox's Bazar at Sunset"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Destination *
              </Label>
              <Input
                required
                value={form.destination}
                onChange={(e) =>
                  setForm((p) => ({ ...p, destination: e.target.value }))
                }
                placeholder="Cox's Bazar"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
              Content *
            </Label>
            <Textarea
              data-ocid="blog.textarea"
              required
              rows={5}
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              placeholder="Write your destination story here..."
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
              Image (optional)
            </Label>
            <Input
              ref={fileRef}
              type="file"
              accept="image/*"
              data-ocid="blog.upload_button"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="cursor-pointer"
            />
          </div>
          <Button
            type="submit"
            data-ocid="blog.submit_button"
            disabled={createPost.isPending}
            className="bg-gold hover:bg-gold/90 text-white uppercase tracking-widest font-bold text-xs"
          >
            {createPost.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {createPost.isPending ? "Publishing..." : "Publish Post"}
          </Button>
        </form>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy mb-4">
          Published Posts ({posts.length})
        </h2>
        {isLoading ? (
          <div
            className="flex justify-center py-8"
            data-ocid="blog.loading_state"
          >
            <Loader2 className="h-6 w-6 animate-spin text-navy" />
          </div>
        ) : posts.length === 0 ? (
          <p
            className="text-muted-foreground text-sm text-center py-8"
            data-ocid="blog.empty_state"
          >
            No posts yet.
          </p>
        ) : (
          <div className="space-y-3" data-ocid="blog.list">
            {posts.map((post, i) => (
              <div
                key={String(post.id)}
                className="flex items-start justify-between gap-4 p-4 border border-border rounded-lg"
                data-ocid={`blog.item.${i + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-navy truncate">
                      {post.title}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-gold text-gold text-xs shrink-0"
                    >
                      {post.destination}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {post.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(post.timestamp)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  data-ocid={`blog.delete_button.${i + 1}`}
                  onClick={() => handleDelete(post.id)}
                  disabled={deletePost.isPending}
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white shrink-0"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InquiriesTab() {
  const { data: inquiries = [], isLoading } = useGetAllInquiries();

  return (
    <div
      className="bg-white rounded-xl shadow-card p-6"
      data-ocid="inquiries.panel"
    >
      <h2 className="text-sm font-bold uppercase tracking-wider text-navy mb-4">
        Booking Inquiries ({inquiries.length})
      </h2>
      {isLoading ? (
        <div
          className="flex justify-center py-8"
          data-ocid="inquiries.loading_state"
        >
          <Loader2 className="h-6 w-6 animate-spin text-navy" />
        </div>
      ) : inquiries.length === 0 ? (
        <p
          className="text-muted-foreground text-sm text-center py-8"
          data-ocid="inquiries.empty_state"
        >
          No inquiries yet.
        </p>
      ) : (
        <div className="overflow-x-auto" data-ocid="inquiries.table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Name
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Email
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Phone
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Tour
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Dates
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Message
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inq, i) => (
                <TableRow
                  key={String(inq.id)}
                  data-ocid={`inquiries.row.${i + 1}`}
                >
                  <TableCell className="font-medium text-sm">
                    {inq.name}
                  </TableCell>
                  <TableCell className="text-sm">{inq.email}</TableCell>
                  <TableCell className="text-sm">{inq.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-gold text-gold text-xs"
                    >
                      {String(inq.tourType)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{inq.travelDates}</TableCell>
                  <TableCell className="text-sm max-w-[180px] truncate">
                    {inq.message}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(inq.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function AddGuideTab() {
  const addGuide = useAddGuideProfile();
  const [form, setForm] = useState({ name: "", role: "", bio: "" });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.bio) {
      toast.error("Please fill in all required fields.");
      return;
    }
    let photoBlob: ExternalBlob | null = null;
    if (photoFile) {
      const bytes = new Uint8Array(await photoFile.arrayBuffer());
      photoBlob = ExternalBlob.fromBytes(bytes);
    }
    try {
      await addGuide.mutateAsync({ ...form, photo: photoBlob });
      toast.success("Guide profile added!");
      setForm({ name: "", role: "", bio: "" });
      setPhotoFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Failed to add guide.");
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-card p-6 max-w-xl"
      data-ocid="guides.panel"
    >
      <h2 className="text-sm font-bold uppercase tracking-wider text-navy mb-5 flex items-center gap-2">
        <UserPlus size={16} className="text-gold" /> Add New Guide Profile
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        data-ocid="guides.modal"
      >
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
            Full Name *
          </Label>
          <Input
            data-ocid="guides.input"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Mohammad Rahman"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
            Role / Specialty *
          </Label>
          <Input
            required
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            placeholder="Senior Cultural Guide"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
            Bio *
          </Label>
          <Textarea
            data-ocid="guides.textarea"
            required
            rows={3}
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            placeholder="Brief description of experience and expertise..."
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
            Profile Photo (optional)
          </Label>
          <Input
            ref={fileRef}
            type="file"
            accept="image/*"
            data-ocid="guides.upload_button"
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            className="cursor-pointer"
          />
        </div>
        <Button
          type="submit"
          data-ocid="guides.submit_button"
          disabled={addGuide.isPending}
          className="bg-gold hover:bg-gold/90 text-white uppercase tracking-widest font-bold text-xs"
        >
          {addGuide.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {addGuide.isPending ? "Adding..." : "Add Guide"}
        </Button>
        {addGuide.isSuccess && (
          <p
            className="text-sm text-green-600 font-medium"
            data-ocid="guides.success_state"
          >
            ✓ Guide profile added successfully!
          </p>
        )}
        {addGuide.isError && (
          <p
            className="text-sm text-destructive"
            data-ocid="guides.error_state"
          >
            Failed to add guide. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}
