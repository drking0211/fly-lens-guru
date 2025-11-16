import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.278c835598b94f728381b11310d62a79',
  appName: 'fly-lens-guru',
  webDir: 'dist',
  server: {
    url: 'https://278c8355-98b9-4f72-8381-b11310d62a79.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  },
  plugins: {
    Camera: {
      NSCameraUsageDescription: 'This app requires camera access to capture photos of flies for identification.'
    }
  }
};

export default config;
