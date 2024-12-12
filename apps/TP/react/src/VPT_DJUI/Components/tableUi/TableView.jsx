import React from 'react';
import Builder from '../../builder';

export default function TableView({
  methodProps,
  attributesProps,
  tabopen,
  children,
}) {
  return (
    <div className=" h-full w-full rounded-xl ">
      <div
        className={
          ' h-full w-full  ' +
          (tabopen === 1 ? ' flex items-center justify-center' : ' hidden')
        }
      >
        <Builder {...attributesProps} children={children} />
      </div>
      <div
        className={
          ' h-full w-full  ' +
          (tabopen === 2 ? ' flex items-center justify-center' : ' hidden')
        }
      >
        {methodProps?.defaultJSOn && methodProps?.defaultJSOn?.length > 0 ? (
          <Builder {...methodProps} children={children} />
        ) : (
          <div className="flex h-[100%] w-[100%] flex-col ">
            {children &&
              typeof children === 'function' &&
              children({
                children: ({ achildren }) => (
                  <div className="flex justify-end gap-[0.5vw]">
                    {achildren}
                  </div>
                ),
              })}
            <div className="flex h-[60%] w-[100%] items-center justify-center">
              column found for this node
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
