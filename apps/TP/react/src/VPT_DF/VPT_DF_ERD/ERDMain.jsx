import 'primereact/resources/themes/lara-light-cyan/theme.css';
import React from 'react';

/**
 * Renders the main component for the Entity-Relationship Diagram (ERD) application.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.appGroup - The application group.
 * @param {string} props.tenant - The tenant name.
 * @param {string} props.application - The application name.
 * @param {string} props.currentFabric - The current fabric.
 * @return {JSX.Element} The rendered main component.
 */
export default function ERDMain({
  appGroup,
  tenant,
  application,
  currentFabric,
}) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        position: 'relative',
      }}
    >
      {/* <App
        currentFabric={currentFabric}
        tenant={tenant}
        group={appGroup}
        fabrics={currentFabric}
        application={application}
      /> */}
    </div>
  );
}
