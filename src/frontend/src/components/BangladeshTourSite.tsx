import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  BadgeCheck,
  ChevronDown,
  Clock,
  ExternalLink,
  Headphones,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Phone,
  Settings,
  ShieldCheck,
  Star,
  Tag,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SiFacebook, SiInstagram, SiWhatsapp, SiX } from "react-icons/si";
import { toast } from "sonner";
import {
  TourType,
  useGetAllAdSlots,
  useGetAllBlogPosts,
  useRecordAdClick,
  useSubmitInquiry,
} from "../hooks/useQueries";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Tour Packages", href: "#packages" },
  { label: "Destinations", href: "#destinations" },
  { label: "Guide Team", href: "#guides" },
  { label: "Gallery", href: "#gallery" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const PACKAGES = [
  {
    id: 1,
    title: "COX'S BAZAR BEACH PARADISE",
    description:
      "Experience the world's longest natural sea beach. Sun, surf, and breathtaking sunsets await you on Bangladesh's most beloved coastline.",
    duration: "5 Days",
    price: "$299",
    image: "/assets/generated/coxs-bazar-beach.dim_800x500.jpg",
    highlights: [
      "Private beach access",
      "Seafood dinner",
      "Sunset boat cruise",
    ],
  },
  {
    id: 2,
    title: "SUNDARBANS WILDLIFE ADVENTURE",
    description:
      "Explore the world's largest mangrove delta and home to the Royal Bengal Tiger. An unforgettable jungle safari awaits.",
    duration: "3 Days",
    price: "$249",
    image: "/assets/generated/sundarbans-forest.dim_800x500.jpg",
    highlights: [
      "Tiger territory safari",
      "Boat expedition",
      "Expert naturalist",
    ],
  },
  {
    id: 3,
    title: "SAJEK VALLEY TREK",
    description:
      "Journey to the 'Daughter of Clouds' — rolling hills, indigenous villages, and panoramic views above the clouds in Bangladesh's hill tracts.",
    duration: "4 Days",
    price: "$199",
    image: "/assets/generated/sajek-valley.dim_800x500.jpg",
    highlights: [
      "Cloud-level trekking",
      "Tribal culture",
      "Scenic photography",
    ],
  },
  {
    id: 4,
    title: "BANDARBAN HILLS ESCAPE",
    description:
      "Discover the lush green hills of Bandarban — home to stunning waterfalls, tribal communities, and panoramic mountain vistas.",
    duration: "3 Days",
    price: "$179",
    image: "/assets/generated/bandarban-hills.dim_800x500.jpg",
    highlights: ["Waterfall hikes", "Tribal village visits", "Mountain views"],
  },
];

const GUIDES = [
  {
    name: "RAHMAN ALI",
    role: "Senior Cultural Guide",
    bio: "15+ years guiding international travelers through Bangladesh's rich history and culture.",
    image: "/assets/generated/guide-rahman-ali.dim_300x300.jpg",
    rating: 4.9,
    tours: 320,
  },
  {
    name: "FATIMA HOSSAIN",
    role: "Wildlife & Nature Expert",
    bio: "Certified naturalist specializing in Sundarbans and eco-tourism experiences.",
    image: "/assets/generated/guide-fatima-hossain.dim_300x300.jpg",
    rating: 4.8,
    tours: 215,
  },
  {
    name: "KARIM UDDIN",
    role: "Adventure Specialist",
    bio: "Expert trekker and adventure guide with deep knowledge of Bangladesh's hill regions.",
    image: "/assets/generated/guide-karim-uddin.dim_300x300.jpg",
    rating: 4.9,
    tours: 278,
  },
];

const GALLERY = [
  {
    title: "Cox's Bazar Beach",
    subtitle: "Chittagong Division",
    image: "/assets/generated/coxs-bazar-beach.dim_800x500.jpg",
  },
  {
    title: "Sundarbans Forest",
    subtitle: "Khulna Division",
    image: "/assets/generated/sundarbans-forest.dim_800x500.jpg",
  },
  {
    title: "Sajek Valley Clouds",
    subtitle: "Rangamati District",
    image: "/assets/generated/sajek-valley.dim_800x500.jpg",
  },
  {
    title: "Bandarban Hills",
    subtitle: "Chittagong Hill Tracts",
    image: "/assets/generated/bandarban-hills.dim_800x500.jpg",
  },
  {
    title: "Sreemangal Tea Garden",
    subtitle: "Sylhet Division",
    image: "/assets/generated/sreemangal-tea.dim_800x500.jpg",
  },
  {
    title: "Ahsan Manzil Palace",
    subtitle: "Old Dhaka",
    image: "/assets/generated/ahsan-manzil-dhaka.dim_800x500.jpg",
  },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "100% Safe & Trusted" },
  { icon: Headphones, label: "24/7 Support" },
  { icon: Users, label: "Expert Local Guides" },
  { icon: Tag, label: "Best Price Guarantee" },
];

function formatDate(timestampNs: bigint): string {
  const ms = Number(timestampNs / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BangladeshTourSite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tourType: "" as TourType | "",
    travelDates: "",
    message: "",
  });

  const submitInquiry = useSubmitInquiry();
  const { data: blogPosts = [] } = useGetAllBlogPosts();
  const { data: adSlots = [] } = useGetAllAdSlots();
  const recordAdClick = useRecordAdClick();
  const activeAds = adSlots.filter((ad: any) => ad.isActive);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tourType) {
      toast.error("Please select a tour type.");
      return;
    }
    try {
      await submitInquiry.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        tourType: formData.tourType as TourType,
        travelDates: formData.travelDates,
        message: formData.message,
      });
      toast.success("Inquiry submitted! We'll contact you within 24 hours.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        tourType: "",
        travelDates: "",
        message: "",
      });
    } catch {
      toast.error("Something went wrong. Please try WhatsApp instead.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-white/95 shadow-sm"
        }`}
        data-ocid="nav.panel"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="flex flex-col leading-tight">
            <span className="text-lg font-bold uppercase tracking-widest text-navy">
              EXPLORE BANGLADESH
            </span>
            <span className="text-xs text-muted-foreground tracking-wider uppercase">
              Tourist Guide
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-ocid="nav.link"
                className="text-sm font-medium text-foreground/80 hover:text-navy uppercase tracking-wide transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a href="/admin">
              <Button
                variant="ghost"
                size="sm"
                data-ocid="nav.secondary_button"
                className="text-muted-foreground hover:text-navy text-xs uppercase tracking-wider"
              >
                <Settings size={14} className="mr-1" /> Admin
              </Button>
            </a>
            <a href="#contact">
              <Button
                variant="outline"
                data-ocid="nav.primary_button"
                className="border-navy text-navy hover:bg-navy hover:text-white uppercase tracking-widest text-xs font-bold px-5"
              >
                BOOK NOW
              </Button>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-ocid="nav.toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t border-border overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-semibold uppercase tracking-wide text-foreground/80 hover:text-navy py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="/admin"
                  className="text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:text-navy py-1"
                >
                  Admin Panel
                </a>
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.hash = "#contact";
                  }}
                  className="w-full bg-navy text-white uppercase tracking-widest text-xs font-bold mt-2"
                >
                  BOOK NOW
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* TRUST STRIP */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-gold/95 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4 sm:gap-8 text-white">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
            <ShieldCheck size={13} /> Government Registered Tour Operator
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
            <BadgeCheck size={13} /> Licensed & Certified
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
            <Award size={13} /> TripAdvisor Recommended
          </span>
        </div>
      </div>

      {/* HERO */}
      <section
        id="home"
        className="relative min-h-[580px] flex items-center justify-center overflow-hidden"
        style={{
          paddingTop: "6.5rem",
          backgroundImage:
            "url('/assets/generated/coxs-bazar-beach.dim_800x500.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-navy-overlay" />
        <div className="relative z-10 text-center px-4 py-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block text-gold text-xs font-bold uppercase tracking-[0.3em] mb-4">
              Welcome to Bangladesh
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase text-white tracking-tight leading-tight mb-4">
              DISCOVER THE HEART
              <br />
              OF BANGLADESH
            </h1>
            <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Authentic, Expert-Guided Tours for Unforgettable Experiences
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#packages">
                <Button
                  data-ocid="hero.primary_button"
                  className="bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-sm font-bold px-8 py-3 h-auto"
                >
                  EXPLORE TOURS
                </Button>
              </a>
              <a href="#contact">
                <Button
                  data-ocid="hero.secondary_button"
                  variant="outline"
                  className="border-white text-white bg-transparent hover:bg-white hover:text-navy uppercase tracking-widest text-sm font-bold px-8 py-3 h-auto"
                >
                  PLAN YOUR TRIP
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-12 border-t border-white/20 pt-8"
          >
            {[
              { value: "500+", label: "Happy Tourists" },
              { value: "5 Years", label: "Experience" },
              { value: "10+", label: "Destinations" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold text-gold">
                  {stat.value}
                </div>
                <div className="text-white/70 text-xs uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60"
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* TOUR PACKAGES */}
      <section id="packages" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">
              What We Offer
            </span>
            <h2 className="section-heading mt-2 text-3xl">
              OUR POPULAR TOUR PACKAGES
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Hand-crafted itineraries designed for international travelers
              seeking authentic Bangladesh experiences.
            </p>
          </motion.div>

          <div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            data-ocid="packages.list"
          >
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-lg shadow-card border border-border overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300"
                data-ocid={`packages.item.${i + 1}`}
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                    {pkg.price}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-navy mb-2">
                    {pkg.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 flex-1">
                    {pkg.description}
                  </p>
                  <ul className="space-y-1 mb-4">
                    {pkg.highlights.map((h) => (
                      <li
                        key={h}
                        className="text-xs text-foreground/70 flex items-center gap-1.5"
                      >
                        <BadgeCheck size={12} className="text-gold shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {pkg.duration}
                    </span>
                    <span className="font-bold text-gold text-sm">
                      {pkg.price} / person
                    </span>
                  </div>
                  <a href="#contact">
                    <Button
                      data-ocid={`packages.item.${i + 1}.primary_button`}
                      className="w-full bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-xs font-bold h-9"
                    >
                      VIEW DETAILS
                    </Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDE TEAM */}
      <section id="guides" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">
              Our Team
            </span>
            <h2 className="section-heading mt-2 text-3xl">
              MEET OUR EXPERT GUIDE TEAM
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Your dedicated personal guide is with you every step of the
              journey — ensuring safety, comfort, and unforgettable memories.
            </p>
          </motion.div>

          <div
            className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
            data-ocid="guides.list"
          >
            {GUIDES.map((guide, i) => (
              <motion.div
                key={guide.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="bg-white rounded-lg shadow-card p-6 text-center border border-border"
                data-ocid={`guides.item.${i + 1}`}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-gold/20">
                  <img
                    src={guide.image}
                    alt={guide.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy">
                  {guide.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  {guide.role}
                </p>
                <p className="text-xs text-foreground/70 mb-3">{guide.bio}</p>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-gold font-bold">
                    <Star size={12} fill="currentColor" /> {guide.rating}
                  </span>
                  <span className="text-muted-foreground">
                    {guide.tours} tours
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <div className="bg-navy py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon size={28} className="text-gold" />
                <span className="text-white text-xs font-semibold uppercase tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">
              Visual Journey
            </span>
            <h2 className="section-heading mt-2 text-3xl">
              CAPTURE THE MOMENT
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Breathtaking landscapes, vibrant culture, and unforgettable
              moments across Bangladesh.
            </p>
          </motion.div>

          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
            data-ocid="gallery.list"
          >
            {GALLERY.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="relative overflow-hidden rounded-lg aspect-[4/3] group cursor-pointer"
                data-ocid={`gallery.item.${i + 1}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h4 className="text-white text-sm font-bold uppercase tracking-wider">
                    {item.title}
                  </h4>
                  <p className="text-white/70 text-xs mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATION STORIES (BLOG) */}
      <section id="blog" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">
              Travel Stories
            </span>
            <h2 className="section-heading mt-2 text-3xl">
              DESTINATION STORIES
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Inspiring stories from Bangladesh's most beautiful destinations,
              shared by our team of expert guides.
            </p>
          </motion.div>

          {blogPosts.length === 0 ? (
            <div className="text-center py-12" data-ocid="blog.empty_state">
              <p className="text-muted-foreground text-sm">
                No stories yet. Check back soon for inspiring travel stories!
              </p>
            </div>
          ) : (
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="blog.list"
            >
              {blogPosts.map((post, i) => {
                const imageUrl = post.image ? post.image.getDirectURL() : null;
                return (
                  <motion.div
                    key={String(post.id)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="bg-white rounded-xl shadow-card overflow-hidden border border-border flex flex-col"
                    data-ocid={`blog.item.${i + 1}`}
                  >
                    {imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className="border-gold text-gold text-xs font-semibold"
                        >
                          {post.destination}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(post.timestamp)}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-navy mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                        {post.content.length > 200
                          ? `${post.content.slice(0, 200)}...`
                          : post.content}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* DESTINATIONS OVERVIEW */}
      <section id="destinations" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">
            Where We Go
          </span>
          <h2 className="section-heading mt-2 text-3xl mb-4">
            TOP DESTINATIONS
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            From pristine beaches to ancient forests — Bangladesh offers
            extraordinary diversity for the adventurous traveler.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Cox's Bazar",
              "Sundarbans",
              "Sajek Valley",
              "Dhaka Old City",
              "Sreemangal",
              "Saint Martin Island",
              "Paharpur",
              "Mahasthangarh",
              "Kuakata Beach",
              "Bandarban Hills",
              "Rangamati Lake",
              "Ratargul",
            ].map((dest) => (
              <span
                key={dest}
                className="border border-gold text-navy text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full hover:bg-gold hover:text-white transition-colors cursor-default"
              >
                {dest}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* OUR SPONSORS */}
      {activeAds.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">
                Partners & Advertisers
              </span>
              <h2 className="section-heading mt-2 text-3xl mb-2">
                OUR SPONSORS
              </h2>
              <div className="w-16 h-1 bg-gold mx-auto rounded-full mt-3" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAds.map((ad: any, idx: number) => (
                <motion.div
                  key={String(ad.id)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white rounded-2xl shadow-md border border-border overflow-hidden flex flex-col"
                  data-ocid={`sponsors.item.${idx + 1}`}
                >
                  {ad.imageUrl ? (
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-navy/10 flex items-center justify-center">
                      <Megaphone className="w-12 h-12 text-gold opacity-60" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <Badge className="self-start mb-2 bg-gold/20 text-gold border-gold/30 text-xs">
                      {ad.advertiserName}
                    </Badge>
                    <h3 className="font-bold text-navy text-base mb-3 flex-1">
                      {ad.title}
                    </h3>
                    <Button
                      size="sm"
                      className="bg-gold hover:bg-gold/90 text-white w-full mt-auto"
                      data-ocid={`sponsors.button.${idx + 1}`}
                      onClick={() => {
                        recordAdClick.mutate(ad.id);
                        window.open(
                          ad.linkUrl,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Sponsor
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* BOOKING / CONTACT */}
      <section id="contact" className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: info */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">
                Get In Touch
              </span>
              <h2 className="text-3xl font-bold uppercase tracking-wide text-white mt-2 mb-4">
                BOOK YOUR DREAM TOUR
              </h2>
              <p className="text-white/70 mb-8 max-w-md">
                Ready to explore the beauty of Bangladesh? Fill out the form or
                contact us directly on WhatsApp or Gmail for immediate
                assistance. Our dedicated guide will respond within 24 hours.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-white/80">
                  <Phone size={18} className="text-gold" />
                  <span className="text-sm">+880 1876-244413</span>
                </div>
                <a
                  href="mailto:mdkamal515@gmail.com"
                  className="flex items-center gap-3 text-white/80 hover:text-gold transition-colors"
                  data-ocid="contact.link"
                >
                  <Mail size={18} className="text-gold" />
                  <span className="text-sm">mdkamal515@gmail.com</span>
                </a>
                <div className="flex items-center gap-3 text-white/80">
                  <MapPin size={18} className="text-gold" />
                  <span className="text-sm">Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Clock size={18} className="text-gold" />
                  <span className="text-sm">Daily 8AM – 10PM BST</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/8801876244413"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="contact.primary_button"
                >
                  <Button className="bg-whatsapp hover:bg-whatsapp-dark text-white uppercase tracking-widest font-bold px-6 py-3 h-auto flex items-center gap-2 text-sm">
                    <SiWhatsapp size={18} />
                    WHATSAPP US
                  </Button>
                </a>
                <a
                  href="mailto:mdkamal515@gmail.com"
                  data-ocid="contact.secondary_button"
                >
                  <Button
                    variant="outline"
                    className="border-gold text-gold hover:bg-gold hover:text-white uppercase tracking-widest font-bold px-6 py-3 h-auto flex items-center gap-2 text-sm"
                  >
                    <Mail size={18} />
                    EMAIL US
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg p-8"
              data-ocid="contact.panel"
            >
              <h3 className="text-lg font-bold uppercase tracking-wider text-navy mb-6">
                BOOKING INQUIRY
              </h3>
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                data-ocid="contact.modal"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="text-xs font-semibold uppercase tracking-wider text-navy"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      data-ocid="contact.input"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs font-semibold uppercase tracking-wider text-navy"
                    >
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-semibold uppercase tracking-wider text-navy"
                    >
                      Phone *
                    </Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-navy">
                      Tour Type *
                    </Label>
                    <Select
                      value={formData.tourType}
                      onValueChange={(v) =>
                        setFormData((p) => ({ ...p, tourType: v as TourType }))
                      }
                    >
                      <SelectTrigger data-ocid="contact.select">
                        <SelectValue placeholder="Select tour..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TourType.coxBazar}>
                          Cox's Bazar Beach Paradise
                        </SelectItem>
                        <SelectItem value={TourType.sundarbans}>
                          Sundarbans Wildlife Adventure
                        </SelectItem>
                        <SelectItem value={TourType.sajekValley}>
                          Sajek Valley Trek
                        </SelectItem>
                        <SelectItem value={TourType.sajekValley}>
                          Bandarban / Hill Tracts
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="dates"
                    className="text-xs font-semibold uppercase tracking-wider text-navy"
                  >
                    Travel Dates *
                  </Label>
                  <Input
                    id="dates"
                    required
                    value={formData.travelDates}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        travelDates: e.target.value,
                      }))
                    }
                    placeholder="e.g. December 10–20, 2026"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="message"
                    className="text-xs font-semibold uppercase tracking-wider text-navy"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    data-ocid="contact.textarea"
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Tell us your group size, preferences, or any special requirements..."
                  />
                </div>
                <Button
                  type="submit"
                  data-ocid="contact.submit_button"
                  disabled={submitInquiry.isPending}
                  className="w-full bg-gold hover:bg-gold-dark text-white uppercase tracking-widest font-bold h-11"
                >
                  {submitInquiry.isPending ? "SUBMITTING..." : "SUBMIT INQUIRY"}
                </Button>
                {submitInquiry.isSuccess && (
                  <p
                    className="text-sm text-center text-green-600 font-medium"
                    data-ocid="contact.success_state"
                  >
                    ✓ Inquiry received! We'll be in touch shortly.
                  </p>
                )}
                {submitInquiry.isError && (
                  <p
                    className="text-sm text-center text-destructive"
                    data-ocid="contact.error_state"
                  >
                    Failed to submit. Please WhatsApp or email us instead.
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy pt-16 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-2">
                EXPLORE BANGLADESH
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="flex items-center gap-1 text-gold text-xs font-semibold">
                  <ShieldCheck size={12} /> Govt. Registered
                </span>
                <span className="flex items-center gap-1 text-gold text-xs font-semibold">
                  <BadgeCheck size={12} /> Licensed & Certified
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Your trusted partner for authentic guided tours across the
                beautiful landscapes of Bangladesh.
              </p>
              <div className="flex items-center gap-3 mt-5">
                {[
                  { Icon: SiFacebook, href: "#" },
                  { Icon: SiInstagram, href: "#" },
                  { Icon: SiX, href: "#" },
                  { Icon: SiWhatsapp, href: "https://wa.me/8801876244413" },
                ].map(({ Icon, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-colors"
                  >
                    <Icon size={14} className="text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">
                QUICK LINKS
              </h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-gold text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tours */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">
                POPULAR TOURS
              </h4>
              <ul className="space-y-2">
                {PACKAGES.map((pkg) => (
                  <li key={pkg.id}>
                    <a
                      href="#packages"
                      className="text-white/60 hover:text-gold text-sm transition-colors"
                    >
                      {pkg.title.split(" ").slice(0, 3).join(" ")}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">
                CONTACT INFO
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/60 text-sm">
                  <Phone size={14} className="text-gold mt-0.5 shrink-0" />
                  +880 1876-244413
                </li>
                <li>
                  <a
                    href="mailto:mdkamal515@gmail.com"
                    className="flex items-start gap-2 text-white/60 hover:text-gold text-sm transition-colors"
                  >
                    <Mail size={14} className="text-gold mt-0.5 shrink-0" />
                    mdkamal515@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2 text-white/60 text-sm">
                  <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
                  Dhaka, Bangladesh
                </li>
                <li className="flex items-start gap-2 text-white/60 text-sm">
                  <Clock size={14} className="text-gold mt-0.5 shrink-0" />
                  Daily 8AM – 10PM BST
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/50 text-xs">
            <span>
              © {new Date().getFullYear()} Explore Bangladesh. All rights
              reserved.
            </span>
            <span>
              Built with ♥ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                className="text-gold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <motion.a
        href="https://wa.me/8801876244413"
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="contact.open_modal_button"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-whatsapp rounded-full flex items-center justify-center shadow-lg"
        title="Chat on WhatsApp"
      >
        <SiWhatsapp size={28} className="text-white" />
      </motion.a>
    </div>
  );
}
