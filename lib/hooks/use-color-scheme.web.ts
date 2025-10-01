import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * GELECEK KULLANIM İÇİN SAKLANDI
 * 
 * Bu dosya şu anda kullanılmıyor ancak gelecekte şu durumlarda gerekli olacak:
 * - Web versiyonu geliştirme (React Native Web)
 * - Next.js ile hibrit uygulama
 * - Server-side rendering (SSR) desteği
 * - Cross-platform expansion
 * 
 * Web platformunda static rendering sorunlarını çözmek için
 * client-side hydration kullanır.
 * 
 * KULLANIM ZAMANI: Web platform expansion başladığında
 */

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
