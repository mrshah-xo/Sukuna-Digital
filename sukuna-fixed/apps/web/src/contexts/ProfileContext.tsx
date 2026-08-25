'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/services/api-client';


export interface ProfileData {
  name: string;
  studentId: string;
  class: string;
  rollNo: string;
  profilePicture: string;
  attendance: number;
  gpa: number;
  starPoints: number;
  dateOfBirth: string;
  bloodGroup: string;
  email: string;
  phone: string;
  address: string;
  showAcademicInfo: boolean;
}

interface ProfileContextType {
  profileData: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within ProfileProvider');
  return context;
};


export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    studentId: '',
    class: '',
    rollNo: '',
    profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    attendance: 0,
    gpa: 0,
    starPoints: 0,
    dateOfBirth: '',
    bloodGroup: '',
    email: '',
    phone: '',
    address: '',
    showAcademicInfo: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get<any>('/users/me');
        if (response.data?.success && response.data?.data) {
          setProfileData(prev => ({ ...prev, ...response.data.data }));
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  return (
    <ProfileContext.Provider value={{ profileData, updateProfile }}>
      {!loading && children}
    </ProfileContext.Provider>
  );
}

