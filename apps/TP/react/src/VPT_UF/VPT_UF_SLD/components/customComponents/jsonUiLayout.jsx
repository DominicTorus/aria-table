/* eslint-disable */
import React from 'react';
import ButtonComponent from './Button/ButtonComponent';
import { DateInputComponent } from './date/DateInputComponent';
import FormComponent from './Form/FormComponent';
import InputComponent from './Input/InputComponent';
import NavigationBar from './Navdata/navbar';
import { RadioComponent } from './radio/RadioComponent';
import SideNavbar from './SIdebar/SideNavbar';
import TableItems from './Tabledata/tableItem';
import { TextareaComponent } from './textarea/TextareaComponent';
import { TimeInputComponent } from './Time/TimeInputComponent';

/**
 * Renders a layout based on the provided JSON data. The layout consists of various components such as
 * NavigationBar, TableItems, FormComponent, SideNavbar, ButtonComponent, InputComponent, RadioComponent,
 * TextareaComponent, TimeInputComponent, and DateInputComponent. The position and size of each component
 * is calculated based on the provided JSON data and the width of the layout container.
 *
 * @param {Object} props - The props object containing the following properties:
 *   @property {Array} nodejson - An array of JSON objects representing the layout components.
 *   @property {number} width - The width of the layout container.
 *   @property {number} height - The height of the layout container.
 *   @property {Function} stateTrack - A function to track the state of the layout.
 *   @property {Object} json - The JSON data used to render the layout components.
 * @return {JSX.Element} The rendered layout.
 */
const JsonUiLayout = ({ nodejson, width, height, stateTrack, json }) => {
  const CalculatePercent = (x, y) => {
    return (x / y) * 100 + '%';
  };

  const RenderComp = ({ item }) => {
    switch (item.type) {
      case 'navbar':
        return (
          <NavigationBar
            height={item.height}
            stateTrack={stateTrack}
            json={item.data.json}
          />
        );
      case 'table':
        return (
          <TableItems
            height={item.height}
            stateTrack={stateTrack}
            json={json}
          />
        );
      case 'form':
        return (
          <FormComponent
            height={item.height}
            width={item.width}
            stateTrack={stateTrack}
            json={json}
          />
        );
      case 'sidebarnav':
        return (
          <SideNavbar
            height={item.height}
            width={item.width}
            stateTrack={stateTrack}
            json={json}
          />
        );
      case 'button':
        return (
          <ButtonComponent
            height={item.height}
            width={item.width}
            stateTrack={stateTrack}
            json={json}
          />
        );
      case 'input':
        return (
          <InputComponent
            height={item.height}
            width={item.width}
            stateTrack={stateTrack}
            json={json}
          />
        );
      case 'radiogroup':
        return (
          <RadioComponent
            height={item.height}
            width={item.width}
            stateTrack={stateTrack}
            json={json}
          />
        );
      case 'textarea':
        return (
          <TextareaComponent
            height={item.height}
            width={item.width}
            stateTrack={stateTrack}
            json={json}
          />
        );
      case 'timeinput':
        return (
          <TimeInputComponent
            height={item.height}
            width={item.width}
            stateTrack={stateTrack}
            json={json}
          />
        );
      case 'dateinput':
        return (
          <DateInputComponent
            height={item.height}
            width={item.width}
            stateTrack={stateTrack}
            json={json}
          />
        );
      default:
        return <p>D E F A U L T</p>;
    }
  };

  return (
    <div className="relative h-screen" style={{ width: width }}>
      {nodejson.map((item, index) => {
        if (item.type !== 'group') {
          return (
            <div
              style={{
                position: 'absolute',
                left: CalculatePercent(
                  item.positionAbsolute
                    ? item.positionAbsolute.x
                    : item.position.x,
                  width,
                ),
                top: item.positionAbsolute
                  ? item.positionAbsolute.y
                  : item.position.y,
                width: CalculatePercent(item.width, width),
                height: item.height,
              }}
            >
              <RenderComp item={item} />
            </div>
          );
        }
      })}
    </div>
  );
};

export default JsonUiLayout;
