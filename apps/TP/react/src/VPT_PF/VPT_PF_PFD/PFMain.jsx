/* eslint-disable */
import { useState } from 'react';
import App from './components/App';

function PFMain({ tenant, appGroup, fabrics, application, currentFabric }) {
  const [sendDataToFlow, setSendDataToFlow] = useState({
    node: [],
    edge: [],
    nodeConfig: {},
  });
  const [getDataFromFlow, setGetDataFromFlow] = useState({
    node: [],
    edge: [],
    nodeConfig: {},
  });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <App
        currentFabric={currentFabric}
        tenant={tenant}
        group={appGroup}
        fabrics={'PF'}
        application={application}
        getDataFromParent={sendDataToFlow}
        sendDataToParent={setGetDataFromFlow}
        admin={{ canAdd: true, canDelete: true, canEdit: true }}
      />
    </div>
  );
}

export default PFMain;
