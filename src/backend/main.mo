import Time "mo:core/Time";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
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

  type Package = {
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

  // Storage
  var nextInquiryId = 1;
  var nextPostId = 1;
  let inquiries = Map.empty<Nat, Inquiry>();
  let guideProfiles = List.empty<GuideProfile>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let blogPosts = Map.empty<Nat, BlogPost>();

  // Packages
  let packages : [Package] = [
    {
      name = "Cox's Bazar Beach Paradise";
      description = "Experience the world's longest natural sea beach with pristine golden sands and turquoise waves.";
      duration = "5 days";
      price = 299;
      destinations = ["Cox's Bazar", "Inani Beach", "Himchari", "Saint Martin's Island"];
    },
    {
      name = "Sundarbans Wildlife Adventure";
      description = "Explore the world's largest mangrove forest, home to the Royal Bengal Tiger and diverse wildlife.";
      duration = "3 days";
      price = 249;
      destinations = ["Sundarbans", "Mongla", "Khulna"];
    },
    {
      name = "Sajek Valley Trek";
      description = "Trek through misty hilltops above the clouds in one of Bangladesh's most scenic valleys.";
      duration = "4 days";
      price = 199;
      destinations = ["Sajek Valley", "Rangamati", "Kaptai Lake"];
    },
    {
      name = "Dhaka City Explorer";
      description = "Discover the vibrant history and culture of Bangladesh's capital city.";
      duration = "2 days";
      price = 149;
      destinations = ["Lalbagh Fort", "Ahsan Manzil", "Sonargaon", "Old Dhaka"];
    },
    {
      name = "Bandarban Hill Adventure";
      description = "Journey through Bangladesh's highest peaks, tribal villages, and breathtaking waterfalls.";
      duration = "4 days";
      price = 229;
      destinations = ["Bandarban", "Nilgiri", "Boga Lake", "Chimbuk Hill"];
    },
  ];

  // Claim admin — only works ONCE when no admin has been assigned yet.
  // Directly manipulates state to avoid trapping on unregistered users.
  public shared ({ caller }) func claimAdmin() : async Bool {
    if (caller.isAnonymous()) { return false };
    // Direct map lookup — avoids trap for unregistered users
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) { return true }; // already admin
      case (_) {};
    };
    if (not accessControlState.adminAssigned) {
      accessControlState.userRoles.add(caller, #admin);
      accessControlState.adminAssigned := true;
      return true;
    };
    return false;
  };

  // Check if any admin has been assigned yet
  public query func hasAnyAdmin() : async Bool {
    accessControlState.adminAssigned;
  };

  // User Profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Inquiry functions
  public shared func submitInquiry(name : Text, email : Text, phone : Text, tourType : TourType, travelDates : Text, message : Text) : async Nat {
    let id = nextInquiryId;
    let inquiry : Inquiry = {
      id;
      name;
      email;
      phone;
      tourType;
      travelDates;
      message;
      timestamp = Time.now();
    };
    inquiries.add(id, inquiry);
    nextInquiryId += 1;
    id;
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all inquiries");
    };
    inquiries.values().toArray();
  };

  // Package functions
  public query func getAllPackages() : async [Package] {
    packages;
  };

  // Guide functions
  public shared ({ caller }) func addGuideProfile(name : Text, role : Text, bio : Text, photo : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add guide profiles");
    };
    let profile : GuideProfile = {
      name;
      role;
      bio;
      photo;
    };
    guideProfiles.add(profile);
  };

  public query func getAllGuideProfiles() : async [GuideProfile] {
    guideProfiles.toArray().sort();
  };

  // Blog Post functions
  public shared ({ caller }) func createBlogPost(title : Text, content : Text, destination : Text, image : ?Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };
    let id = nextPostId;
    let post : BlogPost = {
      id;
      title;
      content;
      destination;
      image;
      timestamp = Time.now();
      publishedBy = caller;
    };
    blogPosts.add(id, post);
    nextPostId += 1;
    id;
  };

  public query func getAllBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray();
  };

  public shared ({ caller }) func deleteBlogPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };
    blogPosts.remove(id);
  };
};
