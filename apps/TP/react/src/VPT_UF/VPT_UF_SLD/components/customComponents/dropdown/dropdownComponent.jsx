import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import React from 'react';

export default function DropdownComponent() {
  const items = [
    {
      key: 'new',
      label: 'New file',
    },
    {
      key: 'copy',
      label: 'Copy link',
    },
    {
      key: 'edit',
      label: 'Edit file',
    },
    {
      key: 'delete',
      label: 'Delete file',
    },
  ];

  return (
    <div className=" p-2">
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="bordered"
            className="w-[100%] border-2 border-[#323B45] text-black dark:text-white"
          ></Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Dynamic Actions" items={items}>
          {(item) => (
            <DropdownItem
              key={item.key}
              color={item.key === 'delete' ? 'danger' : 'default'}
              className={item.key === 'delete' ? 'text-danger' : ''}
            >
              {item.label}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

//==========================================================>
//React aria component

// import React from "react";
// import { useButton } from "@react-aria/button";
// import { useMenuTrigger } from "@react-aria/menu-button";
// import { useMenu, useMenuItem } from "@react-aria/menu";
// import { useListState } from "@react-stately/list";
// import { useOverlay, useOverlayPosition } from "@react-aria/overlays";
// import { DismissButton, OverlayContainer } from "@react-aria/overlays";

// function CustomDropdown({ items, onAction }) {
//   const state = useListState({ items });

//   const triggerRef = React.useRef();
//   const overlayRef = React.useRef();
//   const { triggerProps, menuProps } = useMenuTrigger(
//     { type: "menu" },
//     state,
//     triggerRef,
//   );

//   const { overlayProps, placement, updatePosition } = useOverlayPosition({
//     targetRef: triggerRef,
//     overlayRef,
//     placement: "bottom left",
//     offset: 8,
//     isOpen: state.isOpen,
//     onClose: state.close,
//   });

//   const { buttonProps } = useButton(triggerProps, triggerRef);
//   const { menuProps: menuAriaProps } = useMenu(menuProps, state, overlayRef);

//   React.useEffect(() => {
//     if (state.isOpen) {
//       updatePosition();
//     }
//   }, [state.isOpen, updatePosition]);

//   return (
//     <div>
//       <button
//         {...buttonProps}
//         ref={triggerRef}
//         className="w-full border-2 border-[#323B45] p-2 text-black dark:text-white"
//       >
//         Open Dropdown
//       </button>

//       {state.isOpen && (
//         <OverlayContainer>
//           <div
//             {...overlayProps}
//             ref={overlayRef}
//             className={`absolute z-50 mt-2 w-full rounded-md border border-gray-300 bg-white shadow-lg`}
//             style={{
//               left: placement === "bottom left" ? "0" : undefined,
//               right: placement === "bottom right" ? "0" : undefined,
//             }}
//           >
//             <DismissButton onDismiss={state.close} />
//             <ul
//               {...menuAriaProps}
//               className="m-0 list-none p-1"
//               style={{ outline: "none" }}
//             >
//               {Array.from(state.collection).map((item) => (
//                 <CustomDropdownItem
//                   key={item.key}
//                   item={item}
//                   state={state}
//                   onAction={onAction}
//                 />
//               ))}
//             </ul>
//             <DismissButton onDismiss={state.close} />
//           </div>
//         </OverlayContainer>
//       )}
//     </div>
//   );
// }

// function CustomDropdownItem({ item, state, onAction }) {
//   const ref = React.useRef();
//   const { menuItemProps } = useMenuItem(
//     {
//       key: item.key,
//       onAction,
//       closeOnSelect: true,
//     },
//     state,
//     ref,
//   );

//   return (
//     <li
//       {...menuItemProps}
//       ref={ref}
//       className={`cursor-pointer select-none rounded-md p-2 hover:bg-gray-200 ${
//         item.key === "delete" ? "text-red-500" : ""
//       }`}
//     >
//       {item.rendered}
//     </li>
//   );
// }

// export default function DropdownComponent() {
//   const items = [
//     {
//       key: "new",
//       label: "New file",
//     },
//     {
//       key: "copy",
//       label: "Copy link",
//     },
//     {
//       key: "edit",
//       label: "Edit file",
//     },
//     {
//       key: "delete",
//       label: "Delete file",
//     },
//   ];

//   return (
//     <div className="border border-red-500 p-2">
//       <CustomDropdown
//         items={items}
//         onAction={(key) => {
//           console.log(`Action: ${key}`);
//         }}
//       />
//     </div>
//   );
// }
