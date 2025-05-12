import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';

export const useCreateAndRemoveToast = (
  isValue: boolean,
  message: string | undefined,
  type: string = 'loading',
) => {
  const [newValue, setNewValue] = useState(false);
  const [newStr, setNewStr] = useState('');
  useEffect(() => {
    if (message === undefined) return;
    else {
      setNewValue(isValue);
      setNewStr(message);
    }
  }, [isValue, message]);
  useMemo(() => {
    switch (type) {
      case 'loading':
        if (newValue) {
          toast.dismiss();
          toast.success(newStr);
          setNewValue(false);
          setNewStr('');
        }
        break;
      case 'error':
        if (newValue) {
          setTimeout(() => {
            toast.dismiss();
            toast.error(newStr);
            setNewValue(false);
            setNewStr('');
          }, 1000);
        }
        break;
      case 'success':
        if (newValue) {
          setTimeout(() => {
            toast.dismiss();
            toast.success(newStr);
            setNewValue(false);
            setNewStr('');
          }, 1000);
        }
        break;
    }
  }, [newStr, newValue, type]);
};
