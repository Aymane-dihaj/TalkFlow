import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { create } from 'zustand'


export const useImgStore = create((set) => ({
    images: [],
    pushImg: (url) => set((state) => {

      const newImages = [...state.images, url];
      if (newImages.length > 3) {
        newImages.shift(); // Remove the oldest image to keep only the last 3
      }
      return { images: newImages };
    }),
  }));