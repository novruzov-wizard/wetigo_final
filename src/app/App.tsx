import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './components/HomePage';
import { SearchPage } from './components/SearchPage';
import { FavoritesPage } from './components/FavoritesPage';
import { ChatPage } from './components/ChatPage';
import { ProfilePage } from './components/ProfilePage';
import { LocationDetail } from './components/LocationDetail';
import { SubscriptionPage } from './components/SubscriptionPage';
import { AddLocationPage } from './components/AddLocationPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);

  const handleSelectLocation = (id: number) => {
    setSelectedLocation(id);
  };

  const handleBackFromDetail = () => {
    setSelectedLocation(null);
  };

  const handleCategorySelect = (category: string) => {
    setCurrentPage('search');
  };

  const handleStartChat = () => {
    setCurrentPage('chat');
    setSelectedLocation(null);
  };

  const handleShowSubscription = () => {
    setShowSubscription(true);
  };

  const handleBackFromSubscription = () => {
    setShowSubscription(false);
  };

  const handleShowAddLocation = () => {
    setShowAddLocation(true);
  };

  const handleBackFromAddLocation = () => {
    setShowAddLocation(false);
  };

  if (showAddLocation) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-[430px] h-[932px] bg-white rounded-[60px] shadow-2xl overflow-hidden relative border-[14px] border-slate-300">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[30px] bg-slate-900 rounded-b-3xl z-50"></div>
          <AddLocationPage onBack={handleBackFromAddLocation} />
        </div>
      </div>
    );
  }

  if (showSubscription) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-[430px] h-[932px] bg-white rounded-[60px] shadow-2xl overflow-hidden relative border-[14px] border-slate-300">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[30px] bg-slate-900 rounded-b-3xl z-50"></div>
          <SubscriptionPage onBack={handleBackFromSubscription} />
        </div>
      </div>
    );
  }

  if (selectedLocation) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-[430px] h-[932px] bg-white rounded-[60px] shadow-2xl overflow-hidden relative border-[14px] border-slate-300">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[30px] bg-slate-900 rounded-b-3xl z-50"></div>
          <LocationDetail
            locationId={selectedLocation}
            onBack={handleBackFromDetail}
            onStartChat={handleStartChat}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[430px] h-[932px] bg-white rounded-[60px] shadow-2xl overflow-hidden relative border-[14px] border-slate-300">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[30px] bg-slate-900 rounded-b-3xl z-50"></div>
        {currentPage === 'home' && (
          <HomePage
            onSelectLocation={handleSelectLocation}
            onCategorySelect={handleCategorySelect}
            onAddLocation={handleShowAddLocation}
          />
        )}
        {currentPage === 'search' && (
          <SearchPage onSelectLocation={handleSelectLocation} />
        )}
        {currentPage === 'favorites' && (
          <FavoritesPage onSelectLocation={handleSelectLocation} />
        )}
        {currentPage === 'chat' && <ChatPage onBack={() => setCurrentPage('home')} />}
        {currentPage === 'profile' && (
          <ProfilePage onShowSubscription={handleShowSubscription} onAddLocation={handleShowAddLocation} />
        )}
        <BottomNav active={currentPage} onNavigate={setCurrentPage} />
      </div>
    </div>
  );
}