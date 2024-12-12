import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { NavbarArrowDown } from '../../SVG_Application';
import { Text } from 'react-aria-components';
import { TorusModellerContext } from '../../Layout';
import gsap from 'gsap';

export default function SecurityTree({ organizationData }) {
  return (
    <div className="flex w-full flex-col gap-[0.83vh]">
      {organizationData?.map((item) => {
        let keys = Object.keys(item).filter((key) => Array.isArray(item[key]));
        return <DisplayTree item={item} keys={keys} />;
      })}
    </div>
  );
}

const DisplayTree = ({ item, keys }) => {
  const [show, setShow] = useState(false);
  const { selectedTheme } = useContext(TorusModellerContext);
  const childref = useRef(null);

  const name = useMemo(() => {
    let nameKeys = Object.keys(item).filter((key) =>
      key.toLowerCase().endsWith('name'),
    );
    return nameKeys.length > 0 ? item[nameKeys[0]] : null;
  }, [item]);

  useEffect(() => {
    if (childref.current) {
      const element = childref.current;
  
      if (show) {
        
        element.style.height = `${element.scrollHeight}px`;
  
        gsap.fromTo(
          element,
          { height: 0, opacity: 0 },
          {
            height: element.scrollHeight, 
            opacity: 1,
            duration: 0.5,
            ease: 'power1.inOut',
            onComplete: () => {
              element.style.height = 'auto'; 
            },
          }
        );
      } else {
       
        element.style.height = `${element.scrollHeight}px`;
  
        gsap.to(element, {
          height: 0, 
          opacity: 0,
          duration: 0.5,
          ease: 'power1.inOut',
          onComplete: () => {
            element.style.height = '0';
          },
        });
      }
    }
  }, [show]);
  
  

  return (
    <div className="flex w-full flex-col gap-[0.83vh]">
      <div>
        <div
          className="flex h-[3.87vh] cursor-pointer items-center justify-start gap-[0.30vw] rounded-[3vw] px-[0.78vw]"
          style={{
            backgroundColor: selectedTheme?.bgCard,
            borderColor: `${selectedTheme?.text}80`,
            borderStyle:"solid",
            borderWidth:"1px",
          }}
          onClick={() => keys && keys.length > 0 && setShow(!show)}
        >
          {keys && keys.length > 0 && (
            <span>
              <NavbarArrowDown
                className={`w-[0.52vw] transition-transform ease-in ${show ? '' : 'rotate-[-90deg]'}`}
                stroke={`${selectedTheme?.text}90`}
              />
            </span>
          )}
          <Text className="text-[0.62vw] font-medium leading-[1.34vh] dark:text-white/50">
            {name}
          </Text>
        </div>
      </div>

      <div
        ref={childref}
        className={`overflow-hidden transition-all border-l-1`}
        style={{
          height: show ? 'auto' : 0,
          borderColor: selectedTheme?.border,
        }}
      >
        {show &&
          keys?.map((key) => (
            <div key={key} className="ml-3">
              <SecurityTree organizationData={item[key]} />
            </div>
          ))}
      </div>
    </div>
  );
};

