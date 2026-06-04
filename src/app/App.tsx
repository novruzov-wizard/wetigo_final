import { useState, useEffect } from 'react';
import { useStore } from './store';
import { auth as authApi } from './lib/api';
import { AuthPage } from './components/AuthPage';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { HomePage } from './components/HomePage';
import { SearchPage } from './components/SearchPage';
import { FavoritesPage } from './components/FavoritesPage';
import { ChatPage } from './components/ChatPage';
import { ProfilePage } from './components/ProfilePage';
import { LocationDetail } from './components/LocationDetail';
import { SubscriptionPage } from './components/SubscriptionPage';
import { PaymentPage } from './components/PaymentPage';
import { AddLocationPage } from './components/AddLocationPage';

interface SelectedPlan { id: string; name: string; price: number; cycle: 'month' | 'year'; }

export default function App() {
  const { t, refreshFavorites, updateUser } = useStore();
  const [authed, setAuthed] = useState(() => !!authApi.getToken());

  // On load, validate the saved token and refresh the real user everywhere.
  // If the token is missing/expired/invalid, force sign-out (gate all pages).
  useEffect(() => {
    if (!authApi.getToken()) { setAuthed(false); return; }
    authApi.me()
      .then((u: any) => {
        if (u && u.email) {
          updateUser({
            name: u.name || 'Wetigo User',
            email: u.email || '',
            bio: u.bio || '',
            avatar: u.avatar || 'https://i.pravatar.cc/160?img=12',
          });
          setAuthed(true);
          refreshFavorites();
        } else {
          authApi.setSession(null); setAuthed(false);
        }
      })
      .catch(() => { authApi.setSession(null); setAuthed(false); });
  }, []);

  // OAuth callback: backend redirects to /auth/callback#token=...&name=...&email=...
  useEffect(() => {
    if (!window.location.hash.includes('token=')) return;
    const p = new URLSearchParams(window.location.hash.slice(1));
    const token = p.get('token');
    if (token) {
      authApi.setToken(token);
      updateUser({ name: p.get('name') || 'Wetigo User', email: p.get('email') || '' });
      setAuthed(true);
      refreshFavorites();
    }
    history.replaceState(null, '', window.location.pathname); // clean the hash
  }, []);

  const [currentPage, setCurrentPage] = useState('home');
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [plan, setPlan] = useState('free');
  const [checkoutPlan, setCheckoutPlan] = useState<SelectedPlan | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelectLocation = (id: number) => {
    setSelectedLocation(id);
    window.scrollTo({ top: 0 });
  };

  const handleBackFromDetail = () => setSelectedLocation(null);

  const handleCategorySelect = (category: string) => {
    setSearchCategory(category);
    setSearchQuery('');
    setCurrentPage('search');
    window.scrollTo({ top: 0 });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchCategory('all');
    setCurrentPage('search');
    window.scrollTo({ top: 0 });
  };

  const handleStartChat = () => {
    setCurrentPage('chat');
    setSelectedLocation(null);
  };

  const navigate = (page: string) => {
    setSelectedLocation(null);
    setShowSubscription(false);
    setShowAddLocation(false);
    setCheckoutPlan(null);
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  };

  const renderContent = () => {
    if (showAddLocation) return <AddLocationPage onBack={() => setShowAddLocation(false)} />;
    if (checkoutPlan) {
      return (
        <PaymentPage
          plan={checkoutPlan}
          onBack={() => setCheckoutPlan(null)}
          onSuccess={(planId) => { setPlan(planId); setCheckoutPlan(null); setShowSubscription(false); }}
        />
      );
    }
    if (showSubscription) {
      return (
        <SubscriptionPage
          onBack={() => setShowSubscription(false)}
          onChoosePlan={(p) => setCheckoutPlan(p)}
          currentPlan={plan}
        />
      );
    }
    if (selectedLocation) {
      return (
        <LocationDetail
          locationId={selectedLocation}
          onBack={handleBackFromDetail}
          onStartChat={handleStartChat}
        />
      );
    }
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onSelectLocation={handleSelectLocation}
            onCategorySelect={handleCategorySelect}
            onSearch={handleSearch}
            onAddLocation={() => setShowAddLocation(true)}
          />
        );
      case 'search':
        return (
          <SearchPage
            onSelectLocation={handleSelectLocation}
            initialQuery={searchQuery}
            initialCategory={searchCategory}
          />
        );
      case 'favorites':
        return <FavoritesPage onSelectLocation={handleSelectLocation} />;
      case 'chat':
        return <ChatPage onBack={() => navigate('home')} />;
      case 'profile':
        return (
          <ProfilePage
            onShowSubscription={() => setShowSubscription(true)}
            onAddLocation={() => setShowAddLocation(true)}
            onSignOut={() => { authApi.logout().catch(() => {}); authApi.setSession(null); setAuthed(false); setCurrentPage('home'); }}
            plan={plan}
          />
        );
      default:
        return (
          <div className="px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#f1ebff] flex items-center justify-center mb-4 text-2xl">🚧</div>
            <h2 className="font-display text-2xl font-bold text-[#2b2521] mb-1">Coming soon</h2>
            <p className="text-[#8a7d72] max-w-sm">This section is on the way. Explore places or check your favorites in the meantime.</p>
          </div>
        );
    }
  };

  const activeTab = selectedLocation || showSubscription || showAddLocation || checkoutPlan ? '' : currentPage;

  const titles: Record<string, { t: string; e?: string }> = {
    home: { t: t('nav.home'), e: '😋' },
    search: { t: t('nav.explore'), e: '🗺️' },
    favorites: { t: t('nav.favorites'), e: '❤️' },
    chat: { t: t('nav.messages'), e: '💬' },
    profile: { t: t('nav.settings'), e: '⚙️' },
  };
  const heading = checkoutPlan ? { t: t('title.checkout') } : selectedLocation ? { t: t('title.place') } : showSubscription ? { t: t('title.premium') } : showAddLocation ? { t: t('title.addplace') } : (titles[currentPage] || { t: 'Wetigo' });

  if (!authed) {
    return <AuthPage onAuth={() => { setAuthed(true); refreshFavorites(); }} />;
  }

  return (
    <div className="min-h-screen w-full bg-[#f5f6f4] text-[#2b2521] flex">
      <Sidebar
        active={activeTab}
        onNavigate={navigate}
        onAddLocation={() => setShowAddLocation(true)}
        onGoPremium={() => { setSelectedLocation(null); setShowAddLocation(false); setCheckoutPlan(null); setShowSubscription(true); }}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          title={heading.t}
          emoji={heading.e}
          query={searchQuery}
          onQuery={setSearchQuery}
          onSubmit={() => handleSearch(searchQuery)}
          onMenu={() => setDrawerOpen(true)}
          onNavigate={navigate}
        />
        <main className="flex-1">{renderContent()}</main>
      </div>
    </div>
  );
}
