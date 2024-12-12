import React, { useContext, useState } from 'react';
import { BsBack } from 'react-icons/bs';
import { FabricContext } from '../commonComponents/App&FabricSelection/Fabrics';
import Main from './experimentalComponents/main';
const js = {
  data: [
    {
      mg1: [
        {
          mi1: {
            df: {
              modelkey: '',
              version: '',
              roles: '',
            },
            uf: {
              modelkey: '',
              version: '',
              roles: '',
            },
            pf: {
              modelkey: '',
              version: '',
              dfroles: '',
            },
            miroles: [],
          },
          mi2: {
            df: {
              modelkey: '',
              version: '',
              roles: '',
            },
            uf: {
              modelkey: '',
              version: '',
              roles: '',
            },
            pf: {
              modelkey: '',
              version: '',
              dfroles: '',
            },
            miroles: [],
          },
          mi3: {
            df: {
              modelkey: '',
              version: '',
              roles: '',
            },
            uf: {
              modelkey: '',
              version: '',
              roles: '',
            },
            pf: {
              modelkey: '',
              version: '',
              dfroles: '',
            },
            miroles: [],
          },
        },
      ],
      mg2: [
        {
          mi1: {
            df: {
              modelkey: '',
              version: '',
              roles: '',
            },
            uf: {
              modelkey: '',
              version: '',
              roles: '',
            },
            pf: {
              modelkey: '',
              version: '',
              dfroles: '',
            },
            miroles: [],
          },
          mi2: {
            df: {
              modelkey: '',
              version: '',
              roles: '',
            },
            uf: {
              modelkey: '',
              version: '',
              roles: '',
            },
            pf: {
              modelkey: '',
              version: '',
              dfroles: '',
            },
            miroles: [],
          },
          mi3: {
            df: {
              modelkey: '',
              version: '',
              roles: '',
            },
            uf: {
              modelkey: '',
              version: '',
              roles: '',
            },
            pf: {
              modelkey: '',
              version: '',
              dfroles: '',
            },
            miroles: [],
          },
        },
      ],
    },
  ],
};
export default function DJUIMain() {
  const [visiblity, setVisiblity] = useState(js);
  const setSelectedFabric = useContext(FabricContext);

  return (
    <div className="h-full w-full bg-white">
      <span onClick={() => setSelectedFabric(null)}>
        <BsBack />
      </span>
      <div className="h-[95%] w-full">
        <Main json={visiblity} setjson={setVisiblity} />
      </div>
    </div>
  );
}
