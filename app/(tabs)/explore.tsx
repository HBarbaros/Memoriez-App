import { Colors } from '@/lib/constants/colors';
import * as Constants from 'expo-constants';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function SettingsScreen() {
  const handleMenuPress = (option: string) => {
    Alert.alert('Coming Soon', `${option} feature will be available soon!`);
  };

  const appVersion = Constants.default.expoConfig?.version || '1.0.0';

  const menuItems = [
    {
      id: 'profile',
      title: 'My Profile',
      description: 'Edit personal information and preferences',
    },
    {
      id: 'payments',
      title: 'Payment Methods',
      description: 'Manage cards and payment options',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Push notifications and email settings',
    },
    {
      id: 'language',
      title: 'Language',
      description: 'App language and region settings',
      value: 'English',
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Account security and privacy controls',
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'FAQ, contact support, and tutorials',
    },
    {
      id: 'about',
      title: 'About',
      description: 'App version, terms, and privacy policy',
      value: `v${appVersion}`,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.userSection}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>BO</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Barbaros</Text>
            <Text style={styles.userEmail}>barbaros.ozdogan@example.com</Text>
            <Pressable style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </Pressable>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.title)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
              </View>
              <View style={styles.menuItemRight}>
                {item.value && (
                  <Text style={styles.menuValue}>{item.value}</Text>
                )}
                <Text style={styles.menuArrow}>›</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appName}>Memoriez Events</Text>
          <Text style={styles.appDescription}>
            Discover amazing events and create unforgettable memories
          </Text>
          <Text style={styles.appVersion}>Version {appVersion}</Text>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Pressable
            style={styles.logoutButton}
            onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?')}
          >
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
  },
  editProfileText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    marginBottom: 2,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  menuArrow: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  logoutButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '500',
  },
});
