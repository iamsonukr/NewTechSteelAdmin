import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
// import AdminLayout from "../components/shared/AdminLayout";
import SignIn from "../pages/auth/SignIn";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductList from "../pages/products/ProductList";
import ProductCreate from "../pages/products/ProductCreate";
import ProductEdit from "../pages/products/ProductEdit";
import ProductCategoryList from "../pages/productCategories/ProductCategoryList";
import ProductCategoryCreate from "../pages/productCategories/ProductCategoryCreate";
import ProductCategoryEdit from "../pages/productCategories/ProductCategoryEdit";
import BlogList from "../pages/blogs/BlogList";
import BlogCreate from "../pages/blogs/BlogCreate";
import BlogEdit from "../pages/blogs/BlogEdit";
import BlogCategoryList from "../pages/blogCategories/BlogCategoryList";
import BlogCategoryCreate from "../pages/blogCategories/BlogCategoryCreate";
import BlogCategoryEdit from "../pages/blogCategories/BlogCategoryEdit";
import GalleryList from "../pages/gallery/GalleryList";
import GalleryCreate from "../pages/gallery/GalleryCreate";
import GalleryEdit from "../pages/gallery/GalleryEdit";
import GalleryCategoryList from "../pages/galleryCategories/GalleryCategoryList";
import GalleryCategoryCreate from "../pages/galleryCategories/GalleryCategoryCreate";
import GalleryCategoryEdit from "../pages/galleryCategories/GalleryCategoryEdit";
import EnquiryList from "../pages/enquiries/EnquiryList";
import EnquiryDetail from "../pages/enquiries/EnquiryDetail";
import ChangePassword from "../pages/settings/ChangePassword";
import AppLayout from "../layout/AppLayout";

import PageList          from "../pages/pages/PageList";
import PageCreate        from "../pages/pages/PageCreate";
import PageEdit          from "../pages/pages/PageEdit";
import ContactList       from "../pages/contact/ContactList";
import ContactCreate     from "../pages/contact/ContactCreate";
import ContactEdit       from "../pages/contact/ContactEdit";
import HeroBannerList   from "../pages/heroBanner/HeroBannerList";
import HeroBannerCreate from "../pages/heroBanner/HeroBannerCreate";
import HeroBannerEdit   from "../pages/heroBanner/HeroBannerEdit";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<SignIn />} />
                {/* <Route element={<AppLayout />}> */}

        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="product-categories" element={<ProductCategoryList />} />
          <Route path="product-categories/create" element={<ProductCategoryCreate />} />
          <Route path="product-categories/edit/:id" element={<ProductCategoryEdit />} />
          <Route path="blogs" element={<BlogList />} />
          <Route path="blogs/create" element={<BlogCreate />} />
          <Route path="blogs/edit/:id" element={<BlogEdit />} />
          <Route path="blog-categories" element={<BlogCategoryList />} />
          <Route path="blog-categories/create" element={<BlogCategoryCreate />} />
          <Route path="blog-categories/edit/:id" element={<BlogCategoryEdit />} />
          <Route path="gallery" element={<GalleryList />} />
          <Route path="gallery/create" element={<GalleryCreate />} />
          <Route path="gallery/edit/:id" element={<GalleryEdit />} />
          <Route path="gallery-categories" element={<GalleryCategoryList />} />
          <Route path="gallery-categories/create" element={<GalleryCategoryCreate />} />
          <Route path="gallery-categories/edit/:id" element={<GalleryCategoryEdit />} />
          <Route path="enquiries" element={<EnquiryList />} />
          <Route path="enquiries/:id" element={<EnquiryDetail />} />
          <Route path="settings/change-password" element={<ChangePassword />} />

          <Route path="pages"                   element={<PageList />} />
          <Route path="pages/create"            element={<PageCreate />} />
          <Route path="pages/edit/:id"          element={<PageEdit />} />
          <Route path="contact-details"         element={<ContactList />} />
          <Route path="contact-details/create"  element={<ContactCreate />} />
          <Route path="contact-details/edit/:id" element={<ContactEdit />} />
          <Route path="hero-banners"            element={<HeroBannerList />} />
          <Route path="hero-banners/create"     element={<HeroBannerCreate />} />
          <Route path="hero-banners/edit/:id"   element={<HeroBannerEdit />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
