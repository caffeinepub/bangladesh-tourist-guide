import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ExternalBlob, TourType } from "../backend";
import { useActor } from "./useActor";

export function useGetAllPackages() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      duration: string;
      price: number;
      destinations: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).createPackage(
        data.name,
        data.description,
        data.duration,
        BigInt(data.price),
        data.destinations,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });
}

export function useUpdatePackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      description: string;
      duration: string;
      price: number;
      destinations: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).updatePackage(
        data.id,
        data.name,
        data.description,
        data.duration,
        BigInt(data.price),
        data.destinations,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });
}

export function useDeletePackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).deletePackage(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });
}

export function useGetAllGuideProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["guides"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGuideProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      destination: string;
      image: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).createBlogPost(
        data.title,
        data.content,
        data.destination,
        data.image,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogPosts"] }),
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).deleteBlogPost(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogPosts"] }),
  });
}

export function useAddGuideProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      role: string;
      bio: string;
      photo: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addGuideProfile(data.name, data.role, data.bio, data.photo);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guides"] }),
  });
}

export function useSubmitInquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      tourType: TourType;
      travelDates: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitInquiry(
        data.name,
        data.email,
        data.phone,
        data.tourType,
        data.travelDates,
        data.message,
      );
    },
  });
}

// Ad Slot hooks
export function useGetAllAdSlots() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["adSlots"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllAdSlots();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAdSlot() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      imageUrl: string;
      linkUrl: string;
      advertiserName: string;
      pricePaid: number;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).createAdSlot(
        data.title,
        data.imageUrl,
        data.linkUrl,
        data.advertiserName,
        BigInt(data.pricePaid),
        data.isActive,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adSlots"] });
      qc.invalidateQueries({ queryKey: ["siteStats"] });
    },
  });
}

export function useUpdateAdSlot() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      imageUrl: string;
      linkUrl: string;
      advertiserName: string;
      pricePaid: number;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).updateAdSlot(
        data.id,
        data.title,
        data.imageUrl,
        data.linkUrl,
        data.advertiserName,
        BigInt(data.pricePaid),
        data.isActive,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adSlots"] });
      qc.invalidateQueries({ queryKey: ["siteStats"] });
    },
  });
}

export function useDeleteAdSlot() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).deleteAdSlot(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adSlots"] });
      qc.invalidateQueries({ queryKey: ["siteStats"] });
    },
  });
}

export function useRecordAdClick() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).recordAdClick(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adSlots"] }),
  });
}

export function useGetSiteStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["siteStats"],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as any).getSiteStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export { TourType };

// Ad Request hooks (self-service advertiser system)
export function useGetAllAdRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["adRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllAdRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveAdRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).approveAdRequest(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adRequests"] }),
  });
}

export function useRejectAdRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: bigint; reason: string }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).rejectAdRequest(id, reason);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adRequests"] }),
  });
}

export function useGetActiveApprovedAds() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["activeApprovedAds"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getActiveApprovedAds();
    },
    enabled: !!actor && !isFetching,
  });
}
