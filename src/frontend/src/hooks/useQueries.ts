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

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
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

export { TourType };
