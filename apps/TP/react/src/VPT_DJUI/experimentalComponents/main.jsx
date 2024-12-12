import React, { useEffect, useState } from 'react';
import TreeMain from './components/treeStructure/TreeMain';

export default function Main({ json, setjson }) {
  const [jsondata, setJsondata] = useState(null);

  useEffect(() => {
    const jsClone = structuredClone(json);
    setJsondata(jsClone);
  }, [json]);

  return <TreeMain data={jsondata} setjson={setjson} path="" />;
}
