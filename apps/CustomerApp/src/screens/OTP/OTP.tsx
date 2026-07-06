// imports

import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import SafeView from '../../components/common/SafeView';
import Header from '../../components/common/Header';
import useAuthStore from '../../store/useAuthStore';



export const OTP: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const phone = route.params?.phone || 'your phone';
  const { verifyOtp } = useAuthStore();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length < 4) {
      setError('Please enter a valid 4-digit code');
      return;
    }

    setLoading(true);
    setError('');
    
    // Simulate verification (Accepts 1234 or 123456)
    const success = await verifyOtp(otp);
    setLoading(false);

    if (success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } else {
      setError('Incorrect code. Use "1234" to login.');
    }
  };

  return (
    <SafeView style={styles.container}>
      <Header title="Verification" />
      <View style={styles.content}>
        <Text style={styles.title}>Enter the 4-digit code sent to</Text>
        <Text style={styles.phone}>{phone}</Text>

        <Input
          placeholder="0 0 0 0"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={(val) => {
            setOtp(val);
            setError('');
          }}
          error={error}
          style={styles.otpInput}
          containerStyle={styles.inputContainer}
        />

        <Button
          title="Verify & Log In"
          onPress={handleVerify}
          loading={loading}
          style={styles.btn}
        />

        <Button
          title="Resend code via SMS"
          variant="text"
          onPress={() => console.log('Resending OTP')}
          style={styles.resendBtn}
          textStyle={{color:"#8A8A8A"}}
        />
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  phone: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 32,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 12,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 32,
  },
  btn: {
    width: '100%',
  },
  resendBtn: {
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default OTP;
