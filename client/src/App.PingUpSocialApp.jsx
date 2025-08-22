import React, { useRef, useEffect } from "react";
import { Route, Routes, useLocation, BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Layout from "./pages/Layout";

import toast, { Toaster } from "react-hot-toast";
import Notification from "./components/Notification";

// Mock Clerk Provider for preview
const MockClerkProvider = ({ children }) => children;
const MockSignedIn = ({ children }) => children;
const MockSignedOut = ({ children }) => null;

// Mock hooks for preview
const useUser = () => ({ 
  user: { id: "mock-user-id" }, 
  isLoaded: true 
});

const useAuth = () => ({ 
  getToken: () => Promise.resolve("mock-token") 
});

const useClerk = () => ({
  signOut: () => console.log("Sign out clicked")
});

// Mock UserButton component
const UserButton = () => (
  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
    JW
  </div>
);

// Create context for mock Clerk
const MockClerkContext = React.createContext({
  useUser,
  useAuth,
  useClerk,
  UserButton,
  SignedIn: MockSignedIn,
  SignedOut: MockSignedOut
});

const AppContent = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);

  // Track current pathname
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // Mock real-time messages for preview
  useEffect(() => {
    if (user) {
      console.log("Mock SSE connection established for user:", user.id);
    }
  }, [user]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <MockSignedOut>
                <Login />
              </MockSignedOut>
              <MockSignedIn>
                <Layout />
              </MockSignedIn>
            </>
          }
        >
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <MockClerkProvider>
      <BrowserRouter>
        <Provider store={store}>
          <MockClerkContext.Provider value={{
            useUser,
            useAuth,
            useClerk,
            UserButton,
            SignedIn: MockSignedIn,
            SignedOut: MockSignedOut
          }}>
            <AppContent />
          </MockClerkContext.Provider>
        </Provider>
      </BrowserRouter>
    </MockClerkProvider>
  );
};

export default App;