import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { theme } from '../../theme';

interface SpinningSpiralProps {
  visible?: boolean;
  message?: string;
}

const SpinningSpiral: React.FC<SpinningSpiralProps> = ({
  visible = true,
  message = 'Thank you for being patient as your Windsurf experience loads.',
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();
      
      return () => {
        animation.stop();
        spinValue.setValue(0);
      };
    } else {
      spinValue.setValue(0);
    }
  }, [visible, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <View style={theme.components.loadingContainer}>
      <View style={theme.components.loaderWrap}>
        <View style={theme.components.svgContainer}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 99 94" 
              fill="none"
            >
              <Path
                d="M76.3685 45.874C76.3685 67.4731 60.8765 84.9895 41.7761 84.9895C22.6758 84.9895 2 67.4731 2 45.874C2 24.2749 22.6673 6.75853 41.7677 6.75853C60.868 6.75853 76.36 24.2665 76.36 45.874H76.3685Z"
                stroke="#544332"
                strokeWidth="3.21383"
                strokeMiterlimit="10"
              />
              <Path
                d="M78.8538 76.7434C65.3777 93.6246 48.7591 96.8094 33.8262 84.8833C18.8932 72.9572 5.41703 45.7509 18.8932 28.8697C32.3693 11.9886 61.2866 12.6747 76.2196 24.5923C91.1526 36.5099 92.33 59.8623 78.8538 76.7434Z"
                stroke="#544332"
                strokeWidth="3.21383"
                strokeMiterlimit="10"
              />
              <Path
                d="M86.1862 9.91056C102.458 24.1151 98.6544 53.7355 86.0846 68.1264C73.5148 82.5173 50.137 82.6697 33.8657 68.4652C17.5944 54.2606 14.5875 31.0776 27.1573 16.6783C39.7271 2.27889 69.9065 -4.30247 86.1778 9.91056H86.1862Z"
                stroke="#544332"
                strokeWidth="3.21383"
                strokeMiterlimit="10"
              />
            </Svg>
          </Animated.View>
        </View>
        
        <View style={theme.components.textContainer}>
          <Text style={theme.components.loadingText}>Loading Windsurf...</Text>
          <Text style={theme.components.messageText}>{message}</Text>
        </View>
      </View>
    </View>
  );
};

export default SpinningSpiral;
