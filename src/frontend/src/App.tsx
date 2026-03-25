import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AdminPanel from "./components/AdminPanel";
import AdvertisePage from "./components/AdvertisePage";
import BangladeshTourSite from "./components/BangladeshTourSite";

const queryClient = new QueryClient();

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: BangladeshTourSite,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanel,
});

const advertiseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/advertise",
  component: AdvertisePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  advertiseRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}
