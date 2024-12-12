import React, { forwardRef, useContext, useEffect, useState } from 'react';
import { TenantDefaultIcon } from './SVG_Application';
import { TorusModellerContext } from './Layout';
import { isLightColor } from './asset/themes/useTheme';

export function TenantSelector({ selectedTenantObj, clientTenants, selectedTenant }) {
  // const [FAB_logo, setFAB_logo] = React.useState(null);
  const avatarRef = React.useRef(null);

  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);

  // console.log(selectedTenant, '<<--selectedTenant--->>sele');

  // useEffect(() => {
  //   if (selectedTenantObj?.length > 0) {
  //     setFAB_logo(selectedTenantObj[0]);
  //   } else {
  //     setFAB_logo(null);
  //   }
  // }, [selectedTenantObj]);

  // useEffect(() => {
  //   if (clientTenants && clientTenants.length > 0) {
  //     const fndMatchingTennant = clientTenants?.filter((tenant) => {
  //       if (tenant.code === selectedTenant) {
  //         return tenant;
  //       }
  //     });

  //     if (fndMatchingTennant?.length > 0) {
  //       setFAB_logo(fndMatchingTennant[0]);
  //     }
  //   }
  // }, [selectedTenant, clientTenants]);

  return (
    <div
      className="flex h-[100%] w-[100%] items-center justify-center rounded-md "
      title={selectedTenantObj?.name}
    >
      {selectedTenantObj ? (
        <TenantAvatar
          imageUrl={selectedTenantObj.logo}
          name={selectedTenantObj.name}
          size={'2vw'}
          ref={avatarRef}
        />
      ) : (
        <div
          className="h-[2vw] w-[2vw]  "
          style={{
            borderRadius: '25%',
            backgroundColor: `${selectedAccntColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.93vw',
            color: '#fff',
            textTransform: 'uppercase',
            overflow: 'hidden',
          }}
        >
          {}
        </div>
      )}
    </div>
  );
}

export function TenantList({
  clientTenants,
  setSelectedTenant,
  selectedTenant,
  close,
  selectedTenantObj,
  setSelectedTenantObj
}) {
  console.log(selectedTenant, '<<--selectedTenant--->>list');
  const { selectedTheme, selectedAccntColor } =
    useContext(TorusModellerContext);

  return (
    <>
      {clientTenants && clientTenants.length > 0 ? (
        clientTenants?.map((tenant) => {
          return (
            <div
              className={`w-[100%] rounded-md px-[1.25vw] `}
              onClick={() => {
                setSelectedTenantObj(tenant);
                setSelectedTenant(tenant.code);
                close();
              }}
              // style={{
              //   backgroundColor:
              //     tenant.code === selectedTenant
              //       ? `${selectedTheme?.text}80`
              //       : `${selectedTheme?.bgCard}`,
              // }}
            >
              <div className="my-[0.5vw] grid w-[100%] cursor-pointer grid-cols-12 gap-[0.5vw]">
                <div className="col-span-3 flex w-[100%] items-center justify-center">
                  <div className="flex w-[100%] justify-start">
                    <TenantAvatar
                      imageUrl={tenant.logo}
                      name={tenant.name}
                      size={'2vw'}
                    />
                  </div>
                </div>
                <div className="col-span-9">
                  <div className="flex w-[100%]">
                    <div className="flex w-[80%] flex-col">
                      <div className="w-[100%]">
                        <p
                          className="text-[0.65vw] font-[400]"
                          style={{
                            color:
                              tenant.code === selectedTenant
                                ? `${selectedTheme?.text}`
                                : `${selectedTheme?.text}`,
                          }}
                        >
                          {tenant.name}
                        </p>
                      </div>
                      <div className="grid grid-cols-8">
                        <div className="col-span-6">
                          <p
                            className="text-[0.65vw] font-[500]"
                            style={{
                              color:
                                tenant.code === selectedTenant
                                  ? `${selectedTheme?.text}`
                                  : `${selectedTheme?.text}80`,
                            }}
                          >
                            {tenant.code}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-[20%] items-center justify-center">
                      <div className="flex w-[100%] items-center justify-center ">
                        <div
                          style={{
                            backgroundColor:
                              tenant.code === selectedTenant
                                ? `${selectedAccntColor}`
                                : 'transparent',
                            width: '0.5vw',
                            height: '0.5vw',
                            borderRadius: '50%',
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex h-[100%] w-[100%] items-center justify-center">
          <span className="font-semibold italic text-[#667085]">
            No tenants
          </span>
        </div>
      )}
    </>
  );
}

export const TenantAvatar = forwardRef(({ imageUrl, name, size }, ref) => {
  const { selectedAccntColor } = useContext(TorusModellerContext);
  const [hasError, setHasError] = useState(false);
  const initials =
    name?.split(' ').length > 1
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()
      : name.slice(0, 3).toUpperCase();

  const calculateFontSize = (size) => {
    if (typeof size === 'number') {
      return `${size / 2.5}px`;
    }

    const numericValue = parseFloat(size);
    if (size.includes('vw') || size.includes('vh')) {
      return `${numericValue / 2.5}vw`;
    } else {
      return `${numericValue / 2.5}px`;
    }
  };

  const checkImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;

      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
    });
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: '25%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: calculateFontSize(size),
    backgroundColor: `${imageUrl ? 'transparent' : `${selectedAccntColor}`}`,
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    color: '#fff',
    textTransform: 'uppercase',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '25%',
  };

  return (
    <div style={avatarStyle} ref={ref}>
      {imageUrl ? (
        <>
          {!hasError ? (
            <img
              src={imageUrl}
              alt={name}
              style={imageStyle}
              onError={() => setHasError(true)}
            />
          ) : (
            <div
              style={{
                width: '150px',
                height: '150px',
                backgroundColor: selectedAccntColor,
                color:
                  isLightColor(selectedAccntColor) === 'light'
                    ? '#000'
                    : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72vw',
                fontWeight: 'bold',
                borderRadius: '50%',
              }}
            >
              {initials}
            </div>
          )}
        </>
      ) : (
        <span
        style={{
          fontSize: '0.72vw',
        }}
        >{initials}</span>
      )}
    </div>
  );
});
