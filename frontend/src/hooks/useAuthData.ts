import axiosInstance from '@/helpers/axios-instance';
import { AuthData } from '@/lib/types';
import userState from '@/utils/user-state';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useAuthData = (): AuthData => {
  const location = useLocation();
  const user = userState.getUser();

  const [data, setData] = useState<AuthData>({
    _id: user?._id || '',
    role: user?.role || '',
    token: '',
    loading: true,
  });

  useEffect(() => {
    if (user?._id) {
      setData((prev) => ({
        ...prev,
        token: '',
      }));
    }
  }, [user?._id]);

  useEffect(() => {
    async function fetchToken() {
      if (!data._id) {
        setData((prev) => ({ ...prev, loading: false }));
        return;
      }
      try {
        const res = await axiosInstance.get(`/api/auth/check/${data._id}`);
        setData({
          ...data,
          token: res.data?.data,
          loading: false,
        });
      } catch (error) {
        setData({
          ...data,
          token: '',
          loading: false,
        });
      }
    }

    fetchToken();
  }, [location, data._id]);

  return data;
};

export default useAuthData;
