'use client';

import { ToastContainer } from 'react-toastify';

export const ToastUI = () => (
    <ToastContainer
        position="bottom-right"
        //autoClose={false}
        limit={5}     // ✅ max 5 visible toasts at a time
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
        icon={false}  // ✅ This disables all toast icons
    />  
);
