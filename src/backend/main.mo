import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type TourType = {
    #coxBazar;
    #sundarbans;
    #sajekValley;
    #dhakaCity;
    #bandarban;
  };

  type Inquiry = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    tourType : TourType;
    travelDates : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type StaticPackage = {
    name : Text;
    description : Text;
    duration : Text;
    price : Nat;
    destinations : [Text];
  };

  type Package = {
    id : Nat;
    name : Text;
    description : Text;
    duration : Text;
    price : Nat;
    destinations : [Text];
  };

  type GuideProfile = {
    name : Text;
    role : Text;
    bio : Text;
    photo : ?Storage.ExternalBlob;
  };

  type BlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    destination : Text;
    image : ?Storage.ExternalBlob;
    timestamp : Time.Time;
    publishedBy : Principal;
  };

  type AdSlot = {
    id : Nat;
    title : Text;
    imageUrl : Text;
    linkUrl : Text;
    advertiserName : Text;
    pricePaid : Nat;
    isActive : Bool;
    clickCount : Nat;
    createdAt : Time.Time;
  };

  type SiteStats = {
    totalInquiries : Nat;
    totalPosts : Nat;
    totalPackages : Nat;
    totalGuides : Nat;
    totalAds : Nat;
    activeAds : Nat;
    totalAdRevenue : Nat;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  module GuideProfile {
    public func compare(a : GuideProfile, b : GuideProfile) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  var nextInquiryId = 1;
  var nextPostId = 1;
  var nextPackageId = 6;
  var nextAdId = 1;
  let inquiries = Map.empty<Nat, Inquiry>();
  let guideProfiles = List.empty<GuideProfile>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let blogPosts = Map.empty<Nat, BlogPost>();
  let adSlots = Map.empty<Nat, AdSlot>();

  let packages : [StaticPackage] = [];
  let packagesMap = Map.empty<Nat, Package>();

  packagesMap.add(1, { id = 1; name = "Cox's Bazar Beach Paradise"; description = "Experience the world's longest natural sea beach with pristine golden sands and turquoise waves."; duration = "5 days"; price = 299; destinations = ["Cox's Bazar", "Inani Beach", "Himchari", "Saint Martin's Island"] });
  packagesMap.add(2, { id = 2; name = "Sundarbans Wildlife Adventure"; description = "Explore the world's largest mangrove forest, home to the Royal Bengal Tiger and diverse wildlife."; duration = "3 days"; price = 249; destinations = ["Sundarbans", "Mongla", "Khulna"] });
  packagesMap.add(3, { id = 3; name = "Sajek Valley Trek"; description = "Trek through misty hilltops above the clouds in one of Bangladesh's most scenic valleys."; duration = "4 days"; price = 199; destinations = ["Sajek Valley", "Rangamati", "Kaptai Lake"] });
  packagesMap.add(4, { id = 4; name = "Dhaka City Explorer"; description = "Discover the vibrant history and culture of Bangladesh's capital city."; duration = "2 days"; price = 149; destinations = ["Lalbagh Fort", "Ahsan Manzil", "Sonargaon", "Old Dhaka"] });
  packagesMap.add(5, { id = 5; name = "Bandarban Hill Adventure"; description = "Journey through Bangladesh's highest peaks, tribal villages, and breathtaking waterfalls."; duration = "4 days"; price = 229; destinations = ["Bandarban", "Nilgiri", "Boga Lake", "Chimbuk Hill"] });

  // Inquiry functions
  public shared func submitInquiry(name : Text, email : Text, phone : Text, tourType : TourType, travelDates : Text, message : Text) : async Nat {
    let id = nextInquiryId;
    inquiries.add(id, { id; name; email; phone; tourType; travelDates; message; timestamp = Time.now() });
    nextInquiryId += 1;
    id;
  };

  public query func getAllInquiries() : async [Inquiry] {
    inquiries.values().toArray();
  };

  // Package functions
  public query func getAllPackages() : async [Package] {
    packagesMap.values().toArray();
  };

  public shared func createPackage(name : Text, description : Text, duration : Text, price : Nat, destinations : [Text]) : async Nat {
    let id = nextPackageId;
    packagesMap.add(id, { id; name; description; duration; price; destinations });
    nextPackageId += 1;
    id;
  };

  public shared func updatePackage(id : Nat, name : Text, description : Text, duration : Text, price : Nat, destinations : [Text]) : async () {
    packagesMap.add(id, { id; name; description; duration; price; destinations });
  };

  public shared func deletePackage(id : Nat) : async () {
    packagesMap.remove(id);
  };

  // Guide functions
  public shared func addGuideProfile(name : Text, role : Text, bio : Text, photo : ?Storage.ExternalBlob) : async () {
    guideProfiles.add({ name; role; bio; photo });
  };

  public query func getAllGuideProfiles() : async [GuideProfile] {
    guideProfiles.toArray().sort();
  };

  // Blog Post functions
  public shared ({ caller }) func createBlogPost(title : Text, content : Text, destination : Text, image : ?Storage.ExternalBlob) : async Nat {
    let id = nextPostId;
    blogPosts.add(id, { id; title; content; destination; image; timestamp = Time.now(); publishedBy = caller });
    nextPostId += 1;
    id;
  };

  public query func getAllBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray();
  };

  public shared func deleteBlogPost(id : Nat) : async () {
    blogPosts.remove(id);
  };

  // Ad Slot functions
  public shared func createAdSlot(title : Text, imageUrl : Text, linkUrl : Text, advertiserName : Text, pricePaid : Nat, isActive : Bool) : async Nat {
    let id = nextAdId;
    adSlots.add(id, { id; title; imageUrl; linkUrl; advertiserName; pricePaid; isActive; clickCount = 0; createdAt = Time.now() });
    nextAdId += 1;
    id;
  };

  public shared func updateAdSlot(id : Nat, title : Text, imageUrl : Text, linkUrl : Text, advertiserName : Text, pricePaid : Nat, isActive : Bool) : async () {
    switch (adSlots.get(id)) {
      case (?existing) {
        adSlots.add(id, { id; title; imageUrl; linkUrl; advertiserName; pricePaid; isActive; clickCount = existing.clickCount; createdAt = existing.createdAt });
      };
      case null {};
    };
  };

  public shared func deleteAdSlot(id : Nat) : async () {
    adSlots.remove(id);
  };

  public query func getAllAdSlots() : async [AdSlot] {
    adSlots.values().toArray();
  };

  public shared func recordAdClick(id : Nat) : async () {
    switch (adSlots.get(id)) {
      case (?ad) {
        adSlots.add(id, { id = ad.id; title = ad.title; imageUrl = ad.imageUrl; linkUrl = ad.linkUrl; advertiserName = ad.advertiserName; pricePaid = ad.pricePaid; isActive = ad.isActive; clickCount = ad.clickCount + 1; createdAt = ad.createdAt });
      };
      case null {};
    };
  };

  public query func getSiteStats() : async SiteStats {
    var activeAds = 0;
    var totalAdRevenue = 0;
    for (ad in adSlots.values()) {
      if (ad.isActive) { activeAds += 1; totalAdRevenue += ad.pricePaid; };
    };
    {
      totalInquiries = inquiries.size();
      totalPosts = blogPosts.size();
      totalPackages = packagesMap.size();
      totalGuides = guideProfiles.size();
      totalAds = adSlots.size();
      activeAds;
      totalAdRevenue;
    };
  };
};
