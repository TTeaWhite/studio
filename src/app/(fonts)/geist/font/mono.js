/**
 * @license
 *
 * Font File: Fira Code Variable
 * Copyright © 2014 The Fira Code Project Authors (https://github.com/tonsky/FiraCode)
 * Licensed under the SIL Open Font License, Version 1.1. This license is available at https://scripts.sil.org/OFL
 *
 * Font File: Geist Mono Variable
 * Copyright © 2023 Vercel Inc. All rights reserved.
 * License (Apache-2.0): https://github.com/vercel/geist-font/blob/main/LICENSE.md
 */

import {fetchFonts} from 'next/dist/compiled/@next/font/dist/google';


const fontData = [
  {
    "variable": "font-geist-mono",
    "style": "normal",
    "variableSuffix": "",
    "adjustFontFallback": false,
    "src": [
      {
        "url": "https://assets.vercel.com/raw/upload/v1698923124/geist/mono/subset/GeistMonoVF-subset.woff2",
        "weight": "100 900",
        "style": "normal"
      }
    ],
    "fallback": [
      "monospace"
    ],
    "display": "optional"
  }
];

export default function localFont(options) {
  if (!options.src) {
    throw new Error('Missing required `src` property');
  } // Directly return the options, applying defaults for missing properties
  // that `next/font` might expect.
  return {
    style: options.style ?? 'normal',
    display: options.display ?? 'optional',
    preload: options.preload ?? true,
    fallback: options.fallback ?? ['Arial'], // Ensure fallback is an array
    adjustFontFallback: options.adjustFontFallback ?? false,
    variable: options.variable, // Pass variable through
    weight: options.weight,     // Pass weight through
    declarations: options.declarations, // Pass declarations through
    subsets: options.subsets, // Pass subsets through
    variableSuffix: options.variableSuffix, // Pass variableSuffix through
    src: options.src, // Pass src through

  };
}


const DEFAULT_FONTS_URL = process.env.NEXT_FONT_GOOGLE_URL;
const DEFAULT_USER_AGENT = process.env.NEXT_FONT_GOOGLE_USER_AGENT;

export const Geist_Mono = localFont({
    // Use the predefined fontData
    src: fontData[0].src,
    display: fontData[0].display,
    variable: '--font-geist-mono',
    fallback: fontData[0].fallback,
    adjustFontFallback: fontData[0].adjustFontFallback,
    weight: fontData[0].weight,
    style: fontData[0].style,
});
