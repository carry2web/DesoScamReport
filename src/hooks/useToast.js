import { toast } from 'react-toastify';

export const useToast = () => {

  const defaultOptions = {
    closeButton: true,
    icon: false,
  };

  return {
    showToast: (msg, options = {}) =>
      toast(msg, { ...defaultOptions, ...options }),

    showSuccessToast: (msg, options = {}) =>
      toast.success(msg, { ...defaultOptions, autoClose: 5000, ...options }),

    showErrorToast: (msg, options = {}) =>
      toast.error(msg, { ...defaultOptions, autoClose: 7000, ...options }),

    showWarningToast: (msg, options = {}) =>
      toast.warn(msg, { ...defaultOptions, autoClose: 7000, ...options }),

    showInfoToast: (msg, options = {}) =>
      toast.info(msg, { ...defaultOptions, autoClose: 5000, ...options }),
  };
};
