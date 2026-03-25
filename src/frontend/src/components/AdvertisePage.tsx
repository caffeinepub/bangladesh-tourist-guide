import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  LogOut,
  Megaphone,
  Phone,
  Plus,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

const STORAGE_KEY = "advertiser_session";

type AdvertiserAccount = {
  id: bigint;
  email: string;
  companyName: string;
  contactPhone: string;
  registeredAt: bigint;
  isActive: boolean;
};

type AdStatus =
  | { pending: null }
  | { approved: null }
  | { rejected: null }
  | { expired: null };

type AdRequest = {
  id: bigint;
  advertiserId: bigint;
  adTitle: string;
  companyName: string;
  imageUrl: string;
  websiteLink: string;
  paymentMethod: string;
  paymentReference: string;
  amountPaid: bigint;
  status: AdStatus;
  submittedAt: bigint;
  approvedAt: [] | [bigint];
  expiresAt: [] | [bigint];
  rejectionReason: [] | [string];
};

function StatusBadge({ status }: { status: AdStatus }) {
  if ("pending" in status)
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
        Pending Review
      </Badge>
    );
  if ("approved" in status)
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        ✓ Approved
      </Badge>
    );
  if ("rejected" in status)
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
    );
  return (
    <Badge className="bg-gray-100 text-gray-600 border-gray-200">Expired</Badge>
  );
}

function formatDate(ns: bigint): string {
  return new Date(Number(ns / 1_000_000n)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdvertisePage() {
  const { actor } = useActor();
  const [account, setAccount] = useState<AdvertiserAccount | null>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // restore bigints
        return {
          ...parsed,
          id: BigInt(parsed.id),
          registeredAt: BigInt(parsed.registeredAt),
        };
      }
    } catch {}
    return null;
  });

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAccount(null);
    toast.success("Logged out successfully.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30">
      {/* Header */}
      <header className="bg-navy shadow-sm border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Site
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Megaphone size={18} className="text-gold" />
            <span className="text-white font-bold text-sm uppercase tracking-widest">
              Advertiser Portal
            </span>
          </div>
          {account && (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              data-ocid="advertise.button"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut size={14} className="mr-1" /> Logout
            </Button>
          )}
          {!account && <div className="w-24" />}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {account ? (
          <AdvertiserDashboard account={account} actor={actor} />
        ) : (
          <LandingAndAuth actor={actor} onLogin={setAccount} />
        )}
      </main>

      <footer className="bg-navy mt-16 py-6 text-center">
        <p className="text-white/40 text-xs">
          © {new Date().getFullYear()} Tourist Guide Bangladesh. Built with ♥
          using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            className="text-gold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

// ─── Landing + Auth ────────────────────────────────────────────────────────────

function LandingAndAuth({
  actor,
  onLogin,
}: {
  actor: any;
  onLogin: (acc: AdvertiserAccount) => void;
}) {
  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-gold/10 text-gold border border-gold/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-6">
          <Megaphone size={12} /> Grow Your Business
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold text-navy mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Advertise on Tourist Guide Bangladesh
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Reach thousands of foreign tourists actively planning their Bangladesh
          journey. Get 1 full year of premium visibility on our platform.
        </p>
      </motion.div>

      {/* Pricing & Benefits Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-gold/30 bg-gradient-to-br from-navy to-navy/90 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -translate-y-8 translate-x-8" />
            <CardHeader className="pb-2">
              <CardTitle className="text-gold text-sm uppercase tracking-widest font-bold">
                Advertisement Package
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-5xl font-bold text-white">৳5,000</span>
                <span className="text-white/60 mb-1">/ year</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <BadgeCheck size={16} className="text-gold" />
                <span className="text-white/90 text-sm">
                  Your ad stays live for 1 full year
                </span>
              </div>
              <div className="border-t border-white/10 pt-4 mt-4">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-3">
                  Pay via:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                    <Phone size={14} className="text-gold" />
                    <span className="text-sm text-white">
                      bKash: <strong>01876244413</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                    <Phone size={14} className="text-gold" />
                    <span className="text-sm text-white">
                      Nagad: <strong>01876244413</strong>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-navy text-sm uppercase tracking-widest font-bold">
                Why Advertise With Us?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  icon: Users,
                  text: "Reach thousands of foreign tourists actively planning trips",
                },
                {
                  icon: Clock,
                  text: "1 full year of uninterrupted ad visibility",
                },
                {
                  icon: Globe,
                  text: "Your logo and link displayed prominently on the homepage",
                },
                {
                  icon: TrendingUp,
                  text: "Track ad performance with real-time click analytics",
                },
                {
                  icon: Star,
                  text: "Trusted platform reviewed and approved by admin",
                },
                {
                  icon: CheckCircle2,
                  text: "Simple self-service portal — register, pay, submit",
                },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-gold" />
                  </div>
                  <p className="text-sm text-foreground">{text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Auth Forms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-md mx-auto"
      >
        <Tabs defaultValue="register">
          <TabsList className="w-full mb-6">
            <TabsTrigger
              value="register"
              className="flex-1"
              data-ocid="advertise.tab"
            >
              Create Account
            </TabsTrigger>
            <TabsTrigger
              value="login"
              className="flex-1"
              data-ocid="advertise.tab"
            >
              Sign In
            </TabsTrigger>
          </TabsList>
          <TabsContent value="register">
            <RegisterForm actor={actor} onLogin={onLogin} />
          </TabsContent>
          <TabsContent value="login">
            <LoginForm actor={actor} onLogin={onLogin} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

// ─── Register Form ─────────────────────────────────────────────────────────────

function RegisterForm({
  actor,
  onLogin,
}: {
  actor: any;
  onLogin: (acc: AdvertiserAccount) => void;
}) {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (!actor) {
      toast.error("Connecting to backend, please wait...");
      return;
    }
    setLoading(true);
    try {
      const result = await (actor as any).registerAdvertiser(
        form.email,
        form.password,
        form.companyName,
        form.phone,
      );
      if ("err" in result) {
        toast.error(result.err);
      } else {
        toast.success("Account created! Signing you in...");
        // Auto-login
        const acc = await (actor as any).loginAdvertiser(
          form.email,
          form.password,
        );
        if (acc) {
          const serialized = JSON.stringify({
            ...acc,
            id: String(acc.id),
            registeredAt: String(acc.registeredAt),
          });
          sessionStorage.setItem(STORAGE_KEY, serialized);
          onLogin(acc);
        }
      }
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card data-ocid="advertise.modal">
      <CardHeader>
        <CardTitle className="text-navy flex items-center gap-2">
          <Building2 size={18} className="text-gold" /> Create Advertiser
          Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider">
              Company Name *
            </Label>
            <Input
              required
              data-ocid="advertise.input"
              value={form.companyName}
              onChange={set("companyName")}
              placeholder="Your Business Name"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider">
              Email *
            </Label>
            <Input
              required
              type="email"
              data-ocid="advertise.input"
              value={form.email}
              onChange={set("email")}
              placeholder="business@email.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider">
              Phone *
            </Label>
            <Input
              required
              data-ocid="advertise.input"
              value={form.phone}
              onChange={set("phone")}
              placeholder="01XXXXXXXXX"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider">
              Password *
            </Label>
            <div className="relative">
              <Input
                required
                type={showPass ? "text" : "password"}
                data-ocid="advertise.input"
                value={form.password}
                onChange={set("password")}
                placeholder="Min. 6 characters"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPass((p) => !p)}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider">
              Confirm Password *
            </Label>
            <Input
              required
              type="password"
              data-ocid="advertise.input"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              placeholder="Repeat password"
            />
          </div>
          <Button
            type="submit"
            data-ocid="advertise.submit_button"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold/90 text-white font-bold uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Login Form ────────────────────────────────────────────────────────────────

function LoginForm({
  actor,
  onLogin,
}: {
  actor: any;
  onLogin: (acc: AdvertiserAccount) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Connecting to backend, please wait...");
      return;
    }
    setLoading(true);
    try {
      const acc = await (actor as any).loginAdvertiser(email, password);
      if (acc) {
        const serialized = JSON.stringify({
          ...acc,
          id: String(acc.id),
          registeredAt: String(acc.registeredAt),
        });
        sessionStorage.setItem(STORAGE_KEY, serialized);
        onLogin(acc);
        toast.success(`Welcome back, ${acc.companyName}!`);
      } else {
        toast.error("Invalid email or password.");
      }
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card data-ocid="advertise.modal">
      <CardHeader>
        <CardTitle className="text-navy">Sign In to Your Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider">
              Email
            </Label>
            <Input
              required
              type="email"
              data-ocid="advertise.input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="business@email.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider">
              Password
            </Label>
            <div className="relative">
              <Input
                required
                type={showPass ? "text" : "password"}
                data-ocid="advertise.input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPass((p) => !p)}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            data-ocid="advertise.submit_button"
            disabled={loading}
            className="w-full bg-navy hover:bg-navy/90 text-white font-bold uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Advertiser Dashboard ──────────────────────────────────────────────────────

function AdvertiserDashboard({
  account,
  actor,
}: {
  account: AdvertiserAccount;
  actor: any;
}) {
  const [myAds, setMyAds] = useState<AdRequest[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const loadAds = async () => {
    if (!actor) return;
    setLoadingAds(true);
    try {
      const ads = await (actor as any).getMyAdRequests(account.id);
      setMyAds(ads || []);
    } catch {
      toast.error("Failed to load your ads.");
    } finally {
      setLoadingAds(false);
    }
  };

  // Load on mount
  useState(() => {
    loadAds();
  });

  return (
    <div>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-navy to-navy/80 rounded-2xl p-6 mb-8 flex items-center justify-between"
      >
        <div>
          <p className="text-gold text-xs uppercase tracking-widest font-bold mb-1">
            Welcome back
          </p>
          <h2 className="text-2xl font-bold text-white">
            {account.companyName}
          </h2>
          <p className="text-white/60 text-sm mt-1">{account.email}</p>
        </div>
        <Button
          onClick={() => {
            setShowSubmitForm(true);
            loadAds();
          }}
          data-ocid="advertise.primary_button"
          className="bg-gold hover:bg-gold/90 text-white font-bold uppercase tracking-widest text-xs gap-2"
        >
          <Plus size={16} /> Submit New Ad
        </Button>
      </motion.div>

      {/* Submit Form Modal */}
      {showSubmitForm && (
        <SubmitAdForm
          account={account}
          actor={actor}
          onClose={() => setShowSubmitForm(false)}
          onSuccess={() => {
            setShowSubmitForm(false);
            loadAds();
          }}
        />
      )}

      {/* My Ads Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-navy text-base">
            My Ad Submissions
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadAds}
            data-ocid="advertise.secondary_button"
            className="text-xs"
          >
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loadingAds ? (
            <div
              className="flex justify-center py-10"
              data-ocid="advertise.loading_state"
            >
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
          ) : myAds.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="advertise.empty_state"
            >
              <Megaphone size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No ads submitted yet</p>
              <p className="text-sm">
                Submit your first ad using the button above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto" data-ocid="advertise.table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myAds.map((ad, i) => (
                    <TableRow
                      key={String(ad.id)}
                      data-ocid={`advertise.item.${i + 1}`}
                    >
                      <TableCell className="font-medium">
                        {ad.adTitle}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ad.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(ad.submittedAt)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {ad.expiresAt.length > 0
                          ? formatDate(ad.expiresAt[0]!)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-red-600">
                        {ad.rejectionReason.length > 0
                          ? ad.rejectionReason[0]
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Guide */}
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 shrink-0 mt-0.5">
                1
              </Badge>
              <div>
                <p className="font-semibold text-navy">Submit & Pay</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Fill in your ad details and payment reference after
                  transferring ৳5,000 via bKash/Nagad.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 shrink-0 mt-0.5">
                2
              </Badge>
              <div>
                <p className="font-semibold text-navy">Admin Review</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Our team verifies your payment and ad content within 24 hours.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-green-100 text-green-800 border-green-200 shrink-0 mt-0.5">
                3
              </Badge>
              <div>
                <p className="font-semibold text-navy">Go Live</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Once approved, your ad appears on the homepage for 365 days.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Submit Ad Form ────────────────────────────────────────────────────────────

function SubmitAdForm({
  account,
  actor,
  onClose,
  onSuccess,
}: {
  account: AdvertiserAccount;
  actor: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    adTitle: "",
    companyName: account.companyName,
    imageUrl: "",
    websiteLink: "",
    paymentMethod: "",
    paymentReference: "",
    amountPaid: "5000",
  });
  const [loading, setLoading] = useState(false);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }
    if (!actor) {
      toast.error("Connecting to backend...");
      return;
    }
    setLoading(true);
    try {
      await (actor as any).submitAdRequest(
        account.id,
        form.adTitle,
        form.companyName,
        form.imageUrl,
        form.websiteLink,
        form.paymentMethod,
        form.paymentReference,
        BigInt(Number.parseInt(form.amountPaid) || 0),
      );
      toast.success("Ad submitted! Our team will review within 24 hours.");
      onSuccess();
    } catch {
      toast.error("Failed to submit ad. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="border-gold/30" data-ocid="advertise.dialog">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-navy flex items-center gap-2">
            <Megaphone size={18} className="text-gold" /> Submit New
            Advertisement
          </CardTitle>
          <button
            type="button"
            onClick={onClose}
            data-ocid="advertise.close_button"
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider">
                Ad Title *
              </Label>
              <Input
                required
                data-ocid="advertise.input"
                value={form.adTitle}
                onChange={set("adTitle")}
                placeholder="e.g. Cox's Bazar Resort — Summer Offer"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider">
                Company Name *
              </Label>
              <Input
                required
                data-ocid="advertise.input"
                value={form.companyName}
                onChange={set("companyName")}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider">
                Banner Image URL
              </Label>
              <Input
                data-ocid="advertise.input"
                value={form.imageUrl}
                onChange={set("imageUrl")}
                placeholder="https://yoursite.com/banner.jpg"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider">
                Website Link *
              </Label>
              <Input
                required
                data-ocid="advertise.input"
                value={form.websiteLink}
                onChange={set("websiteLink")}
                placeholder="https://yourbusiness.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider">
                Payment Method *
              </Label>
              <Select
                value={form.paymentMethod}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, paymentMethod: v }))
                }
              >
                <SelectTrigger data-ocid="advertise.select">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bkash">bKash</SelectItem>
                  <SelectItem value="nagad">Nagad</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider">
                Transaction ID / Reference *
              </Label>
              <Input
                required
                data-ocid="advertise.input"
                value={form.paymentReference}
                onChange={set("paymentReference")}
                placeholder="e.g. TXN8F2391KD"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider">
                Amount Paid (BDT) *
              </Label>
              <Input
                required
                type="number"
                min="1"
                data-ocid="advertise.input"
                value={form.amountPaid}
                onChange={set("amountPaid")}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                data-ocid="advertise.submit_button"
                disabled={loading}
                className="w-full bg-gold hover:bg-gold/90 text-white font-bold uppercase tracking-widest text-xs"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {loading ? "Submitting..." : "Submit Ad Request"}
              </Button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <strong>Payment Instructions:</strong> Send ৳5,000 to bKash/Nagad
            number <strong>01876244413</strong>, then enter the transaction ID
            above.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
