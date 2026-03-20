import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface GuideProfile {
    bio: string;
    name: string;
    role: string;
    photo?: ExternalBlob;
}
export interface Package {
    duration: string;
    name: string;
    description: string;
    destinations: Array<string>;
    price: bigint;
}
export interface Inquiry {
    id: bigint;
    name: string;
    travelDates: string;
    email: string;
    tourType: TourType;
    message: string;
    timestamp: Time;
    phone: string;
}
export interface BlogPost {
    id: bigint;
    title: string;
    content: string;
    destination: string;
    image?: ExternalBlob;
    timestamp: Time;
    publishedBy: Principal;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum TourType {
    dhakaCity = "dhakaCity",
    sundarbans = "sundarbans",
    coxBazar = "coxBazar",
    sajekValley = "sajekValley",
    bandarban = "bandarban"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGuideProfile(name: string, role: string, bio: string, photo: ExternalBlob | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllGuideProfiles(): Promise<Array<GuideProfile>>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getAllPackages(): Promise<Array<Package>>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    createBlogPost(title: string, content: string, destination: string, image: ExternalBlob | null): Promise<bigint>;
    deleteBlogPost(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitInquiry(name: string, email: string, phone: string, tourType: TourType, travelDates: string, message: string): Promise<bigint>;
}
