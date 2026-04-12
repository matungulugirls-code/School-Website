'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck,
  Key,
  Cpu,
  Database,
  Shield,
  Users,
  Building,
  Server,
  Network,
  Smartphone,
  CheckCircle,
  Globe,
  X,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  Clock,
  Sparkles,
  Heart,
  Flower2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import Image from "next/image";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Verification Modal States
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationReason, setVerificationReason] = useState('');
  const [requiresPasswordAfterVerification, setRequiresPasswordAfterVerification] = useState(false);
  const [passwordAfterVerification, setPasswordAfterVerification] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Password Reset Modal
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const router = useRouter();

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Device Fingerprint Generator
  class DeviceFingerprint {
    static generate() {
      const fingerprint = {
        userAgent: navigator.userAgent,
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
          pixelRatio: window.devicePixelRatio
        },
        language: navigator.language || navigator.userLanguage,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        languages: navigator.languages
      };

      return {
        raw: fingerprint,
        hash: this.hashFingerprint(fingerprint)
      };
    }

    static hashFingerprint(fingerprint) {
      const str = JSON.stringify(fingerprint);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(36);
    }
  }

  class LocalStorageManager {
    static KEYS = {
        DEVICE_FINGERPRINT: 'device_fingerprint',
        DEVICE_TOKEN: 'device_token',
        LOGIN_COUNT: 'login_count',
        LAST_LOGIN: 'last_login',
        ADMIN_TOKEN: 'admin_token',
        ADMIN_USER: 'admin_user',
        DASHBOARD_ACCESS: 'last_dashboard_access'
    };

    static checkAdminTokenValidity() {
        try {
            const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
            
            if (!token) {
                return { isValid: false, reason: 'no_token' };
            }
            
            const tokenData = this.parseJwt(token);
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (tokenData.exp && tokenData.exp <= currentTime) {
                console.log('🔑 Admin token expired');
                return { isValid: false, reason: 'expired' };
            }
            
            return { isValid: true, expiresAt: new Date(tokenData.exp * 1000) };
        } catch (error) {
            console.error('Error checking admin token:', error);
            return { isValid: false, reason: 'parse_error' };
        }
    }

    static base64UrlDecode(str) {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        
        const pad = str.length % 4;
        if (pad) {
            if (pad === 1) {
                throw new Error('Invalid base64 string');
            }
            str += '==='.slice(pad);
        }
        
        return atob(str);
    }

    static parseJwt(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }
            
            const payload = parts[1];
            const decoded = this.base64UrlDecode(payload);
            return JSON.parse(decoded);
        } catch (error) {
            console.error('JWT parsing error:', error);
            throw error;
        }
    }

    static checkVerificationRequirement(forceCheck = false) {
        try {
            console.log('🔍 Checking verification requirement:', { forceCheck });
            
            if (!forceCheck) {
                const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
                const storedFingerprint = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
                const currentFingerprint = DeviceFingerprint.generate();
                
                if (deviceToken && storedFingerprint === currentFingerprint.hash) {
                    console.log('✅ Quick check passed - likely valid device');
                    return { 
                        requiresVerification: false,
                        deviceToken: deviceToken,
                        deviceHash: currentFingerprint.hash
                    };
                }
            }
            
            const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            const storedFingerprint = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
            const currentFingerprint = DeviceFingerprint.generate();
            
            console.log('📱 Full device data check:', {
                hasDeviceToken: !!deviceToken,
                hasStoredFingerprint: !!storedFingerprint,
                currentFingerprint: currentFingerprint.hash.substring(0, 10) + '...',
                storedFingerprint: storedFingerprint ? storedFingerprint.substring(0, 10) + '...' : 'none'
            });

            if (!deviceToken) {
                console.log('📱 No device token found - NEW DEVICE');
                return { 
                    requiresVerification: true, 
                    reason: 'new_device',
                    deviceToken: null,
                    deviceHash: currentFingerprint.hash
                };
            }

            try {
                let tokenData;
                
                if (deviceToken.includes('.')) {
                    tokenData = this.parseJwt(deviceToken);
                } else {
                    const decodedStr = this.base64UrlDecode(deviceToken);
                    tokenData = JSON.parse(decodedStr);
                }
                
                console.log('🔑 Token data parsed:', {
                    deviceHash: tokenData.deviceHash ? `${tokenData.deviceHash.substring(0, 10)}...` : 'missing',
                    loginCount: tokenData.loginCount || 0,
                    exp: tokenData.exp ? new Date(tokenData.exp * 1000).toLocaleString() : 'missing'
                });

                const currentTime = Math.floor(Date.now() / 1000);
                const tokenExpiry = tokenData.exp;
                
                if (!tokenExpiry) {
                    console.log('❌ Token missing expiry');
                    return { 
                        requiresVerification: true, 
                        reason: 'token_invalid',
                        deviceToken: deviceToken,
                        deviceHash: currentFingerprint.hash
                    };
                }

                if (tokenExpiry <= currentTime) {
                    console.log('⏰ Token expired');
                    return { 
                        requiresVerification: true, 
                        reason: 'token_expired',
                        deviceToken: deviceToken,
                        deviceHash: currentFingerprint.hash
                    };
                }

                const loginCount = tokenData.loginCount || 0;
                if (loginCount >= 15) {
                    console.log('🚫 Max login attempts reached:', loginCount);
                    return { 
                        requiresVerification: true, 
                        reason: 'max_logins_reached',
                        deviceToken: deviceToken,
                        loginCount: loginCount,
                        deviceHash: currentFingerprint.hash
                    };
                }

                if (storedFingerprint !== currentFingerprint.hash) {
                    console.log('⚠️ Device fingerprint mismatch');
                    return { 
                        requiresVerification: true, 
                        reason: 'device_mismatch',
                        deviceToken: deviceToken,
                        deviceHash: currentFingerprint.hash
                    };
                }

                if (tokenData.deviceHash && tokenData.deviceHash !== currentFingerprint.hash) {
                    console.log('🔐 Token device hash mismatch');
                    return { 
                        requiresVerification: true, 
                        reason: 'token_device_mismatch',
                        deviceToken: deviceToken,
                        deviceHash: currentFingerprint.hash
                    };
                }

                console.log('✅ Device token is VALID');
                return { 
                    requiresVerification: false, 
                    deviceToken: deviceToken, 
                    loginCount: loginCount,
                    deviceHash: currentFingerprint.hash 
                };

            } catch (tokenError) {
                console.error('❌ Token parsing error:', tokenError);
                return { 
                    requiresVerification: true, 
                    reason: 'invalid_token_format',
                    deviceToken: deviceToken,
                    deviceHash: currentFingerprint.hash
                };
            }

        } catch (error) {
            console.error('❌ LocalStorage check error:', error);
            return { 
                requiresVerification: true, 
                reason: 'storage_error',
                deviceToken: null,
                deviceHash: null
            };
        }
    }

    static storeDeviceData(deviceToken, deviceHash, loginCount) {
        try {
            console.log('💾 Storing device data:', {
                deviceTokenLength: deviceToken ? deviceToken.length : 0,
                deviceHash: deviceHash.substring(0, 10) + '...',
                loginCount: loginCount
            });
            
            localStorage.setItem(this.KEYS.DEVICE_TOKEN, deviceToken);
            localStorage.setItem(this.KEYS.DEVICE_FINGERPRINT, deviceHash);
            localStorage.setItem(this.KEYS.LAST_LOGIN, new Date().toISOString());
            localStorage.setItem(this.KEYS.LOGIN_COUNT, loginCount.toString());
            
            localStorage.removeItem('requires_verification');
            
            console.log('✅ Device data stored successfully');
            
            const storedToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            const storedHash = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
            console.log('🔍 Storage verification:', {
                tokenStored: !!storedToken,
                hashStored: !!storedHash,
                tokenMatches: storedToken === deviceToken
            });
            
        } catch (error) {
            console.error('❌ Error storing device data:', error);
        }
    }

    static storeAuthData(authToken, userData) {
        try {
            localStorage.setItem(this.KEYS.ADMIN_TOKEN, authToken);
            localStorage.setItem(this.KEYS.ADMIN_USER, JSON.stringify(userData));
            console.log('🔐 Auth data stored');
        } catch (error) {
            console.error('❌ Error storing auth data:', error);
        }
    }

    static storeDashboardAccess() {
        try {
            localStorage.setItem(this.KEYS.DASHBOARD_ACCESS, new Date().toISOString());
            console.log('📊 Dashboard access timestamp stored');
        } catch (error) {
            console.error('❌ Error storing dashboard access:', error);
        }
    }

    static getLastDashboardAccess() {
        try {
            const timestamp = localStorage.getItem(this.KEYS.DASHBOARD_ACCESS);
            return timestamp ? new Date(timestamp) : null;
        } catch (error) {
            console.error('❌ Error getting dashboard access:', error);
            return null;
        }
    }

    static getAuthData() {
        try {
            const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
            const userStr = localStorage.getItem(this.KEYS.ADMIN_USER);
            const user = userStr ? JSON.parse(userStr) : null;
            
            return { token, user };
        } catch (error) {
            console.error('❌ Error getting auth data:', error);
            return { token: null, user: null };
        }
    }

    static getDeviceData() {
        try {
            const token = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            const fingerprint = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
            const loginCount = parseInt(localStorage.getItem(this.KEYS.LOGIN_COUNT) || '0', 10);
            const lastLogin = localStorage.getItem(this.KEYS.LAST_LOGIN);
            
            return { token, fingerprint, loginCount, lastLogin };
        } catch (error) {
            console.error('❌ Error getting device data:', error);
            return { token: null, fingerprint: null, loginCount: 0, lastLogin: null };
        }
    }

    static clearLoginData() {
        try {
            localStorage.removeItem(this.KEYS.DEVICE_TOKEN);
            localStorage.removeItem(this.KEYS.DEVICE_FINGERPRINT);
            localStorage.removeItem(this.KEYS.LOGIN_COUNT);
            localStorage.removeItem(this.KEYS.LAST_LOGIN);
            localStorage.removeItem('requires_verification');
            console.log('🧹 Cleared all device login data');
        } catch (error) {
            console.error('❌ Error clearing login data:', error);
        }
    }

    static clearAllAuthData() {
        try {
            this.clearLoginData();
            localStorage.removeItem(this.KEYS.ADMIN_TOKEN);
            localStorage.removeItem(this.KEYS.ADMIN_USER);
            localStorage.removeItem(this.KEYS.DASHBOARD_ACCESS);
            console.log('🧹 Cleared all authentication data');
        } catch (error) {
            console.error('❌ Error clearing auth data:', error);
        }
    }

    static isAuthenticated() {
        try {
            const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
            const userStr = localStorage.getItem(this.KEYS.ADMIN_USER);
            
            if (!token || !userStr) {
                return false;
            }
            
            if (token.includes('.')) {
                try {
                    const tokenData = this.parseJwt(token);
                    const currentTime = Math.floor(Date.now() / 1000);
                    
                    if (tokenData.exp && tokenData.exp <= currentTime) {
                        console.log('🔑 Auth token expired');
                        return false;
                    }
                } catch (e) {
                    console.warn('Could not parse auth token for expiration check:', e);
                }
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error checking authentication:', error);
            return false;
        }
    }

    static getUser() {
        try {
            const userStr = localStorage.getItem(this.KEYS.ADMIN_USER);
            if (!userStr) {
                return null;
            }
            
            return JSON.parse(userStr);
        } catch (error) {
            console.error('❌ Error getting user:', error);
            return null;
        }
    }

    static getToken() {
        try {
            return localStorage.getItem(this.KEYS.ADMIN_TOKEN);
        } catch (error) {
            console.error('❌ Error getting token:', error);
            return null;
        }
    }

    static hasValidDeviceToken() {
        try {
            const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            if (!deviceToken) {
                return false;
            }
            
            const checkResult = this.checkVerificationRequirement();
            return !checkResult.requiresVerification;
        } catch (error) {
            console.error('❌ Error checking device token:', error);
            return false;
        }
    }

    static getLoginCount() {
        try {
            const count = localStorage.getItem(this.KEYS.LOGIN_COUNT);
            return count ? parseInt(count, 10) : 0;
        } catch (error) {
            console.error('❌ Error getting login count:', error);
            return 0;
        }
    }

    static incrementLoginCount() {
        try {
            const currentCount = this.getLoginCount();
            const newCount = currentCount + 1;
            localStorage.setItem(this.KEYS.LOGIN_COUNT, newCount.toString());
            
            const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            if (deviceToken) {
                try {
                    let tokenData;
                    if (deviceToken.includes('.')) {
                        tokenData = this.parseJwt(deviceToken);
                    } else {
                        const decodedStr = this.base64UrlDecode(deviceToken);
                        tokenData = JSON.parse(decodedStr);
                    }
                    
                    tokenData.loginCount = newCount;
                    
                    const updatedToken = btoa(JSON.stringify(tokenData));
                    localStorage.setItem(this.KEYS.DEVICE_TOKEN, updatedToken);
                    
                    console.log('📈 Login count incremented to:', newCount);
                } catch (tokenError) {
                    console.error('❌ Error updating token login count:', tokenError);
                }
            }
            
            return newCount;
        } catch (error) {
            console.error('❌ Error incrementing login count:', error);
            return 0;
        }
    }

    static setRequiresVerification(reason = 'security_check') {
        try {
            localStorage.setItem('requires_verification', 'true');
            localStorage.setItem('verification_reason', reason);
            console.log('⚠️ Verification required set:', reason);
        } catch (error) {
            console.error('❌ Error setting verification requirement:', error);
        }
    }

    static clearVerificationFlag() {
        try {
            localStorage.removeItem('requires_verification');
            localStorage.removeItem('verification_reason');
            console.log('✅ Verification flags cleared');
        } catch (error) {
            console.error('❌ Error clearing verification flags:', error);
        }
    }

    static shouldShowVerification() {
        try {
            const requiresVerification = localStorage.getItem('requires_verification');
            const reason = localStorage.getItem('verification_reason');
            
            return {
                requires: requiresVerification === 'true',
                reason: reason || 'unknown'
            };
        } catch (error) {
            console.error('❌ Error checking verification flag:', error);
            return { requires: false, reason: 'error' };
        }
    }

    static debugAllStorage() {
        try {
            console.log('📋 === LOCALSTORAGE DEBUG INFO ===');
            
            const deviceData = this.getDeviceData();
            console.log('📱 Device Data:', deviceData);
            
            const authData = this.getAuthData();
            console.log('🔐 Auth Data:', {
                hasToken: !!authData.token,
                tokenLength: authData.token ? authData.token.length : 0,
                user: authData.user ? {
                    id: authData.user.id,
                    name: authData.user.name,
                    email: authData.user.email,
                    role: authData.user.role
                } : null
            });
            
            console.log('🗂️ All localStorage items:');
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                console.log(`  ${key}: ${value ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : 'null'}`);
            }
            
            console.log('📋 === END DEBUG INFO ===');
        } catch (error) {
            console.error('❌ Error debugging storage:', error);
        }
    }
  }

  // Terms Modal Functions
  const openTermsModal = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  // Handle verification code input
  const handleVerificationCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value.replace(/\D/g, '');
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`verification-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    setVerificationCode(newCode);
  };

  // Handle backspace
  const handleVerificationKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`verification-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle OTP verification
  const handleVerifyCode = async (e) => {
    if (e) e.preventDefault();
    
    const code = verificationCode.join('');
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setVerificationLoading(true);

    try {
      const deviceFingerprint = DeviceFingerprint.generate();
      
      const pendingVerification = JSON.parse(localStorage.getItem('pending_verification_device') || '{}');
      
      const emailToUse = verificationEmail || formData.email;
      
      if (!emailToUse) {
        toast.error('Email not found. Please try logging in again.');
        setVerificationLoading(false);
        return;
      }
      
      console.log('🔐 Verifying OTP with reset info:', {
        email: emailToUse,
        deviceHash: deviceFingerprint.hash,
        pendingReason: pendingVerification.reason,
        shouldReset: pendingVerification.reason === 'max_logins_reached' || 
                    pendingVerification.reason === 'expired'
      });
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailToUse,
          verificationCode: code,
          action: 'verify',
          clientDeviceHash: deviceFingerprint.hash,
          shouldResetCounts: pendingVerification.reason === 'max_logins_reached' || 
                           pendingVerification.reason === 'expired'
        }),
      });

      const data = await response.json();
      console.log('📩 OTP verification response:', {
        success: data.success,
        countsWereReset: data.countsWereReset,
        loginCount: data.loginCount
      });

      if (response.ok && data.success) {
        localStorage.removeItem('pending_verification_device');
        
        if (data.countsWereReset) {
          console.log('🔄 Backend reset device counts. New count:', data.loginCount);
          
          LocalStorageManager.clearLoginData();
          
          if (data.deviceToken) {
            LocalStorageManager.storeDeviceData(
              data.deviceToken, 
              deviceFingerprint.hash, 
              data.loginCount || 1
            );
          }
          
          toast.success(`Login successful! Device verification counts have been reset.`);
        } else {
          if (data.deviceToken) {
            LocalStorageManager.storeDeviceData(
              data.deviceToken, 
              deviceFingerprint.hash, 
              data.loginCount || 1
            );
          }
          
          toast.success(`Login successful! Welcome back ${data.user?.name || ''}.`);
        }
        
        if (data.token) {
          LocalStorageManager.storeAuthData(data.token, data.user);
        }
        
        setShowVerificationModal(false);
        setVerificationCode(['', '', '', '', '', '']);
        setVerificationEmail('');
        setPasswordAfterVerification('');
        setRequiresPasswordAfterVerification(false);
        
        if (data.countsWereReset) {
          toast.info('Device verification counts have been reset. You now have 15 fresh logins available.');
        }
        
        setTimeout(() => {
          router.push('/MainDashboard');
        }, 1000);
      } else {
        if (data.requiresPassword === true) {
          setRequiresPasswordAfterVerification(true);
          setVerificationEmail(emailToUse);
          toast.info('Please enter your password to complete login.');
        } else {
          toast.error(data.error || 'Invalid verification code');
          setVerificationCode(['', '', '', '', '', '']);
          if (document.getElementById('verification-input-0')) {
            document.getElementById('verification-input-0').focus();
          }
        }
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error('❌ Verification error:', error);
    } finally {
      setVerificationLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);

    try {
      const deviceFingerprint = DeviceFingerprint.generate();
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verificationEmail,
          action: 'resend',
          clientDeviceHash: deviceFingerprint.hash,
          clientDeviceToken: localStorage.getItem('device_token')
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('New verification code sent! Check your email.');
        setCountdown(60);
        setVerificationCode(['', '', '', '', '', '']);
        if (document.getElementById('verification-input-0')) {
          document.getElementById('verification-input-0').focus();
        }
      } else {
        toast.error(data.error || 'Failed to resend code');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  // Handle main login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🚀 Login form submitted');
    console.log('📧 Email:', formData.email);
    
    if (!isForgotMode) {
      if (!agreedToTerms) {
        toast.error("Verification Required: Please accept the Terms of Access before proceeding.");
        return;
      }

      if (!formData.email || !formData.password) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else {
      if (!formData.email) {
        toast.error("Please enter your email address");
        return;
      }
      
      const loadingToast = toast.loading("Sending recovery instructions...");
      setTimeout(() => {
        toast.dismiss(loadingToast);
        toast.success("Recovery email sent! Check your inbox.");
        setIsForgotMode(false);
      }, 2000);
      return;
    }

    setIsLoading(true);
    
    const loadingToast = toast.loading('Checking please wait...');

    try {
      const localStorageCheck = LocalStorageManager.checkVerificationRequirement(true);
      const deviceFingerprint = DeviceFingerprint.generate();
      
      console.log('📊 Device verification check result:', {
        requiresVerification: localStorageCheck.requiresVerification,
        reason: localStorageCheck.reason,
        loginCount: localStorageCheck.loginCount,
        hasDeviceToken: !!localStorageCheck.deviceToken
      });
      
      if (!localStorageCheck.requiresVerification && localStorageCheck.deviceToken) {
        console.log('✅ Device is trusted - attempting direct login');
        
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            clientDeviceToken: localStorageCheck.deviceToken,
            clientLoginCount: localStorageCheck.loginCount || 0,
            clientDeviceHash: deviceFingerprint.hash,
            action: 'login',
            skipDeviceCheck: true
          }),
        });

        const data = await response.json();
        
        console.log('📩 Direct login response:', {
          success: data.success,
          hasToken: !!data.token,
          deviceTrusted: data.deviceTrusted
        });

        toast.dismiss(loadingToast);

        if (response.ok && data.success) {
          const newLoginCount = LocalStorageManager.incrementLoginCount();
          
          if (data.token) {
            LocalStorageManager.storeAuthData(data.token, data.user);
          }
          
          if (data.deviceToken) {
            LocalStorageManager.storeDeviceData(data.deviceToken, deviceFingerprint.hash, newLoginCount);
          }
          
          toast.success(`Welcome back, ${data.user?.name || 'Admin'}! 🎉`);
          
          console.log('✅ Direct login successful. Login count:', newLoginCount);

          setTimeout(() => {
            router.push('/MainDashboard');
          }, 1500);
          
          return;
        } else {
          console.log('⚠️ Direct login failed, falling back to normal flow');
          toast.dismiss(loadingToast);
        }
      }
      
      console.log('🔐 Device verification required, reason:', localStorageCheck.reason);
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          clientDeviceToken: localStorageCheck.deviceToken,
          clientLoginCount: localStorageCheck.loginCount || 0,
          clientDeviceHash: deviceFingerprint.hash,
          action: 'login'
        }),
      });

      const data = await response.json();
      
      console.log('📩 Login response:', {
        success: data.success,
        requiresVerification: data.requiresVerification,
        reason: data.reason,
        shouldResetAfterVerification: data.shouldResetAfterVerification
      });

      toast.dismiss(loadingToast);

      if (response.ok && data.requiresVerification === true) {
        console.log('🔐 Verification required, reason:', data.reason);
        
        setVerificationReason(data.reason || 'security_check');
        setVerificationEmail(data.email || formData.email);
        setShowVerificationModal(true);
        setCountdown(60);
       
        const resetHint = data.shouldResetAfterVerification 
          ? "After verification, your device login counts will be reset to give you 15 fresh logins."
          : "";
        
        if (data.shouldResetAfterVerification) {
          toast.info(`Device verification required. ${resetHint}`);
        } else {
          toast.info('Device verification required. Check your email.');
        }
        
        setRequiresPasswordAfterVerification(false);
        setPasswordAfterVerification('');
        
      } else if (data.success) {
        console.log('✅ Login successful - No OTP needed');
        
        if (data.token) {
          LocalStorageManager.storeAuthData(data.token, data.user);
        }

        if (data.deviceToken) {
          LocalStorageManager.storeDeviceData(data.deviceToken, deviceFingerprint.hash, data.loginCount || 1);
        }

        toast.success(`Welcome back, ${data.user.name || 'Admin'}! 🎉`);

        setTimeout(() => {
          router.push('/MainDashboard');
        }, 1500);
        
      } else {
        console.log('❌ Login failed:', data.error);
        toast.error(data.error || 'Login failed. Please try again.');
      }
      
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Network error. Please check your connection.');
      console.error('❌ Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close verification modal
  const closeVerificationModal = () => {
    setShowVerificationModal(false);
    setVerificationCode(['', '', '', '', '', '']);
    setVerificationLoading(false);
    setRequiresPasswordAfterVerification(false);
    setPasswordAfterVerification('');
  };

  // Handle password submit after verification
  const handlePasswordAfterVerification = async () => {
    if (!passwordAfterVerification) {
      toast.error('Please enter your password');
      return;
    }
    
    setVerificationLoading(true);
    
    try {
      const deviceFingerprint = DeviceFingerprint.generate();
      const localStorageCheck = LocalStorageManager.checkVerificationRequirement();
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verificationEmail,
          password: passwordAfterVerification,
          verificationCode: verificationCode.join(''),
          action: 'verify_password',
          clientDeviceToken: localStorageCheck.deviceToken,
          clientLoginCount: localStorageCheck.loginCount,
          clientDeviceHash: deviceFingerprint.hash
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        if (data.countsWereReset) {
          console.log('🔄 Backend reset device counts. New count:', data.loginCount);
          
          LocalStorageManager.clearLoginData();
          
          if (data.deviceToken) {
            LocalStorageManager.storeDeviceData(
              data.deviceToken, 
              deviceFingerprint.hash, 
              data.loginCount || 1
            );
          }
          
          toast.success('Login successful! Device verification counts have been reset.');
        } else {
          if (data.deviceToken) {
            LocalStorageManager.storeDeviceData(data.deviceToken, deviceFingerprint.hash, data.loginCount || 1);
          }
          
          toast.success('Login successful!');
        }
        
        if (data.token) {
          LocalStorageManager.storeAuthData(data.token, data.user);
        }
        
        setShowVerificationModal(false);
        setVerificationCode(['', '', '', '', '', '']);
        setVerificationEmail('');
        setPasswordAfterVerification('');
        setRequiresPasswordAfterVerification(false);
        
        if (data.countsWereReset) {
          toast.info('Device verification counts have been reset. You now have 15 fresh logins available.');
        }
        
        setTimeout(() => {
          router.push('/MainDashboard');
        }, 1000);
      } else {
        toast.error(data.error || 'Invalid credentials');
        setPasswordAfterVerification('');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error('❌ Password verification error:', error);
    } finally {
      setVerificationLoading(false);
    }
  };

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <Toaster
        position={isMobile ? "top-center" : "top-right"}
        expand={false}
        richColors
        closeButton
      />

      {/* Password Reset Modal */}
      {showPasswordResetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-[9999]">
          {/* Modal content */}
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 z-[9999] animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md my-auto bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
            
            <div className="relative p-5 sm:p-6 bg-gradient-to-r from-black to-green-700 text-white shrink-0 border-b-4 border-green-400">
              <button
                onClick={closeVerificationModal}
                className="absolute top-3 right-3 p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-90"
              >
                <X className="w-5 h-5 text-green-300" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center shrink-0 border border-white/20">
                  <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-green-300" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight uppercase">
                    {requiresPasswordAfterVerification ? 'Final Access' : 'Identity Check'}
                  </h3>
                  <p className="text-green-200 text-[10px] sm:text-xs font-semibold uppercase tracking-widest opacity-80">
                    {requiresPasswordAfterVerification ? 'Portal Authorization' : 'Secure Campus Network'}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-400 text-black rounded-md shadow-sm">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black whitespace-nowrap uppercase tracking-tighter">
                  {verificationReason?.replace(/_/g, ' ') || 'SECURITY PROTOCOL'}
                </span>
              </div>
            </div>
            
            <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar bg-gray-50/30">
              {!requiresPasswordAfterVerification ? (
                <>
                  <div className="mb-6 text-center">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-3">
                      Authorization Code Sent To:
                    </p>
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-3 shadow-inner">
                      <p className="text-gray-900 font-bold text-sm break-all">{verificationEmail}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="grid grid-cols-6 gap-2 mb-5">
                      {verificationCode.map((digit, index) => (
                        <input
                          key={index}
                          id={`verification-input-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                          onKeyDown={(e) => handleVerificationKeyDown(index, e)}
                          className="w-full aspect-square text-center text-xl font-bold bg-white border-2 border-gray-300 rounded-lg focus:border-black focus:ring-4 focus:ring-black/20 outline-none transition-all text-gray-900"
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 bg-gray-100 py-2 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-green-500" />
                      <span>Expires in: <span className="text-gray-900 font-mono">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span></span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mb-6">
                  <p className="text-gray-800 text-sm mb-4 font-bold">
                    Identity Confirmed. Enter Portal Password:
                  </p>
                  <div className="relative group">
                    <input
                      type="password"
                      value={passwordAfterVerification}
                      onChange={(e) => setPasswordAfterVerification(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-4 pl-5 pr-12 bg-white border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/20 outline-none transition-all text-gray-900 font-bold"
                      autoFocus
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors w-5 h-5" />
                  </div>
                </div>
              )}
              
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={requiresPasswordAfterVerification ? handlePasswordAfterVerification : handleVerifyCode}
                  disabled={verificationLoading || (!requiresPasswordAfterVerification && verificationCode.join('').length !== 6)}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-black to-green-600 text-white rounded-xl font-bold text-sm tracking-widest shadow-xl hover:from-gray-900 hover:to-green-700 active:scale-[0.98] transition-all disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-300"
                >
                  {verificationLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="capitalize text-sm font-medium">Verifying...</span>
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="uppercase tracking-widest">
                        {requiresPasswordAfterVerification ? 'Grant Access' : 'Authorize Device'}
                      </span>
                    </>
                  )}
                </button>

                {!requiresPasswordAfterVerification && (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendLoading || countdown > 0}
                    className="w-full py-2 text-black font-black text-[10px] uppercase tracking-widest hover:text-green-600 transition-colors disabled:opacity-30"
                  >
                    Didn't receive code? <span className="text-green-600 underline underline-offset-4">Request New</span>
                  </button>
                )}
              </div>

              <div className="mt-8 pt-5 border-t-2 border-dashed border-gray-200">
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <ShieldAlert className="w-4 h-4 text-black" />
                  </div>
                  <p className="text-[10px] leading-relaxed text-gray-600 font-bold uppercase tracking-tight">
                    School Security Protocol: This session is encrypted. Unauthorized access attempts are logged and reported to Matungulu ICT Staff.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 z-[9999] animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl my-auto bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="relative p-5 sm:p-6 bg-gradient-to-r from-black to-green-700 text-white shrink-0 border-b-4 border-green-400">
              <button
                onClick={closeTermsModal}
                className="absolute top-3 right-3 p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-90"
              >
                <X className="w-5 h-5 text-green-300" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center shrink-0 border border-white/20">
                  <ShieldAlert className="w-6 h-6 md:w-7 md:h-7 text-green-300" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight uppercase">
                    Terms & Conditions
                  </h3>
                  <p className="text-green-200 text-[10px] sm:text-xs font-semibold uppercase tracking-widest opacity-80">
                    Authorized Access Only
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar bg-gray-50/30">
              
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-green-900 text-sm uppercase tracking-wide mb-1">
                      ⚠️ Legal Warning
                    </h4>
                    <p className="text-xs sm:text-sm text-green-800 font-bold leading-relaxed">
                      Unauthorized access to this system is strictly prohibited and will be treated as a cyber crime under the Computer Misuse and Cybercrimes Act. All access attempts are logged and monitored. Violators will face legal prosecution to the fullest extent of the law.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 text-gray-800">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-black text-gray-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-700" />
                    1. Authorized Use
                  </h5>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    This administrative portal is exclusively for authorized Matungulu Girls' High School personnel. Access credentials are personal and non-transferable. Any sharing of credentials constitutes a security breach and will result in immediate revocation of access privileges and potential legal action.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-black text-gray-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-700" />
                    2. Data Protection & Privacy
                  </h5>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    All student, staff, and institutional data accessed through this portal is protected under the Data Protection Act. Users are legally obligated to maintain confidentiality and must not disclose, copy, or misuse any information obtained through this system.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-black text-gray-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-700" />
                    3. Monitoring & Logging
                  </h5>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    All activities within this portal are subject to continuous monitoring and logging. These logs are regularly reviewed and may be used as evidence in disciplinary or legal proceedings.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-black text-gray-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-green-700" />
                    4. Security Obligations
                  </h5>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    Users must ensure their devices meet minimum security standards. Access from public or unsecured networks is prohibited. Users are responsible for immediately reporting any suspected security incidents.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-black text-gray-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4 text-green-700" />
                    5. Institutional Compliance
                  </h5>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    By accessing this portal, you acknowledge your understanding of and compliance with all Matungulu Girls' High School ICT policies and applicable Kenyan laws.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-200 rounded-lg">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-wide text-gray-800 text-center">
                  ⚡ This system is protected by advanced security protocols. 
                  Unauthorized access attempts trigger immediate alerts.
                </p>
              </div>
            </div>
            
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-white shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setAgreedToTerms(true);
                    closeTermsModal();
                    toast.success('You have accepted the Terms & Conditions');
                  }}
                  className="flex-1 bg-gradient-to-r from-black to-green-700 text-white py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:from-gray-900 hover:to-green-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  I Understand & Accept
                </button>
                <button
                  onClick={closeTermsModal}
                  className="flex-1 bg-gray-100 text-black py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-all active:scale-[0.98]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Login Page Layout - Matungulu Girls Version */}
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 font-sans flex items-center justify-center">
        <div className="w-full h-screen grid md:grid-cols-2">
          
          {/* Left Panel - Form (Swapped position) */}
          <div className="min-h-screen bg-white/80 backdrop-blur-sm p-6 sm:p-12 flex flex-col justify-start">
            <div className="w-full max-w-md mr-0 md:mr-[15%] ml-auto">
              {/* Mobile Logo */}
              <div className="md:hidden text-center mb-8">
                <Image
                  src="/matungulu.png"
                  alt="Matungulu Logo"
                  width={60}
                  height={60}
                  className="rounded-full mx-auto mb-4 shadow-sm border-2 border-gray-300"
                />
              </div>

              <div className="mb-8 sm:mb-10 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-green-700" />
                  <span className="text-xs font-bold uppercase tracking-widest text-green-700">Empowering Young Women</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-black to-green-700 tracking-tight mb-3">
                  {isForgotMode ? "Recover Access" : "Welcome Back"}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  {isForgotMode 
                    ? "Enter your email address below and we'll send you a secure recovery link." 
                    : "Please enter your official credentials to access the Matungulu Girls' administrative dashboard."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-gray-700 mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="admin@matungulu.ac.ke"
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50/50 border text-gray-900 font-semibold border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:bg-white transition-all shadow-sm text-sm sm:text-base"
                    />
                  </div>
                </div>

                {!isForgotMode && (
                  <>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-gray-700">
                          Password
                        </label>
                        <button 
                          type="button"
                          onClick={() => router.push("/pages/forgotpassword")}
                          className="text-[10px] sm:text-xs md:text-sm font-bold text-green-700 hover:underline transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          placeholder="••••••••"
                          className="w-full pl-12 pr-12 py-3.5 sm:py-4 text-gray-900 font-semibold bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:bg-white transition-all shadow-sm text-sm sm:text-base"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700 transition-colors p-1"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-start justify-between">
                        <label className="flex items-start gap-3 cursor-pointer group flex-1">
                          <input 
                            type="checkbox" 
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="mt-0.5 h-5 w-5 cursor-pointer rounded border-gray-300 text-green-700 focus:ring-green-700 transition"
                          />
                          <span className="text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">
                            I agree to the{' '}
                            <button 
                              type="button"
                              onClick={openTermsModal}
                              className="font-bold text-green-700 hover:underline"
                            >
                              Terms & Conditions
                            </button>
                          </span>
                        </label>
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={rememberDevice}
                          onChange={(e) => setRememberDevice(e.target.checked)}
                          className="mt-0.5 h-5 w-5 cursor-pointer rounded border-gray-300 text-green-700 focus:ring-green-700 transition"
                        />
                        <span className="text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">
                          Keep me logged in on this device
                        </span>
                      </label>
                    </div>
                  </>
                )}

                <button 
                  type="submit"
                  disabled={isLoading || (!isForgotMode && !agreedToTerms)}
                  className="w-full bg-gradient-to-r from-black to-green-700 text-white py-4 rounded-xl font-bold text-base sm:text-lg hover:from-gray-900 hover:to-green-800 active:scale-[0.98] transition-all disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed shadow-lg shadow-gray-200 flex items-center justify-center gap-3 mt-4"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>{isForgotMode ? "Send Reset Link" : "Sign In to Portal"}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {isForgotMode && (
                  <button
                    type="button"
                    onClick={() => setIsForgotMode(false)}
                    className="w-full text-center text-xs sm:text-sm font-bold text-gray-600 hover:text-green-700 transition-colors pt-4"
                  >
                    &larr; Return to login
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Right Panel - Branding (Swapped position with feminine design) */}
          <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black text-white px-16 py-20 lg:px-24 overflow-hidden border-l border-white/5">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-green-700 blur-3xl"></div>
              <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-gray-500 blur-3xl"></div>
            </div>
            
            <div className="absolute inset-0 bg-cover bg-center opacity-20 transition-transform duration-100"
              style={{ backgroundImage: "url('/hero/MatG.jpg')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-gray-950/30 to-black/40"></div>
            
            <div className="relative z-10 flex flex-col h-full w-full">
              <div className="mb-auto">
                <Link href="/" className="flex items-center gap-5 group transition-transform hover:translate-x-1">
                  <div className="relative p-1 bg-white/10 rounded-full backdrop-blur-xl border border-gray-300/30 shadow-2xl">
                    <Image
                      src="/MatG.jpg"
                      alt="Matungulu Logo"
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    <div className="absolute inset-0 rounded-full bg-green-700/20 animate-pulse"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black tracking-tighter leading-none uppercase">
                      Matungulu <span className="text-green-600">Girls'</span>
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.4em] text-green-700/80 uppercase mt-1">
                      Senior School
                    </span>
                  </div>
                </Link>
              </div>

              <div className="my-auto py-10 sm:py-12 px-4 max-w-md mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-700/20 border border-green-700/30 text-gray-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-5 sm:mb-6">
                  <Heart size={14} className="fill-green-700" />
                  Authorized Personnel Only
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-5 sm:mb-6">
                  Secure{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-gray-300">
                    Admin
                  </span>{" "}
                  Portal
                </h1>
                <p className="text-sm sm:text-md text-gray-100/90 font-medium leading-relaxed max-w-xs sm:max-w-sm mx-auto">
                  Enter your credentials to securely access Matungulu Girls' administrative system, manage operations, and empower young women through excellence in education.
                </p>
                
                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wide text-gray-200 border border-green-700/30">
                    <Flower2 className="inline w-3 h-3 mr-1" />
                    Excellence
                  </span>
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wide text-white border border-white/30">
                    Integrity
                  </span>
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wide text-gray-200 border border-green-700/30">
                    Leadership
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-8 mb-[5%] border-t border-green-700/20">
                <div className="flex flex-col gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">School Motto</p>
                    <p className="text-2xl font-black italic tracking-tight text-white drop-shadow-md">
                      "Empower • Excel • Lead"
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-200 tracking-widest uppercase mt-4">
                    <span>&copy; {new Date().getFullYear()} Matungulu Girls' High</span>
                    <span className="flex items-center gap-2">
                      <Server size={10} />
                      Commited to Excellence              
                      </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}