import React from 'react';
import { Image, Text, View } from 'react-native';
import logoImg from '../../assets/logo-nlw-esports.png';

import { styles } from './styles';

export function Home() {
  return (
    <View style={styles.container}>
      <Image 
        source={logoImg}
        style={styles.logo}
      />
      <Text>Ola tudo bem?</Text>
    </View>
  );
}