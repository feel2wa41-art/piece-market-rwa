// Asset images - local require() for demo
// On mobile: require() returns a number (asset ID)
// On web: require() returns a string (URL path from webpack)

// Import images - webpack will resolve these to URL strings
import charizardPsa10 from './pocket01.png';
import pikachuVmax from './pikachu01.png';
import btsProof from './bts-fake-love.png';
import hermesBirkin from './picaso_01.png';
import rolexDaytona from './Mewtwoex01.png';
import banksyPrint from './picaso_01.png';
import starwarsFigures from './pocket02.png';
import placeholder from './pikachu01.png';

export const AssetImages: Record<string, any> = {
  // Pokemon Cards
  charizardPsa10,
  pikachuVmax,

  // K-POP Merchandise
  btsProof,
  blackpinkLightstick: btsProof,

  // Luxury Goods
  hermesBirkin,
  rolexDaytona,

  // Art & Collectibles
  banksyPrint,
  starwarsFigures,

  // Music Rights
  musicTrack1: btsProof,
  musicTrack2: pikachuVmax,

  // Placeholder
  placeholder,
};

export default AssetImages;
