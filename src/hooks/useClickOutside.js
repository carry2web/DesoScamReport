import { useEffect } from 'react';

export const useClickOutside = (refOrRefs, callback) => {
  useEffect(() => {
    const refs = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs];

    const handleClickOutside = (e) => {
      const isInsideAny = refs.some(
        (ref) => ref.current && ref.current.contains(e.target)
      );
      if (!isInsideAny) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [refOrRefs, callback]);
};


// import { useEffect } from 'react';

// export const useClickOutside = (refs, callback) => {
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       const isInsideAnyRef = refs.some(
//         (ref) => ref.current && ref.current.contains(e.target)
//       );
//       if (!isInsideAnyRef) {
//         callback();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [refs, callback]);
// };

// import { useEffect } from 'react';

// export const useClickOutside = (ref, callback) => {
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) {
//         callback();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [ref, callback]);
// };
