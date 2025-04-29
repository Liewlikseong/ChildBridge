import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  const showToast = (message, type = 'success', options = {}) => {
    return toast(message, {
      type,
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  };

  return {
    provide: {
      toast: {
        success: (message, options) => showToast(message, 'success', options),
        error: (message, options) => showToast(message, 'error', options),
        info: (message, options) => showToast(message, 'info', options),
        warning: (message, options) => showToast(message, 'warning', options)
      }
    }
  };
});