import { NextUIProvider } from '@nextui-org/react';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import FlowWithProviderUF from './components/App';

/**
 * Renders the main component for the UFD application.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.appGroup - The group of the application.
 * @param {string} props.tenant - The tenant of the application.
 * @param {string} props.application - The name of the application.
 * @param {string} props.currentFabric - The current fabric of the application.
 * @return {JSX.Element} The rendered component.
 */
export default function UFDMain({ props }) {
  return (
    <NextUIProvider style={{ width: '100%', height: '100%' }}>
      <>
        <FlowWithProviderUF {...props} />
      </>
    </NextUIProvider>
  );
}
