import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SiteLayout from './components/SiteLayout';
import Home from './pages/Home';
import Repairs from './pages/Repairs';
import Refurbished from './pages/Refurbished';
import Accessories from './pages/Accessories';
import Track from './pages/Track';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="/repairs" element={<Repairs />} />
          <Route path="/refurbished" element={<Refurbished />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/track" element={<Track />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
