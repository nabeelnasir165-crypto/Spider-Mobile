import React from 'react';
import HeroScroll from '../sections/HeroScroll';
import InstantQuote from '../sections/InstantQuote';
import ServicesGrid from '../sections/ServicesGrid';
import RefurbishedPreview from '../sections/RefurbishedPreview';
import AccessoriesPreview from '../sections/AccessoriesPreview';
import Reviews from '../sections/Reviews';
import Warranty from '../sections/Warranty';
import FinalCTA from '../sections/FinalCTA';

export default function Home() {
  return (
    <>
      <HeroScroll />
      <InstantQuote />
      <ServicesGrid />
      <RefurbishedPreview />
      <AccessoriesPreview />
      <Reviews />
      <Warranty />
      <FinalCTA />
    </>
  );
}
