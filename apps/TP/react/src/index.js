/* eslint-disable */
import 'primereact/resources/primereact.min.css';
import React, { Suspense, lazy, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import 'primereact/resources/themes/saga-blue/theme.css';

import { MainpageLoader, Subloader } from './asset/SvgsApplication';
import { DarkmodeProvider } from './commonComponents/context/DarkmodeContext';

import 'react-toastify/dist/ReactToastify.css';
import { ReactFlowProvider } from 'reactflow';

import { ToastContainer } from 'react-toastify';
import { getTheme } from './utils/utils';
import { ComponentProvider } from './VPT_UF/TM_GRID/contexts/Componet';

const Layout = lazy(() => import('./Layout'));

function App() {
  const [sessionToken, setSessionToken] = useState(null);

  const clientDetails = useMemo(() => {
    try {
      let params = new URL(document.location).searchParams;
      let tok = params.get('tk');

      if (tok) {
        let params = atob(tok);
        params = JSON.parse(params);
        return params;
      }

      return null;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const themes = useMemo(() => {
    try {
      if (clientDetails?.cfg_tm) {
        return getTheme(clientDetails?.cfg_tm);
      } else {
        return getTheme('eclipse');
      }
    } catch (error) {
      console.error(error);
    }
  }, [clientDetails?.cfg_tm]);

  const accentColor = useMemo(() => {
    try {
      if (clientDetails?.cfg_clr) {
        return clientDetails?.cfg_clr;
      } else {
        return '#0736c4';
      }
    } catch (error) {
      console.error(error);
    }
  }, [clientDetails?.cfg_clr]);

  const currentArtifactKey = useMemo(() => {
    try {
      return {
        tKey: clientDetails?.fngk,
        fabric: clientDetails?.fnk,
        project: clientDetails?.catalog,
        artifactGroup: clientDetails?.artifactGrp,
        artifact: clientDetails?.artifactName,
        version: clientDetails?.version,
      };
    } catch (error) {
      console.error(error);
    }
  }, [clientDetails]);

  return (
    <>
      <ToastContainer
        autoClose={300}
        style={{ zIndex: 99999 }}
        newestOnTop
        icon={false}
        pauseOnHover={true}
        hideProgressBar={false}
        closeOnClick={false}
        toastClassName={`z-[9999] min-h-10 overflow-hidden`}
        className={` flex min-h-11 min-w-[0%] max-w-[85%] flex-col items-end justify-end`}
      />
      <DarkmodeProvider>
        <Suspense
          fallback={
            accentColor ? (
              <Subloader color={accentColor} bgColor={themes?.bgCard} />
            ) : (
              <MainpageLoader />
            )
          }
        >
          <ComponentProvider>
            <ReactFlowProvider>
              <Layout
                sessionToken={sessionToken}
                ck={clientDetails?.client}
                tennant={clientDetails?.tenant}
                profileImg={clientDetails?.profile}
                clientLoginId={clientDetails?.loginId}
                selectedTheme={themes}
                selectedAccntColor={accentColor}
                currentArtifactKey={currentArtifactKey}
              />
            </ReactFlowProvider>
          </ComponentProvider>
        </Suspense>
      </DarkmodeProvider>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
