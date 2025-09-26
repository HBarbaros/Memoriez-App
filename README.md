# Memoriez - Evenemang App

Detta är en [Expo](https://expo.dev) React Native applikation för att upptäcka och hantera lokala evenemang, byggd med modern arkitektur och modulär kodstruktur.

## Funktioner

- **Evenemangsupper**: Upptäck lokala evenemang med avancerade filter
- **Platsbaserad sökning**: Filtrera evenemang baserat på avstånd och plats
- **Intelligent sökning**: Sök evenemang med realtidsfiltering
- **Responsiv design**: VIPMonkey-inspirerad UI med smidiga animationer
- **Modulär arkitektur**: Separata hooks och komponenter för enkel underhåll

## Teknisk Stack

### Expo SDK Komponenter
- **expo-router**: Filbaserad navigation och routing
- **expo-linear-gradient**: Gradient bakgrunder för modern UI
- **expo-location**: GPS-baserad platslokalisering och avståndsberäkning
- **expo-constants**: Applikationskonstanter och enhetsinformation
- **expo-status-bar**: Statusbar styling och kontroll
- **expo-haptics**: Haptisk feedback för förbättrad användarupplevelse
- **expo-web-browser**: Extern länköppning i webbläsare
- **expo-symbols**: iOS-specifika symboler och ikoner
- **@expo/vector-icons**: Vektorikoner (MaterialIcons)

### React Native Core Komponenter
- **View**: Grundläggande layoutcontainer
- **Text**: Textvisning och styling
- **ScrollView**: Scrollbar innehållsvisning
- **FlatList**: Optimerad listrendering för evenemang
- **Modal**: Fullskärmsmodaler för filter och detaljer
- **TextInput**: Sökfält och textinmatning
- **Pressable**: Tryckbara element med anpassad feedback
- **TouchableOpacity**: Tryckbara element med opacity-effekt
- **Image**: Bildvisning för evenemangsthumbnails
- **SafeAreaView**: Säker visningsyta för olika enheter
- **Animated**: Avancerade animationer för scroll-baserad interaktion
- **Dimensions**: Skärmstorlek och enhetsinfo
- **StyleSheet**: Optimerad CSS-liknande styling
- **Platform**: Plattformsspecifik logik (iOS/Android)
- **Alert**: Systemnotifikationer och bekräftelsedialoger

## Projektstruktur

```
app/
├── (tabs)/          # Tab-baserad navigation
│   ├── index.tsx    # Huvudevenemangsskärm  
│   ├── explore.tsx  # Utforska och profil
│   └── _layout.tsx  # Tab layout konfiguration
├── components/      # Återanvändbara UI-komponenter
│   ├── HomeHeader.tsx      # VIPMonkey-stil header
│   ├── SearchSection.tsx   # Animerad söksektion
│   ├── EventsList.tsx      # Evenemangslista
│   ├── FilterModal.tsx     # Avancerade filter
│   └── EventCard.tsx       # Enskild evenemangskort
├── hooks/          # Custom React hooks
│   ├── useScrollAnimation.ts    # Scroll-baserade animationer
│   ├── useLocationFilter.ts     # GPS och platsfiltrering
│   └── useEventFiltering.ts     # Evenemangssökning och sortering
├── data/           # Mock data och API-abstraktion
├── constants/      # Färgscheman och teman
└── types/          # TypeScript typdefinitioner
```

## Installation och Start

1. **Installera beroenden**
   ```bash
   npm install
   ```

2. **Starta utvecklingsservern**
   ```bash
   npx expo start
   ```

3. **Öppna appen**
   - Scanna QR-koden med Expo Go (Android)
   - Scanna QR-koden med Camera app (iOS)
   - Tryck `w` för att öppna i webbläsare
   - Tryck `i` för iOS simulator
   - Tryck `a` för Android emulator

## Arkitektur Highlights

### Modulär Design
- **Custom Hooks**: Separerad affärslogik för återanvändbarhet
- **Komponentisering**: Små, fokuserade UI-komponenter
- **TypeScript**: Fullständig typsäkerhet genom hela applikationen
- **Clean Architecture**: Separation of concerns mellan UI, logik och data

### Performance Optimizering
- **FlatList**: Virtualiserad scrollning för stora evenemangslistan
- **Animated API**: Native-driven animationer för smooth UX
- **Memo och useMemo**: Optimerad rendering för komplexa filter

### Användarvänlig UX
- **Haptisk Feedback**: Naturlig känsla vid interaktioner  
- **Smooth Animations**: Scroll-baserade övergångar och effekter
- **Platsmedveten**: Automatisk lokalisering och avståndsberäkning

## Utveckling

Börja utveckla genom att redigera filerna i **app** katalogen. Detta projekt använder [filbaserad routing](https://docs.expo.dev/router/introduction/) för navigation.

För mer information om Expo utveckling, se [Expo dokumentation](https://docs.expo.dev/).
