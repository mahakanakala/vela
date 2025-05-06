import { ViewStyle, TextStyle } from 'react-native';

interface Theme {
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    inputBorder: string;
    muted: string;
  };
  components: {
    loadingContainer: ViewStyle;
    loaderWrap: ViewStyle;
    svgContainer: ViewStyle;
    textContainer: ViewStyle;
    loadingText: TextStyle;
    messageText: TextStyle;
  };
  fonts: {
    family: string;
    sizes: {
      title: number;
      subtitle: number;
      body: number;
      small: number;
    };
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
}

export const theme: Theme = {
  colors: {
    background: '#f5f4f0', // Light beige/cream from Lifeforce
    text: '#333333', // Dark text color
    primary: '#f8b76a', // Golden accent color from the logo
    secondary: '#678571', // Sage green as secondary color
    inputBorder: '#d8d5cd', // Light border color
    muted: '#a3a29e', // For muted/secondary text
  },
  components: {
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#f8f5f1',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
      padding: 16,
    },
    loaderWrap: {
      paddingVertical: 48,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    svgContainer: {
      width: 64,
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      marginTop: 24,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 24,
      marginBottom: 8,
      fontWeight: '500',
      color: '#695642',
    },
    messageText: {
      fontSize: 16,
      color: '#544332',
      textAlign: 'center',
    },
  },
  fonts: {
    family: '"Bradford", "Cormorant Garamond", "EB Garamond", "Garamond", "Times New Roman", serif',
    sizes: {
      title: 32, // Larger title size
      subtitle: 24, // For subtitles
      body: 16, // Body text size
      small: 14, // Small text
    },
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
};
