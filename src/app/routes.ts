import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { PhoneDetailPage } from "./pages/PhoneDetailPage";
import { ComparePage } from "./pages/ComparePage";
import { BrandPage } from "./pages/BrandPage";
import { PriceTrackerPage } from "./pages/PriceTrackerPage";
import { AIRecommendationPage } from "./pages/AIRecommendationPage";
import { ProfilePage } from "./pages/ProfilePage";
import { WishlistPage } from "./pages/WishlistPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";

export const router = createBrowserRouter([
  {
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "search", Component: SearchPage },
      { path: "phone/:id", Component: PhoneDetailPage },
      { path: "compare", Component: ComparePage },
      { path: "brand/:id", Component: BrandPage },
      { path: "tracker", Component: PriceTrackerPage },
      { path: "ai", Component: AIRecommendationPage },
      { path: "profile", Component: ProfilePage },
      { path: "wishlist", Component: WishlistPage },
      { path: "login", Component: LoginPage },
      { path: "admin", Component: AdminPage },
    ],
  },
]);
