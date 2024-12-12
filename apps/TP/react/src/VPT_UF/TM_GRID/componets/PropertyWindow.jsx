import TorusModularInput from '../../../torusComponents/TorusModularInput';
import { useComponent } from '../contexts/Componet';

const NodePropertyWindow = ({ selectedTheme }) => {
  const component = useComponent();

  if (
    !component.selectedComponent ||
    !component?.state?.[component.selectedComponent]
  )
    return (
      <div className="border border-gray-300 p-4 text-[0.72vw]">
        Select a node to edit properties
      </div>
    );
  const { id, grid } = component.state?.[component.selectedComponent];
  return (
    <>
      {grid &&
        Object.keys(grid).map((key) => {
          if (typeof grid?.[key] === 'object') {
            return (
              <>
                {Object.keys(grid?.[key]).map((k) => (
                  <>
                    <div
                      key={id + key + k}
                      className="mt-0 w-full "
                      // key={`${key}_${value}`}
                    >
                      <TorusModularInput
                        key={id + key + k}
                        label={key + '-' + k}
                        isRequired={true}
                        type="text"
                        placeholder="Type Key..."
                        bgColor={`${selectedTheme && selectedTheme?.bgCard}`}
                        textColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                        labelColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                        labelSize={'text-[0.62vw] pl-[0.25vw]'}
                        outlineColor="#cbd5e1"
                        radius="sm"
                        size=""
                        isReadOnly={false}
                        isDisabled={false}
                        errorShown={false}
                        isClearable={true}
                        backgroundColor={'bg-white dark:bg-[#161616]'}
                        onChange={(e) => {
                          component.UpdateComponet(id, {
                            ...grid,
                            [key]: {
                              ...grid?.[key],
                              [k]: e,
                            },
                          });
                        }}
                        value={grid?.[key]?.[k]}
                        textSize={'text-[0.83vw]'}
                        inputClassName={'px-[0.25vw] py-[0.55vh]'}
                        wrapperClass={'px-[0.25vw] py-[0.55vh]'}
                      />
                    </div>
                    {/* <label key={k}>
                      {k}:
                      <input
                        type="text"
                        accept="number"
                        value={grid?.[key]?.[k]}
                        onChange={(e) =>
                          component.UpdateComponet(id, {
                            ...grid,
                            [key]: {
                              ...grid?.[key],
                              [k]: e.target.value,
                            },
                          })
                        }
                        className="mb-2 block border p-1"
                      />
                    </label> */}
                  </>
                ))}
              </>
            );
          } else {
            return (
              <>
                <div
                  key={key}
                  className="mt-0 w-full "
                  // key={`${key}_${value}`}
                >
                  <TorusModularInput
                    key={id + key}
                    label={key}
                    isRequired={true}
                    type="text"
                    placeholder="Type Key..."
                    bgColor={`${selectedTheme && selectedTheme?.bgCard}`}
                    textColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                    labelColor={`${selectedTheme && `text-[${selectedTheme?.text}]`}`}
                    labelSize={'text-[0.62vw] pl-[0.25vw]'}
                    outlineColor="#cbd5e1"
                    radius="sm"
                    size=""
                    isReadOnly={false}
                    isDisabled={false}
                    errorShown={false}
                    isClearable={true}
                    backgroundColor={'bg-white dark:bg-[#161616]'}
                    onChange={(e) => {
                      component.UpdateComponet(id, {
                        ...grid,
                        [key]: e,
                      });
                    }}
                    defaultValue={grid?.[key]}
                    textSize={'text-[0.83vw]'}
                    inputClassName={'px-[0.25vw] py-[0.55vh]'}
                    wrapperClass={'px-[0.25vw] py-[0.55vh]'}
                  />
                </div>
                {/* 
                <label key={key}>
                  {key}:
                  <input
                    type="text"
                    value={grid?.[key]}
                    onChange={(e) =>
                      component.UpdateComponet(id, {
                        ...grid,
                        [key]: e.target.value || '1',
                      })
                    }
                    className="mb-2 block border p-1"
                  />
                </label> */}
              </>
            );
          }
        })}
    </>
  );
};

export default NodePropertyWindow;
