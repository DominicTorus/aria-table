import React from "react";
import { Checkbox, Input, Label } from "react-aria-components";

export default function TorusCheckBox({
  children,
  isSelected,
  value,
  onChange,
}) {
  return (
    <div class="flex items-center">
      <Input
        type="checkbox"
        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <Label
        class="ms-2 text-gray-900 dark:text-gray-300"
      >
        {children}
      </Label>
    </div>
  );
}
