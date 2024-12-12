/* eslint-disable */
import React, {
  forwardRef,
  lazy,
  memo,
  Suspense,
  useContext,
  useMemo,
} from 'react';

import { TorusModellerContext } from './Layout';
import AppAIF from './TM_AIF/AIFMain';
import AppDF from './VPT_DF/VPT_DF_ERD/Components/App';
import AppDFD from './VPT_DFD/components/App';
import AppPF from './VPT_PF/VPT_PF_PFD/components/App';
import AppUF from './VPT_UF/VPT_UF_SLD/components/App';
import { Subloader } from './asset/SvgsApplication';
const APPDO = lazy(() => import('./VPT_DO/App'));
const proOptions = { hideAttribution: true };
export const FabricsSelector = memo(
  forwardRef(
    (
      {
        nodes,
        edges,
        setEdges,
        setNodes,
        children,
        onEdgesChange,
        onNodesChange,
        undoRedo,
      },
      ref,
    ) => {
      const {
        mainFabric,
        selectedFabric,
        selectedSubFlow,
        selectedAccntColor,
        selectedTheme,
      } = useContext(TorusModellerContext);

      const cycleFabric = useMemo(() => {
        if (selectedSubFlow) {
          return (
            <Suspense
              fallback={
                <Subloader
                  color={selectedAccntColor}
                  bgColor={selectedTheme?.bgCard}
                />
              }
            >
              <div className="relative flex h-full w-full items-center justify-center dark:text-white">
                <APPDO
                  nodes={nodes}
                  edges={edges}
                  setEdges={setEdges}
                  setNodes={setNodes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  children={children}
                  proOptions={proOptions}
                />
              </div>
            </Suspense>
          );
        } else
          switch (mainFabric) {
            case 'Home':
              window.location.href = process.env.REACT_APP_REDIRECT_URL;
              break;
            case 'DF':
              switch (selectedFabric) {
                case 'DF-DFD':
                  return (
                    <AppDFD
                      nodes={nodes}
                      edges={edges}
                      setEdges={setEdges}
                      setNodes={setNodes}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      children={children}
                      proOptions={proOptions}
                      undoRedo={undoRedo}
                      ref={ref}
                    />
                  );
                case 'DF-ERD':
                  return (
                    <AppDF
                      nodes={nodes}
                      edges={edges}
                      setEdges={setEdges}
                      setNodes={setNodes}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      children={children}
                      proOptions={proOptions}
                      undoRedo={undoRedo}
                      ref={ref}
                    />
                  );
              }

            case 'UF':
              return (
                <AppUF
                  nodes={nodes}
                  edges={edges}
                  setEdges={setEdges}
                  setNodes={setNodes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  children={children}
                  proOptions={proOptions}
                  ref={ref}
                />
              );

            case 'PF':
              return (
                <AppPF
                  nodes={nodes}
                  edges={edges}
                  setEdges={setEdges}
                  setNodes={setNodes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  children={children}
                  proOptions={proOptions}
                  undoRedo={undoRedo}
                  ref={ref}
                />
              );

            case 'AIF':
              return <AppAIF children={children} />;

            case 'ASSEMBLER':
              window.location.href =
                process.env.REACT_APP_REDIRECT_URL_ASSEMBLER;
              break;
            default:
              return (
                <div className="relative flex h-full w-full items-center justify-center italic dark:text-white">
                  No Tab Selected
                </div>
              );
          }
      });

      return cycleFabric;
    },
  ),
);
