// // In DropdownWithNewOption.tsx

// import React, { useEffect, useState } from 'react';

// interface OptionType {
//     value: string;
//     label: string;
// }

// interface CustomDropdownProps {
//     options: OptionType[];
//     onSelect: (value: string) => void;
// }

// const DropdownWithNewOption: React.FC<CustomDropdownProps> = ({ options, onSelect }) => {
//     const [newOptionValue, setNewOptionValue] = useState('');
//     const [showInput, setShowInput] = useState(false);
//     const [cuisineOptions, setCuisineOptions] = useState<{name: string, _id: string}[]>([]);

//     useEffect(()=>{
//         (
//             async()=>{
//                 const cuisines = await
//             }
//         )()
//     })

//     const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedValue = event.target.value;
//         if (selectedValue === 'add-new') {
//             setShowInput(true);
//         } else {
//             onSelect(selectedValue);
//         }
//     };

//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const newValue = event.target.value;
//         setNewOptionValue(newValue);
//         onSelect(newValue);
//     };

//     return (
//         <div className="relative inline-block w-full text-gray-700">
//             <select
//                 className={`w-full px-4 py-2 pr-8 text-sm bg-white border rounded-lg shadow-md ${
//                     showInput ? 'hidden' : ''
//                 }`}
//                 onChange={handleOptionChange}
//             >
//                 {options.map((option) => (
//                     <option key={option.value} value={option.value}>
//                         {option.label}
//                     </option>
//                 ))}
//                 <option value="add-new">Add New</option>
//             </select>
//             {showInput && (
//                 <input
//                     type="text"
//                     className="w-full px-4 py-2 text-sm bg-white border rounded-lg shadow-md"
//                     value={newOptionValue}
//                     onChange={handleInputChange}
//                     autoFocus
//                 />
//             )}
//         </div>
//     );
// };

// export default DropdownWithNewOption;
