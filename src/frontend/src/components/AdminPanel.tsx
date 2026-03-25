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
  BarChart3,
  BookOpen,
  ClipboardCheck,
  DollarSign,
  Edit2,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  LogOut,
  Megaphone,
  MessageSquare,
  Package,
  Plus,
  ShieldCheck,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import {
  useAddGuideProfile,
  useApproveAdRequest,
  useCreateAdSlot,
  useCreateBlogPost,
  useCreatePackage,
  useDeleteAdSlot,
  useDeleteBlogPost,
  useDeletePackage,
  useGetAllAdRequests,
  useGetAllAdSlots,
  useGetAllBlogPosts,
  useGetAllInquiries,
  useGetAllPackages,
  useGetSiteStats,
  useRejectAdRequest,
  useUpdateAdSlot,
  useUpdatePackage,
} from "../hooks/useQueries";

const ADMIN_EMAIL = "mdkamal515@gmail.com";
const ADMIN_PASSWORD = "arman1234";
const AUTH_KEY = "explore_bd_admin_auth";

function formatDate(timestampNs: bigint): string {
  const ms = Number(timestampNs / 1_000_000n);
  return new Date(ms).toLocaleString();
}

function useAdminAuth() {
  const [authed, setAuthed] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === "true";
  });

  const signIn = (email: string, password: string): boolean => {
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      sessionStorage.setItem(AUTH_KEY, "true");
      setAuthed(true);
      return true;
    }
    return false;
  };

  const signOut = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  return { authed, signIn, signOut };
}

export default function AdminPanel() {
  const { authed, signIn, signOut } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [logging, setLogging] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLogging(true);
    const ok = signIn(email, password);
    setLogging(false);
    if (!ok) {
      setLoginError("ভুল ইমেইল বা পাসওয়ার্ড। আবার চেষ্টা করুন।");
    }
  };

  const handleLogout = () => {
    signOut();
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div
          className="bg-white rounded-xl shadow-card p-10 max-w-sm w-full"
          data-ocid="admin.panel"
        >
          <div className="text-center mb-7">
            <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={28} className="text-gold" />
            </div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-navy">
              Admin Login
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Explore Bangladesh — Owner Panel
            </p>
          </div>
          <form
            onSubmit={handleLogin}
            className="space-y-4"
            data-ocid="admin.modal"
          >
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Email
              </Label>
              <Input
                data-ocid="admin.input"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Password
              </Label>
              <div className="relative">
                <Input
                  data-ocid="admin.input"
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {loginError && (
              <p
                className="text-xs text-destructive font-medium"
                data-ocid="admin.error_state"
              >
                {loginError}
              </p>
            )}
            <Button
              type="submit"
              data-ocid="admin.primary_button"
              disabled={logging}
              className="w-full bg-navy hover:bg-navy/90 text-white uppercase tracking-widest font-bold"
            >
              {logging ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              {logging ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-5 text-center">
            <a href="/" className="text-gold hover:underline">
              ← Back to website
            </a>
          </p>
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
              {ADMIN_EMAIL}
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white/40 text-white/70 hover:bg-white/10 text-xs uppercase tracking-wider"
            >
              <LogOut size={13} className="mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" data-ocid="admin.tab">
          <TabsList className="mb-6 bg-white border border-border shadow-xs flex-wrap h-auto gap-1 p-1">
            <TabsTrigger
              value="overview"
              data-ocid="admin.tab"
              className="flex items-center gap-2"
            >
              <BarChart3 size={15} /> Overview
            </TabsTrigger>
            <TabsTrigger
              value="blog"
              data-ocid="admin.tab"
              className="flex items-center gap-2"
            >
              <BookOpen size={15} /> Blog Posts
            </TabsTrigger>
            <TabsTrigger
              value="packages"
              data-ocid="packages.tab"
              className="flex items-center gap-2"
            >
              <Package size={15} /> Tour Packages
            </TabsTrigger>
            <TabsTrigger
              value="ads"
              data-ocid="admin.tab"
              className="flex items-center gap-2"
            >
              <Megaphone size={15} /> Advertisements
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
            <TabsTrigger
              value="adrequests"
              data-ocid="admin.tab"
              className="flex items-center gap-2"
            >
              <ClipboardCheck size={15} /> Ad Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="blog">
            <BlogPostsTab />
          </TabsContent>
          <TabsContent value="packages">
            <PackagesTab />
          </TabsContent>
          <TabsContent value="ads">
            <AdsTab />
          </TabsContent>
          <TabsContent value="inquiries">
            <InquiriesTab />
          </TabsContent>
          <TabsContent value="guides">
            <AddGuideTab />
          </TabsContent>
          <TabsContent value="adrequests">
            <AdRequestsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const { data: stats, isLoading } = useGetSiteStats();

  const cards = [
    {
      label: "Total Inquiries",
      value: stats ? Number((stats as any).totalInquiries) : 0,
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Blog Posts",
      value: stats ? Number((stats as any).totalPosts) : 0,
      icon: BookOpen,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Tour Packages",
      value: stats ? Number((stats as any).totalPackages) : 0,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Guides",
      value: stats ? Number((stats as any).totalGuides) : 0,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Active Ads",
      value: stats ? Number((stats as any).activeAds) : 0,
      icon: Megaphone,
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
    {
      label: "Ad Revenue (USD)",
      value: stats ? `$${Number((stats as any).totalAdRevenue)}` : "$0",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="overview.panel">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy mb-6 flex items-center gap-2">
          <TrendingUp size={16} className="text-gold" /> Site Statistics
          Overview
        </h2>
        {isLoading ? (
          <div
            className="flex justify-center py-12"
            data-ocid="overview.loading_state"
          >
            <Loader2 className="h-8 w-8 animate-spin text-navy" />
          </div>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            data-ocid="overview.stats"
          >
            {cards.map((card) => (
              <div
                key={card.label}
                className={`rounded-xl p-5 ${card.bg} border border-border/50`}
                data-ocid={`overview.stat.${card.label.toLowerCase().replace(/ /g, "_")}`}
              >
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3 shadow-sm">
                  <card.icon size={20} className={card.color} />
                </div>
                <p className="text-2xl font-bold text-navy">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  {card.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-gold" /> Ad Revenue Guide
        </h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>আপনার ওয়েবসাইটে বিজ্ঞাপন দিয়ে আয় করুন:</p>
          <ul className="space-y-2 list-none">
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold">১.</span>{" "}
              <span>
                স্থানীয় ব্যবসায়ীদের সাথে যোগাযোগ করুন (হোটেল, রেস্তোরাঁ, ট্যুর অপারেটর)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold">২.</span>{" "}
              <span>তাদের ব্যানার/ছবি নিন এবং একটি লিংক সংগ্রহ করুন</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold">৩.</span>{" "}
              <span>"Advertisements" ট্যাবে গিয়ে বিজ্ঞাপন যোগ করুন</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold">৪.</span>{" "}
              <span>বিজ্ঞাপন ওয়েবসাইটে প্রদর্শিত হবে এবং ক্লিক সংখ্যা ট্র্যাক হবে</span>
            </li>
          </ul>
          <p className="text-xs mt-2 p-3 bg-gold/10 rounded-lg border border-gold/20 text-navy font-medium">
            পরামর্শ: প্রতিটি বিজ্ঞাপনের জন্য মাসে ৫০-২০০ ডলার চার্জ করতে পারেন।
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Ads Tab ──────────────────────────────────────────────────────────────────

type AdForm = {
  title: string;
  imageUrl: string;
  linkUrl: string;
  advertiserName: string;
  pricePaid: string;
  isActive: boolean;
};

const emptyAdForm: AdForm = {
  title: "",
  imageUrl: "",
  linkUrl: "",
  advertiserName: "",
  pricePaid: "",
  isActive: true,
};

type AdSlot = {
  id: bigint;
  title: string;
  imageUrl: string;
  linkUrl: string;
  advertiserName: string;
  pricePaid: bigint;
  isActive: boolean;
  clickCount: bigint;
  createdAt: bigint;
};

function AdsTab() {
  const { data: rawAds = [], isLoading } = useGetAllAdSlots();
  const ads = rawAds as unknown as AdSlot[];
  const createAd = useCreateAdSlot();
  const updateAd = useUpdateAdSlot();
  const deleteAd = useDeleteAdSlot();

  const [form, setForm] = useState<AdForm>(emptyAdForm);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const isEditing = editingId !== null;

  const handleEdit = (ad: AdSlot) => {
    setEditingId(ad.id);
    setForm({
      title: ad.title,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      advertiserName: ad.advertiserName,
      pricePaid: String(Number(ad.pricePaid)),
      isActive: ad.isActive,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyAdForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.advertiserName) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const price = Number(form.pricePaid) || 0;
    try {
      if (isEditing && editingId !== null) {
        await updateAd.mutateAsync({
          id: editingId,
          ...form,
          pricePaid: price,
        });
        toast.success("Advertisement updated!");
        setEditingId(null);
      } else {
        await createAd.mutateAsync({ ...form, pricePaid: price });
        toast.success("Advertisement added!");
      }
      setForm(emptyAdForm);
    } catch {
      toast.error("Failed to save advertisement.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteAd.mutateAsync(id);
      toast.success("Advertisement removed.");
      if (editingId === id) handleCancel();
    } catch {
      toast.error("Failed to delete advertisement.");
    }
  };

  const isMutating = createAd.isPending || updateAd.isPending;

  return (
    <div className="space-y-6">
      <div
        className="bg-white rounded-xl shadow-card p-6"
        data-ocid="ads.panel"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-2">
            <Plus size={16} className="text-gold" />
            {isEditing ? "Edit Advertisement" : "Add New Advertisement"}
          </h2>
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-muted-foreground hover:text-navy"
            >
              <X size={14} className="mr-1" /> Cancel
            </Button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          data-ocid="ads.modal"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Ad Title *
              </Label>
              <Input
                data-ocid="ads.input"
                required
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Cox's Bazar Resort"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Advertiser Name *
              </Label>
              <Input
                required
                value={form.advertiserName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, advertiserName: e.target.value }))
                }
                placeholder="Sea Pearl Resort"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Banner Image URL
              </Label>
              <Input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                placeholder="https://example.com/banner.jpg"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Link URL
              </Label>
              <Input
                value={form.linkUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, linkUrl: e.target.value }))
                }
                placeholder="https://advertiser-website.com"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Price Paid (USD)
              </Label>
              <Input
                type="number"
                min="0"
                value={form.pricePaid}
                onChange={(e) =>
                  setForm((p) => ({ ...p, pricePaid: e.target.value }))
                }
                placeholder="100"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Status
              </Label>
              <div className="flex items-center gap-3 h-10">
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, isActive: !p.isActive }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium">
                  {form.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            data-ocid="ads.submit_button"
            disabled={isMutating}
            className="bg-gold hover:bg-gold/90 text-white uppercase tracking-widest font-bold text-xs"
          >
            {isMutating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isMutating
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
                ? "Update Ad"
                : "Add Advertisement"}
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy mb-4">
          All Advertisements ({ads.length})
        </h2>
        {isLoading ? (
          <div
            className="flex justify-center py-8"
            data-ocid="ads.loading_state"
          >
            <Loader2 className="h-6 w-6 animate-spin text-navy" />
          </div>
        ) : ads.length === 0 ? (
          <p
            className="text-muted-foreground text-sm text-center py-8"
            data-ocid="ads.empty_state"
          >
            No advertisements yet. Add your first sponsor above.
          </p>
        ) : (
          <div className="overflow-x-auto" data-ocid="ads.table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-bold uppercase tracking-wider">
                    Title
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider">
                    Advertiser
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider">
                    Price
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider">
                    Clicks
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.map((ad, i) => (
                  <TableRow
                    key={String(ad.id)}
                    data-ocid={`ads.row.${i + 1}`}
                    className={
                      editingId === ad.id
                        ? "bg-gold/5 border-l-2 border-l-gold"
                        : ""
                    }
                  >
                    <TableCell className="font-semibold text-sm text-navy">
                      {ad.title}
                    </TableCell>
                    <TableCell className="text-sm">
                      {ad.advertiserName}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-600 text-white text-xs font-bold">
                        ${Number(ad.pricePaid)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {Number(ad.clickCount)} clicks
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          ad.isActive
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }
                        variant="outline"
                      >
                        {ad.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(ad)}
                          className="border-navy text-navy hover:bg-navy hover:text-white"
                        >
                          <Edit2 size={13} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(ad.id)}
                          disabled={deleteAd.isPending}
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Packages Tab ─────────────────────────────────────────────────────────────

type PackageForm = {
  name: string;
  description: string;
  duration: string;
  price: string;
  destinations: string;
};

const emptyPackageForm: PackageForm = {
  name: "",
  description: "",
  duration: "",
  price: "",
  destinations: "",
};

type PackageWithId = {
  id: bigint;
  name: string;
  description: string;
  duration: string;
  price: bigint;
  destinations: string[];
};

function PackagesTab() {
  const { data: rawPackages = [], isLoading } = useGetAllPackages();
  const packages = rawPackages as unknown as PackageWithId[];
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const deletePackage = useDeletePackage();

  const [form, setForm] = useState<PackageForm>(emptyPackageForm);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const isEditing = editingId !== null;

  const handleEdit = (pkg: PackageWithId) => {
    setEditingId(pkg.id);
    setForm({
      name: pkg.name,
      description: pkg.description,
      duration: pkg.duration,
      price: String(Number(pkg.price)),
      destinations: pkg.destinations.join(", "),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyPackageForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.duration || !form.price) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const priceNum = Number(form.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      toast.error("Price must be a valid positive number.");
      return;
    }
    const destinations = form.destinations
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
    try {
      if (isEditing && editingId !== null) {
        await updatePackage.mutateAsync({
          id: editingId,
          name: form.name,
          description: form.description,
          duration: form.duration,
          price: priceNum,
          destinations,
        });
        toast.success("Package updated!");
        setEditingId(null);
      } else {
        await createPackage.mutateAsync({
          name: form.name,
          description: form.description,
          duration: form.duration,
          price: priceNum,
          destinations,
        });
        toast.success("Package created!");
      }
      setForm(emptyPackageForm);
    } catch {
      toast.error(
        isEditing ? "Failed to update package." : "Failed to create package.",
      );
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deletePackage.mutateAsync(id);
      toast.success("Package deleted.");
      if (editingId === id) handleCancelEdit();
    } catch {
      toast.error("Failed to delete package.");
    }
  };

  const isMutating = createPackage.isPending || updatePackage.isPending;

  return (
    <div className="space-y-6">
      <div
        className="bg-white rounded-xl shadow-card p-6"
        data-ocid="packages.panel"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-2">
            <Plus size={16} className="text-gold" />
            {isEditing ? "Edit Package" : "Add New Tour Package"}
          </h2>
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              className="text-muted-foreground hover:text-navy"
              data-ocid="packages.cancel_button"
            >
              <X size={14} className="mr-1" /> Cancel Edit
            </Button>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          data-ocid="packages.modal"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Package Name *
              </Label>
              <Input
                data-ocid="packages.input"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Cox's Bazar Premium Tour"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Duration *
              </Label>
              <Input
                required
                value={form.duration}
                onChange={(e) =>
                  setForm((p) => ({ ...p, duration: e.target.value }))
                }
                placeholder="5 Days / 4 Nights"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Price (USD) *
              </Label>
              <Input
                required
                type="number"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
                placeholder="299"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                Destinations (comma-separated)
              </Label>
              <Input
                value={form.destinations}
                onChange={(e) =>
                  setForm((p) => ({ ...p, destinations: e.target.value }))
                }
                placeholder="Cox's Bazar, Saint Martin Island"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
              Description *
            </Label>
            <Textarea
              data-ocid="packages.textarea"
              required
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Describe what's included in this tour package..."
            />
          </div>
          <Button
            type="submit"
            data-ocid="packages.submit_button"
            disabled={isMutating}
            className="bg-gold hover:bg-gold/90 text-white uppercase tracking-widest font-bold text-xs"
          >
            {isMutating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isMutating
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update Package"
                : "Create Package"}
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy mb-4">
          All Tour Packages ({packages.length})
        </h2>
        {isLoading ? (
          <div
            className="flex justify-center py-8"
            data-ocid="packages.loading_state"
          >
            <Loader2 className="h-6 w-6 animate-spin text-navy" />
          </div>
        ) : packages.length === 0 ? (
          <p
            className="text-muted-foreground text-sm text-center py-8"
            data-ocid="packages.empty_state"
          >
            No packages yet.
          </p>
        ) : (
          <div className="overflow-x-auto" data-ocid="packages.table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-bold uppercase tracking-wider">
                    Name
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider">
                    Duration
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider">
                    Price
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider">
                    Destinations
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider">
                    Description
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg, i) => (
                  <TableRow
                    key={String(pkg.id)}
                    data-ocid={`packages.row.${i + 1}`}
                    className={
                      editingId === pkg.id
                        ? "bg-gold/5 border-l-2 border-l-gold"
                        : ""
                    }
                  >
                    <TableCell className="font-semibold text-sm text-navy">
                      {pkg.name}
                    </TableCell>
                    <TableCell className="text-sm">{pkg.duration}</TableCell>
                    <TableCell>
                      <Badge className="bg-navy text-white text-xs font-bold">
                        ${Number(pkg.price)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {pkg.destinations.map((dest) => (
                          <Badge
                            key={dest}
                            variant="outline"
                            className="border-gold text-gold text-xs"
                          >
                            {dest}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {pkg.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          data-ocid={`packages.edit_button.${i + 1}`}
                          onClick={() => handleEdit(pkg)}
                          className="border-navy text-navy hover:bg-navy hover:text-white"
                        >
                          <Edit2 size={13} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          data-ocid={`packages.delete_button.${i + 1}`}
                          onClick={() => handleDelete(pkg.id)}
                          disabled={deletePackage.isPending}
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Blog Posts Tab ───────────────────────────────────────────────────────────

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
            {posts.map((post: any, i: number) => (
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

// ─── Inquiries Tab ────────────────────────────────────────────────────────────

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
              {inquiries.map((inq: any, i: number) => (
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

// ─── Add Guide Tab ────────────────────────────────────────────────────────────

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

// ─── Ad Requests Tab ─────────────────────────────────────────────────────────

function AdRequestsTab() {
  const { data: allRequests = [], isLoading } = useGetAllAdRequests();
  const approve = useApproveAdRequest();
  const reject = useRejectAdRequest();
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [rejectingId, setRejectingId] = useState<bigint | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const pending = allRequests.filter((r: any) => "pending" in r.status);
  const approved = allRequests.filter((r: any) => "approved" in r.status);
  const rejected = allRequests.filter((r: any) => "rejected" in r.status);

  const filtered =
    filter === "pending"
      ? pending
      : filter === "approved"
        ? approved
        : filter === "rejected"
          ? rejected
          : allRequests;

  const getStatusBadge = (status: any) => {
    if ("pending" in status)
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
          Pending
        </Badge>
      );
    if ("approved" in status)
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
          Approved
        </Badge>
      );
    if ("rejected" in status)
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
          Rejected
        </Badge>
      );
    return (
      <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
        Expired
      </Badge>
    );
  };

  const handleApprove = async (id: bigint) => {
    try {
      await approve.mutateAsync(id);
      toast.success("Ad request approved!");
    } catch {
      toast.error("Failed to approve.");
    }
  };

  const handleReject = async (id: bigint) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    try {
      await reject.mutateAsync({ id, reason: rejectReason });
      toast.success("Ad request rejected.");
      setRejectingId(null);
      setRejectReason("");
    } catch {
      toast.error("Failed to reject.");
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-card p-6"
      data-ocid="adrequests.panel"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-2">
          <ClipboardCheck size={16} className="text-gold" /> Ad Requests
        </h2>
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              type="button"
              key={f}
              data-ocid="adrequests.tab"
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider transition-colors ${
                filter === f
                  ? "bg-navy text-white"
                  : "bg-slate-100 text-navy hover:bg-slate-200"
              }`}
            >
              {f === "all"
                ? `All (${allRequests.length})`
                : f === "pending"
                  ? `Pending (${pending.length})`
                  : f === "approved"
                    ? `Approved (${approved.length})`
                    : `Rejected (${rejected.length})`}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div
          className="flex justify-center py-10"
          data-ocid="adrequests.loading_state"
        >
          <Loader2 className="h-6 w-6 animate-spin text-navy" />
        </div>
      ) : filtered.length === 0 ? (
        <p
          className="text-muted-foreground text-sm text-center py-10"
          data-ocid="adrequests.empty_state"
        >
          No ad requests in this category.
        </p>
      ) : (
        <div className="overflow-x-auto" data-ocid="adrequests.table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Company
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Ad Title
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Payment
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Reference
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Amount
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Submitted
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((req: any, i: number) => (
                <TableRow
                  key={String(req.id)}
                  data-ocid={`adrequests.row.${i + 1}`}
                >
                  <TableCell className="font-medium text-sm">
                    {req.companyName}
                  </TableCell>
                  <TableCell className="text-sm">{req.adTitle}</TableCell>
                  <TableCell className="text-sm capitalize">
                    {req.paymentMethod}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-xs">
                    {req.paymentReference}
                  </TableCell>
                  <TableCell className="text-sm">
                    ৳{String(req.amountPaid)}
                  </TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(
                      Number(req.submittedAt / 1_000_000n),
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {"pending" in req.status && (
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            data-ocid={`adrequests.confirm_button.${i + 1}`}
                            onClick={() => handleApprove(req.id)}
                            disabled={approve.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3"
                          >
                            {approve.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Approve"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            data-ocid={`adrequests.delete_button.${i + 1}`}
                            onClick={() => {
                              setRejectingId(req.id);
                              setRejectReason("");
                            }}
                            variant="destructive"
                            className="text-xs h-7 px-3"
                          >
                            Reject
                          </Button>
                        </div>
                        {rejectingId === req.id && (
                          <div
                            className="flex gap-2 items-center"
                            data-ocid={`adrequests.panel.${i + 1}`}
                          >
                            <Input
                              className="h-7 text-xs"
                              placeholder="Reason..."
                              data-ocid="adrequests.input"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleReject(req.id)
                              }
                            />
                            <Button
                              size="sm"
                              data-ocid="adrequests.cancel_button"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => setRejectingId(null)}
                            >
                              <X size={14} />
                            </Button>
                            <Button
                              size="sm"
                              data-ocid="adrequests.confirm_button"
                              variant="destructive"
                              className="h-7 text-xs px-2"
                              onClick={() => handleReject(req.id)}
                            >
                              Send
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    {"rejected" in req.status &&
                      req.rejectionReason.length > 0 && (
                        <span className="text-xs text-red-600">
                          {req.rejectionReason[0]}
                        </span>
                      )}
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
