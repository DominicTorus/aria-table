import { useState } from 'react';
import JsonViewer from './screens/JsonViewer';

function MapperMain({ source, target, mapping, setMapperIframe }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (data) => {
    setIsMenuOpen(data != 'undefined' ? data : !isMenuOpen);
  };
  return (
    <>
      <div>
        <JsonViewer
          menuToggle={toggleMenu}
          source={source}
          target={target}
          mapping={mapping}
          setMapperIframe={setMapperIframe}
        />
      </div>
    </>
  );
}

export default MapperMain;
