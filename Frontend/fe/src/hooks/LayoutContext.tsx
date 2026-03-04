// import React, { createContext, useState } from 'react';

// // 1. Định nghĩa kiểu dữ liệu cho Context
// interface LayoutContextType {
//   open: boolean;
//   setOpen: (open: boolean) => void;
//   title: string;
//   setTitle: (title: string) => void;
// }

// const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// // 2. Provider: Bọc các component để chúng có thể dùng dữ liệu
// export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [open, setOpen] = useState(true);
//   const [title, setTitle] = useState("Dashboard");

//   return (
//     <LayoutContext.Provider value={{ open, setOpen, title, setTitle }}>
//       {children}
//     </LayoutContext.Provider>
//   );
// };




