import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import loadable from '@loadable/component';

//components
import Navbar from './components/navbar/Navbar.jsx';
import Sidebar from './components/sidebar/Sidebar.jsx';
import Footer from './components/footer/Footer.jsx';
//router
import BossRouter from "./router/BossRouter.jsx";
import AdminRouter from "./router/AdminRouter.jsx";
import ManagerRouter from "./router/ManagerRouter.jsx";
import EmployeeRouter from "./router/EmployeeRouter.jsx";
//pages (dynamically loaded)
const MainPage = loadable(() => import('./pages/mainPage/MainPage.jsx'));
const Login = loadable(() => import('./pages/loginPage/LoginPage.jsx'));
const UserAdd = loadable(() => import("./pages/userPages/userAdd/UserAdd.jsx"));
const StoreList = loadable(() => import('./pages/storePages/storeList/StoreList.jsx'));
const StoreAdd = loadable(() => import("./pages/storePages/storeAdd/StoreAdd.jsx"));
const StoreEmployee = loadable(() => import('./pages/storePages/storeEmployee/StoreEmployee.jsx'));
const ProductsList = loadable(() => import('./pages/productPages/productList/ProductList.jsx'));
const ProductDetail = loadable(() => import("./pages/productPages/productDetail/ProductDetail.jsx"));
const ProductAdd = loadable(() => import("./pages/productPages/productAdd/ProductAdd.jsx"));
const TransactionList = loadable(() => import("./pages/transactionPages/transactionList/TransactionList.jsx"));
const TransactionAdd = loadable(() => import("./pages/transactionPages/transactionAdd/TransactionAdd.jsx"));
const TransactionDetails = loadable(() => import("./pages/transactionPages/transactionDetails/TransactionDetails.jsx"));
const StoreDashboard = loadable(() => import("./pages/dashboardPages/storeDashboard/StoreDashboard.jsx"));
const UserProfile = loadable(() => import("./pages/userPages/userProfile/UserProfile.jsx"));
const NotificationList = loadable(() => import("./pages/notificationPage/NotificationList.jsx"));
const Settings = loadable(() => import("./pages/settingsPage/Settings.jsx"));
const BossDashboard = loadable(() => import("./pages/dashboardPages/bossDashboard/BossDashboard.jsx"));
const UserUpdate = loadable(() => import("./pages/userPages/userUpdate/UserUpdate.jsx"));
const CompanyAdd = loadable(() => import("./pages/companyPages/companyAdd/CompanyAdd.jsx"));
const CompanyDetail = loadable(() => import("./pages/companyPages/companyDetail/CompanyDetail.jsx"));
const CompanyList = loadable(() => import("./pages/companyPages/companyList/CompanyList.jsx"));
const CompanyUpdate = loadable(() => import("./pages/companyPages/companyUpdate/CompanyUpdate.jsx"));
const CategoryList = loadable(() => import("./pages/categoryPages/CategoryList.jsx"));
//global
import { GlobalStoreIdProvider } from "./api/store/GlobalStoreId.jsx";
import { GlobalCompanyIdProvider } from "./api/company/GlobalCompanyId.jsx";

const Dashboard = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 ml-64">
                    <Outlet />
                </div>
            </div>
            <div className="ml-64 mt-6">
                <Footer />
            </div>
        </div>
    );
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
        children: [
            {
                path: "/",
                element: <MainPage />,
                index: true,
            },
            {
                path: "/employee-register",
                element: <BossRouter element={<UserAdd type="Employee" />} />,
            },
            {
                path: "/register",
                element: <AdminRouter element={<UserAdd type="Boss" />} />,
            },
            {
                path: "/add-store",
                element: <BossRouter element={<StoreAdd />} />,
            },
            {
                path: "/stores",
                element: <BossRouter element={<StoreList />} />,
            },
            {
                path: "/store-employees",
                element: <ManagerRouter element={<StoreEmployee />} />,
            },
            {
                path: "/product-list",
                element: <EmployeeRouter element={<ProductsList />} />,
            },
            {
                path: "/product-list/category/:categoryId",
                element: <EmployeeRouter element={<ProductsList type="category" />} />,
            },
            {
                path: "/product-details/:productId",
                element: <EmployeeRouter element={<ProductDetail />} />,
            },
            {
                path: "/add-product",
                element: <EmployeeRouter element={<ProductAdd />} />,
            },
            {
                path: "/transactions/:productId",
                element: <EmployeeRouter element={<TransactionList />} />,
            },
            {
                path: "/add-transaction/:productId",
                element: <EmployeeRouter element={<TransactionAdd />} />,
            },
            {
                path: "/transaction-details/:transactionId",
                element: <TransactionDetails />,
            },
            {
                path: "/store",
                element: <EmployeeRouter element={<StoreDashboard />} />,
            },
            {
                path: "/boss-dashboard",
                element: <BossRouter element={<BossDashboard />} />,
            },
            {
                path: "/profile",
                element: <EmployeeRouter element={<UserProfile />} />,
            },
            {
                path: "/notifications",
                element: <EmployeeRouter element={<NotificationList />} />,
            },
            {
                path: "/edit-profile",
                element: <EmployeeRouter element={<UserUpdate />} />,
            },
            {
                path: "/settings",
                element: <EmployeeRouter element={<Settings />} />,
            },
            {
                path: "/new-company/:bossId",
                element: <AdminRouter element={<CompanyAdd />} />,
            },
            {
                path: "/companies",
                element: <AdminRouter element={<CompanyList />} />,
            },
            {
                path: "/company-detail",
                element: <BossRouter element={<CompanyDetail />} />,
            },
            {
                path: "/company-update",
                element: <AdminRouter element={<CompanyUpdate />} />,
            },
            {
                path: "/categories",
                element: <EmployeeRouter element={<CategoryList />} />,
            }
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
]);

function App() {
    return (
        <div className="App">
            <GlobalStoreIdProvider>
                <GlobalCompanyIdProvider>
                    <RouterProvider router={router} />
                </GlobalCompanyIdProvider>
            </GlobalStoreIdProvider>
        </div>
    );
}

export default App;
